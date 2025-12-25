import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

const CommunityPanel = () => {
  const router = useRouter();
  // State management
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState({});
  const [error, setError] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerPostId, setEmojiPickerPostId] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const filterDropdownRef = useRef(null);
  const emojis = ['😊', '👍', '❤️', '😮', '😂', '🎉', '👏', '🔥'];

  // Animation states
  const [animatedPosts, setAnimatedPosts] = useState({});
  const postContainerRef = useRef(null);
  
  // Mock user data
  const currentUser = {
    id: 'user1',
    name: 'Shreyas Gupta',
    avatar: 'https://images.unsplash.com/photo-1537511446984-935f663eb1f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock initial posts with different content types
  useEffect(() => {
    const mockPosts = [
      {
        _id: '1',
        user: {
          id: 'user2',
          name: 'Aishwarya Singh',
          avatar: '/aish.webp'
        },
        content: 'Welcome to our community! This is a safe space for all of us to connect and share our experiences.',
        mediaType: null,
        mediaUrl: null,
        likes: ['user3', 'user4'],
        comments: [
          { _id: 'c1', user: { id: 'user3', name: 'Tanmay Sharma', avatar: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' }, content: 'Great to be here!', createdAt: new Date(Date.now() - 3600000) }
        ],
        reactions: [
          { _id: 'r1', userId: 'user3', reaction: '😊', createdAt: new Date(Date.now() - 7200000) }
        ],
        createdAt: new Date(Date.now() - 86400000),
        tags: ['welcome', 'community']
      },
      {
        _id: '2',
        user: {
          id: 'user3',
          name: 'Tanmay Sharma',
          avatar: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80'
        },
        content: 'Just finished an amazing art project at school today! So proud of how it turned out. #artisticjourney',
        mediaType: 'image',
        mediaUrl: '/art.jpg',
        likes: ['user1', 'user2'],
        comments: [],
        reactions: [],
        createdAt: new Date(Date.now() - 43200000),
        tags: ['art', 'school']
      },
      {
        _id: '3',
        user: {
          id: 'user4',
          name: 'Arjun Mehta',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80'
        },
        content: 'Our cricket team won the district championship yesterday! So proud of everyone. Big thanks to our coach for all the training sessions!',
        mediaType: 'video',
        mediaUrl: 'https://player.vimeo.com/external/477260025.sd.mp4?s=10cd445d97f5ed14b25e249af0e6eae4a40b1f01&profile_id=164&oauth2_token_id=57447761',
        likes: [],
        comments: [
          { _id: 'c2', user: { id: 'user1', name: 'Shreyas Gupta', avatar: currentUser.avatar }, content: 'Congratulations! 🎉', createdAt: new Date(Date.now() - 1800000) }
        ],
        reactions: [
          { _id: 'r2', userId: 'user2', reaction: '👏', createdAt: new Date(Date.now() - 3600000) },
          { _id: 'r3', userId: 'user1', reaction: '🔥', createdAt: new Date(Date.now() - 7200000) }
        ],
        createdAt: new Date(Date.now() - 21600000),
        tags: ['sports', 'cricket', 'championship']
      },
      {
        _id: '4',
        user: {
          id: 'user5',
          name: 'Priya Patel',
          avatar: 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80'
        },
        content: 'Got selected for the state-level science competition! All those late nights studying finally paid off. Wish me luck for the finals next month!',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        likes: ['user1', 'user2', 'user3'],
        comments: [
          { _id: 'c3', user: { id: 'user3', name: 'Tanmay Sharma', avatar: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' }, content: 'Congrats!', createdAt: new Date(Date.now() - 7200000) }
        ],
        reactions: [
          { _id: 'r4', userId: 'user2', reaction: '🎉', createdAt: new Date(Date.now() - 10800000) }
        ],
        createdAt: new Date(Date.now() - 129600000),
        tags: ['science', 'competition', 'achievement']
      },
      {
        _id: '5',
        user: {
          id: 'user6',
          name: 'Vikram Singh',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80'
        },
        content: 'Just finished reading "The Immortals of Meluha". What an amazing journey through Indian mythology! Has anyone read the complete trilogy?',
        mediaType: null,
        mediaUrl: null,
        likes: ['user4'],
        comments: [
          { _id: 'c4', user: { id: 'user5', name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' }, content: 'Yes! The whole Shiva trilogy is amazing.', createdAt: new Date(Date.now() - 5400000) }
        ],
        reactions: [
          { _id: 'r5', userId: 'user1', reaction: '👍', createdAt: new Date(Date.now() - 14400000) }
        ],
        createdAt: new Date(Date.now() - 172800000),
        tags: ['books', 'reading', 'mythology']
      }
    ];
    setPosts(mockPosts);
    
    // Initialize animation states
    const initialAnimStates = {};
    mockPosts.forEach(post => {
      initialAnimStates[post._id] = true;
    });
    setAnimatedPosts(initialAnimStates);
  }, []);

  // Handle media selection for new posts
  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSelectedMedia(file);
    
    // Create preview
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const fileType = file.type.split('/')[0];
      setPreviewMedia({
        type: fileType,
        url: e.target.result
      });
    };
    fileReader.readAsDataURL(file);
  };

  // Clear media selection
  const handleClearMedia = () => {
    setSelectedMedia(null);
    setPreviewMedia(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Create a new post
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.trim() && !selectedMedia) {
      setError('Please add some text or media to your post');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      let mediaType = null;
      let mediaUrl = null;
      
      if (selectedMedia) {
        mediaType = selectedMedia.type.startsWith('image') ? 'image' : 'video';
        // In a real app, we would upload the file and get a URL back
        // For demo purposes, we'll use the preview URL
        mediaUrl = previewMedia.url;
      }

      const newPostObj = {
        _id: Date.now().toString(),
        user: currentUser,
        content: newPost.trim(),
        mediaType,
        mediaUrl,
        likes: [],
        comments: [],
        reactions: [],
        createdAt: new Date(),
        tags: extractTags(newPost)
      };

      setPosts([newPostObj, ...posts]);
      setNewPost('');
      setSelectedMedia(null);
      setPreviewMedia(null);
      setIsSubmitting(false);
      
      // Animate the new post
      setAnimatedPosts(prev => ({
        [newPostObj._id]: true,
        ...prev
      }));
      
      // Scroll to top to see the new post
      if (postContainerRef.current) {
        postContainerRef.current.scrollTop = 0;
      }
    }, 800);
  };

  // Extract hashtags from post content
  const extractTags = (content) => {
    const tags = [];
    const matches = content.match(/#(\w+)/g);
    if (matches) {
      matches.forEach(tag => {
        tags.push(tag.substring(1).toLowerCase());
      });
    }
    return tags;
  };

  // Handle like action
  const handleLike = (postId) => {
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
  };

  // Handle reaction action
  const handleReact = (postId, reaction) => {
    setPosts(posts.map(post => {
      if (post._id === postId) {
        // Check if user already has this reaction
        const existingReaction = post.reactions.find(r => 
          r.userId === currentUser.id && r.reaction === reaction
        );
        
        let updatedReactions;
        
        if (existingReaction) {
          // Remove reaction if it exists
          updatedReactions = post.reactions.filter(r => 
            !(r.userId === currentUser.id && r.reaction === reaction)
          );
        } else {
          // Add new reaction
          updatedReactions = [
            ...post.reactions.filter(r => r.userId !== currentUser.id || r.reaction !== reaction),
            {
              _id: Date.now().toString(),
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
    
    // Close emoji picker
    setShowEmojiPicker(false);
    setEmojiPickerPostId(null);
  };

  // Handle comment submission
  const handleComment = (postId, e) => {
    e.preventDefault();
    if (!newComment[postId]?.trim()) return;

    setPosts(posts.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            _id: Date.now().toString(),
            user: currentUser,
            content: newComment[postId],
            createdAt: new Date()
          }]
        };
      }
      return post;
    }));

    setNewComment({ ...newComment, [postId]: '' });
  };

  // Toggle emoji picker
  const toggleEmojiPicker = (postId) => {
    if (emojiPickerPostId === postId && showEmojiPicker) {
      setShowEmojiPicker(false);
      setEmojiPickerPostId(null);
    } else {
      setShowEmojiPicker(true);
      setEmojiPickerPostId(postId);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Filter posts based on active tab
  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    if (activeTab === 'images') return post.mediaType === 'image';
    if (activeTab === 'videos') return post.mediaType === 'video';
    if (activeTab === 'text') return !post.mediaType;
    return true;
  });

  // Go to profile page
  const goToProfile = () => {
    router.push('/ProfileCommunity');
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#1d1d1f]">
      <Navbar />
      <br></br>
      <br></br>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header with Profile Icon */}
        <div className="mb-8 relative">
          <div className="absolute right-0 top-0 flex items-center space-x-4">
            {/* Filter Dropdown */}
            <div className="relative" ref={filterDropdownRef}>
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1d1d1f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-20">
                  <div className="py-1">
                    {['all', 'text', 'images', 'videos'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          setShowFilterDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          activeTab === tab 
                          ? 'bg-[#f5f5f7] text-[#0071e3] font-medium' 
                          : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Icon */}
            <button 
              onClick={goToProfile}
              className="p-1 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200"
            >
              <img 
                src={currentUser.avatar} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          </div>
          
          <div className="text-center pt-2">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Community Space</h1>
            <p className="text-[#86868b] mb-6">Connect, share, and grow together</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-[#fde2e2] text-[#ef4444] p-4 rounded-xl mb-6 transition-all duration-300 animate-fadeIn">
            {error}
          </div>
        )}
        {/* Create Post Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 transition-all duration-300">
          <form onSubmit={handleCreatePost}>
            <div className="flex items-start gap-3 mb-4">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share something with the community..."
                className="flex-1 p-4 rounded-xl bg-[#f5f5f7] border-0 text-[#1d1d1f] placeholder-[#86868b] resize-none focus:ring-2 focus:ring-[#0071e3] transition-all duration-200"
                rows="3"
              />
            </div>
            
            {/* Media Preview */}
            {previewMedia && (
              <div className="relative mb-4 rounded-xl overflow-hidden bg-[#f5f5f7]">
                <button
                  type="button"
                  onClick={handleClearMedia}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors duration-200 z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {previewMedia.type === 'image' ? (
                  <img 
                    src={previewMedia.url} 
                    alt="Preview" 
                    className="max-h-80 w-full object-contain"
                  />
                ) : (
                  <video 
                    src={previewMedia.url} 
                    controls 
                    className="max-h-80 w-full"
                  />
                )}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 rounded-full text-[#0071e3] hover:bg-[#0071e3]/10 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaSelect}
                  accept="image/*,video/*"
                  className="hidden"
                />
                <button
                  type="button"
                  className="p-2 rounded-full text-[#0071e3] hover:bg-[#0071e3]/10 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-5 py-2 rounded-full bg-[#0071e3] text-white font-medium transition-all duration-300 ${
                  isSubmitting 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:bg-[#0077ed] transform hover:scale-105 active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </span>
                ) : 'Post'}
              </button>
            </div>
          </form>
        </div>

         {/* Filter indication */}
         {activeTab !== 'all' && (
          <div className="mb-4 flex items-center">
            <span className="text-sm text-[#86868b]">Showing: </span>
            <span className="ml-2 px-3 py-1 bg-[#0071e3]/10 text-[#0071e3] text-sm font-medium rounded-full">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </span>
            <button 
              onClick={() => setActiveTab('all')}
              className="ml-2 text-sm text-[#0071e3] hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-6" ref={postContainerRef}>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#86868b] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">No posts yet</h3>
              <p className="text-[#86868b]">Be the first to share something in this category!</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div 
                key={post._id} 
                className={`bg-white rounded-2xl p-6 shadow-sm transition-all duration-500 ${
                  animatedPosts[post._id] ? 'animate-fadeInUp opacity-100' : 'opacity-0'
                }`}
                onAnimationEnd={() => {
                  setAnimatedPosts(prev => ({...prev, [post._id]: false}));
                }}
              >
                {/* Post Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.user.avatar} 
                      alt={post.user.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-[#1d1d1f]">{post.user.name}</h3>
                      <p className="text-xs text-[#86868b]">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                  <button className="text-[#86868b] hover:text-[#1d1d1f] transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
                
                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-[#1d1d1f] mb-4">{post.content}</p>
                  
                  {/* Post Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-[#f5f5f7] rounded-full text-xs text-[#86868b]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Post Media */}
                  {post.mediaType === 'image' && (
                    <div className="rounded-xl overflow-hidden bg-[#f5f5f7] mb-4">
                      <img 
                        src={post.mediaUrl} 
                        alt="Post media" 
                        className="w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  {post.mediaType === 'video' && (
                    <div className="rounded-xl overflow-hidden bg-[#f5f5f7] mb-4">
                      <video 
                        src={post.mediaUrl} 
                        controls 
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
                
                {/* Post Stats */}
                <div className="flex justify-between items-center text-sm text-[#86868b] mb-4">
                  <div>
                    {post.likes.length > 0 && (
                      <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
                    )}
                  </div>
                  <div>
                    {post.comments.length > 0 && (
                      <span>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
                    )}
                  </div>
                </div>
                
                {/* Post Actions */}
                <div className="flex items-center border-t border-b border-[#f5f5f7] py-2 mb-4">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex-1 flex justify-center items-center gap-2 p-2 rounded-md transition-colors duration-200 ${
                      post.likes.includes(currentUser.id)
                        ? 'text-[#0071e3] bg-[#0071e3]/10'
                        : 'text-[#86868b] hover:bg-[#f5f5f7]'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={post.likes.includes(currentUser.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={post.likes.includes(currentUser.id) ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Like</span>
                  </button>
                  
                  <div className="relative flex-1">
                    <button
                      onClick={() => toggleEmojiPicker(post._id)}
                      className="w-full flex justify-center items-center gap-2 p-2 rounded-md text-[#86868b] hover:bg-[#f5f5f7] transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>React</span>
                    </button>
                    
                    {showEmojiPicker && emojiPickerPostId === post._id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-xl p-2 shadow-md border border-[#f5f5f7] z-10 flex">
                        {emojis.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleReact(post._id, emoji)}
                            className="p-2 text-xl hover:bg-[#f5f5f7] rounded-lg transition-colors duration-200"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      const commentInput = document.getElementById(`comment-${post._id}`);
                      if (commentInput) commentInput.focus();
                    }}
                    className="flex-1 flex justify-center items-center gap-2 p-2 rounded-md text-[#86868b] hover:bg-[#f5f5f7] transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Comment</span>
                  </button>
                </div>
                
                {/* Reactions Summary */}
                {post.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {emojis.filter(emoji => 
                      post.reactions.some(r => r.reaction === emoji)
                    ).map(emoji => {
                      const count = post.reactions.filter(r => r.reaction === emoji).length;
                      const hasReacted = post.reactions.some(r => 
                        r.userId === currentUser.id && r.reaction === emoji
                      );
                      
                      return (
                        <button
                          key={emoji}
                          onClick={() => handleReact(post._id, emoji)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            hasReacted 
                              ? 'bg-[#0071e3]/10 text-[#0071e3]' 
                              : 'bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed]'
                          } transition-colors duration-200`}
                        >
                          <span>{emoji}</span>
                          <span>{count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {/* Comments */}
                {post.comments.length > 0 && (
                  <div className="space-y-4 mb-4">
                    {post.comments.map(comment => (
                      <div key={comment._id} className="flex gap-3">
                        <img 
                          src={comment.user.avatar} 
                          alt={comment.user.name} 
                          className="w-8 h-8 rounded-full object-cover mt-1"
                        />
                        <div className="flex-1">
                          <div className="bg-[#f5f5f7] p-3 rounded-xl">
                            <p className="text-sm font-medium">{comment.user.name}</p>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                          <div className="flex gap-4 mt-1 text-xs text-[#86868b]">
                            <span>{formatDate(comment.createdAt)}</span>
                            <button className="hover:text-[#1d1d1f] transition-colors duration-200">Like</button>
                            <button className="hover:text-[#1d1d1f] transition-colors duration-200">Reply</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Comment Form */}
                <form onSubmit={(e) => handleComment(post._id, e)} className="flex gap-3">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 relative">
                    <input
                      id={`comment-${post._id}`}
                      value={newComment[post._id] || ''}
                      onChange={(e) => setNewComment({
                        ...newComment,
                        [post._id]: e.target.value
                      })}
                      placeholder="Write a comment..."
                      className="w-full py-2 px-4 pr-12 bg-[#f5f5f7] border-0 rounded-full text-sm focus:ring-2 focus:ring-[#0071e3] transition-all duration-200"
                    />
                    <button
                      type="submit"
                      disabled={!newComment[post._id]?.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0071e3] p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPanel;
