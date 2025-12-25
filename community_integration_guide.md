# Community Page Supabase Integration Guide

This guide outlines the steps needed to integrate the existing Community.js page with Supabase for real-time data storage and retrieval.

## Step 1: Create Database Tables in Supabase

Execute the SQL script below in the Supabase SQL Editor:

```sql
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table for community posts
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video') OR media_type IS NULL),
  media_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table for post comments
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table for post likes
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(post_id, user_id)
);

-- Create table for post reactions (emojis)
CREATE TABLE IF NOT EXISTS post_reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(post_id, user_id, reaction)
);

-- Create table for user profiles with additional community info
CREATE TABLE IF NOT EXISTS community_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

## Step 2: Create the CommunityAdapter Component

Create a new file at `src/components/community/CommunityAdapter.js` with the code from our adapter. This adapter will handle:

1. Authentication and user profile management
2. Creating, reading, updating, and deleting posts
3. Handling likes, comments, and reactions
4. Media upload to Supabase storage

## Step 3: Modify the Community.js Page

1. Import the necessary components and hooks from the adapter:

```javascript
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { toast } from "sonner";
import { 
  useSupabaseAuth,
  createPost,
  likePost,
  addComment,
  addReaction,
  fetchPosts
} from '@/components/community/CommunityAdapter';
```

2. Replace the mock data setup with real data fetching:

```javascript
const CommunityPanel = () => {
  const router = useRouter();
  
  // Get current user data from Supabase
  const { currentUser, isLoading: isUserLoading } = useSupabaseAuth();
  
  // State management
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState({});
  const [error, setError] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerPostId, setEmojiPickerPostId] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);
  const filterDropdownRef = useRef(null);
  const postContainerRef = useRef(null);
  
  // Animation states
  const [animatedPosts, setAnimatedPosts] = useState({});
  
  // Constants
  const emojis = ['😊', '👍', '❤️', '😮', '😂', '🎉', '👏', '🔥'];
  
  // Fetch posts on component mount or when user changes
  useEffect(() => {
    if (currentUser) {
      loadPosts();
    }
  }, [currentUser]);
  
  // Load posts from Supabase
  const loadPosts = async () => {
    setIsLoading(true);
    
    const { success, posts: fetchedPosts, error: fetchError } = await fetchPosts();
    
    if (success) {
      setPosts(fetchedPosts);
      
      // Initialize animation states
      const initialAnimStates = {};
      fetchedPosts.forEach(post => {
        initialAnimStates[post._id] = true;
      });
      setAnimatedPosts(initialAnimStates);
    } else {
      setError('Failed to load posts: ' + fetchError);
      setTimeout(() => setError(''), 3000);
    }
    
    setIsLoading(false);
  };
```

3. Update the handler functions to use the adapter:

```javascript
  // Create a new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !selectedMedia) {
      setError('Please add some text or media to your post');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to post');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      const { success, post: newPostObj, error: postError } = await createPost(
        newPost,
        currentUser,
        selectedMedia
      );

      if (!success) {
        throw new Error(postError);
      }

      setPosts([newPostObj, ...posts]);
      setNewPost('');
      setSelectedMedia(null);
      setPreviewMedia(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Animate the new post
      setAnimatedPosts(prev => ({
        [newPostObj._id]: true,
        ...prev
      }));
      
      // Scroll to top to see the new post
      if (postContainerRef.current) {
        postContainerRef.current.scrollTop = 0;
      }
      
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message || 'Failed to create post');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle like action
  const handleLike = async (postId) => {
    if (!currentUser) {
      toast.error('You must be logged in to like posts');
      return;
    }
    
    try {
      // First update UI optimistically
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const hasLiked = post.likes.includes(currentUser.id);
          return {
            ...post,
            likes: hasLiked 
              ? post.likes.filter(id => id !== currentUser.id)
              : [...post.likes, currentUser.id]
          };
        }
        return post;
      }));
      
      // Then update database
      const { success, hasLiked, error: likeError } = await likePost(postId, currentUser.id);
      
      if (!success) {
        throw new Error(likeError);
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Failed to update like');
      
      // Revert UI change on error
      loadPosts();
    }
  };

  // Handle comment submission
  const handleComment = async (postId, e) => {
    e.preventDefault();
    if (!newComment[postId]?.trim()) return;
    
    if (!currentUser) {
      toast.error('You must be logged in to comment');
      return;
    }
    
    try {
      // First update UI optimistically
      const tempId = Math.random().toString();
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...post.comments, {
              _id: tempId,
              user: currentUser,
              content: newComment[postId],
              createdAt: new Date()
            }]
          };
        }
        return post;
      }));
      
      setNewComment({ ...newComment, [postId]: '' });
      
      // Then update database
      const { success, comment, error: commentError } = await addComment(
        postId,
        currentUser.id,
        currentUser.name,
        currentUser.avatar,
        newComment[postId]
      );
      
      if (!success) {
        throw new Error(commentError);
      }
      
      // Update comment ID in state
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.map(c => 
              c._id === tempId ? comment : c
            )
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      
      // Revert UI change on error
      loadPosts();
    }
  };

  // Handle reaction action
  const handleReact = async (postId, reaction) => {
    if (!currentUser) {
      toast.error('You must be logged in to react to posts');
      return;
    }
    
    try {
      const post = posts.find(p => p._id === postId);
      const existingReaction = post.reactions.find(r => 
        r.userId === currentUser.id && r.reaction === reaction
      );
      
      // First update UI optimistically
      setPosts(posts.map(post => {
        if (post._id === postId) {
          let updatedReactions;
          
          if (existingReaction) {
            // Remove reaction if it exists
            updatedReactions = post.reactions.filter(r => 
              !(r.userId === currentUser.id && r.reaction === reaction)
            );
          } else {
            // Add new reaction
            updatedReactions = [
              ...post.reactions.filter(r => r.userId !== currentUser.id),
              {
                _id: Math.random().toString(),
                userId: currentUser.id,
                reaction,
                createdAt: new Date()
              }
            ];
          }
          
          return {
            ...post,
            reactions: updatedReactions
          };
        }
        return post;
      }));
      
      // Then update database
      const { success, error: reactionError } = await addReaction(
        postId,
        currentUser.id,
        reaction
      );
      
      if (!success) {
        throw new Error(reactionError);
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
      toast.error('Failed to update reaction');
      
      // Revert UI change on error
      loadPosts();
    }
    
    // Close emoji picker
    setShowEmojiPicker(false);
    setEmojiPickerPostId(null);
  };
```

## Step 4: Set Up Storage in Supabase

1. Create a new bucket named "media" in the Supabase Storage.
2. Set up appropriate CORS policies to allow media uploads from your frontend.
3. Configure the bucket permissions to allow authenticated users to upload files.

## Step 5: Test the Integration

1. Make sure all dependencies are installed:
   ```bash
   npm install uuid @supabase/ssr sonner
   ```

2. Run the application and test each feature:
   - Creating posts
   - Uploading media
   - Liking posts
   - Adding comments
   - Adding emoji reactions

## Troubleshooting

- If you encounter CORS issues, check your Supabase project settings.
- If media uploads fail, check the storage bucket permissions.
- For authentication issues, make sure the user is properly logged in.
- Use browser developer tools to debug any JavaScript errors. 