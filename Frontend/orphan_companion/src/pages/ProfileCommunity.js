import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const Profile = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('posts');
  
  // Mock user data
  const user = {
    id: 'user1',
    name: 'Shreyas Gupta',
    avatar: 'https://images.unsplash.com/photo-1537511446984-935f663eb1f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1617369120004-4fc70312c5e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    bio: 'Student at Mumbai Public School | Art enthusiast | Cricket lover',
    location: 'Maharashtra, India',
    joinedDate: 'Joined June 2022',
    following: 245,
    followers: 132,
    interests: ['Art', 'Cricket', 'Reading', 'Music', 'Photography']
  };
  
  // Mock posts
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    // Mock data - would typically come from an API
    const mockPosts = [
      {
        _id: '1',
        content: 'Just finished my final art project for the year! #ArtLife',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        likes: ['user2', 'user3', 'user4'],
        comments: [
          { _id: 'c1', user: { id: 'user2', name: 'Aishwarya Singh', avatar: 'https://images.unsplash.com/photo-1611619100112-84315a750f9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' }, content: 'This looks amazing! Love the colors.', createdAt: new Date(Date.now() - 3600000) }
        ],
        createdAt: new Date(Date.now() - 86400000)
      },
      {
        _id: '2',
        content: 'Cricket practice was intense today. Working on my bowling technique!',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        likes: ['user3'],
        comments: [],
        createdAt: new Date(Date.now() - 172800000)
      },
      {
        _id: '3',
        content: 'Visited the new art exhibition at the National Gallery today. So inspiring!',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1577720643272-265f09367456?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        likes: ['user2', 'user4'],
        comments: [
          { _id: 'c2', user: { id: 'user4', name: 'Arjun Mehta', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' }, content: 'I need to check this out!', createdAt: new Date(Date.now() - 1800000) }
        ],
        createdAt: new Date(Date.now() - 259200000)
      }
    ];
    
    setPosts(mockPosts);
  }, []);
  
  // Format date for display
  const formatDate = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };
  
  // Go back to community
  const goToCommunity = () => {
    router.push('/');
  };
  
  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#1d1d1f]">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-10">
        <button 
          onClick={goToCommunity}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1d1d1f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>
      
      {/* Cover Image */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <img 
          src={user.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40"></div>
      </div>
      
      {/* Profile Information */}
      <div className="max-w-3xl mx-auto px-4 relative -mt-20">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md -mt-20"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
              <p className="text-[#86868b] text-sm mb-2">{user.location} • {user.joinedDate}</p>
              <p className="mb-4">{user.bio}</p>
              <div className="flex gap-4 text-sm">
                <span><strong>{user.following}</strong> Following</span>
                <span><strong>{user.followers}</strong> Followers</span>
              </div>
            </div>
            <button className="px-6 py-2 bg-[#0071e3] text-white rounded-full font-medium hover:bg-[#0077ed] transition-colors duration-200">
              Edit Profile
            </button>
          </div>
          
          {/* Interests */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-[#86868b] mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map(interest => (
                <span key={interest} className="px-3 py-1 bg-[#f5f5f7] rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="flex border-b border-[#f5f5f7]">
            {['posts', 'photos', 'likes'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center font-medium transition-all duration-200 ${
                  activeTab === tab 
                    ? 'text-[#0071e3] border-b-2 border-[#0071e3]' 
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {posts.map(post => (
                  <div key={post._id} className="border-b border-[#f5f5f7] pb-6 last:border-0 last:pb-0">
                    <p className="mb-4">{post.content}</p>
                    
                    {post.mediaType === 'image' && (
                      <div className="rounded-xl overflow-hidden bg-[#f5f5f7] mb-4">
                        <img 
                          src={post.mediaUrl} 
                          alt="Post media" 
                          className="w-full object-cover"
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
                    
                    <div className="flex justify-between items-center text-sm text-[#86868b]">
                      <div className="flex gap-4">
                        <span>{post.likes.length} likes</span>
                        <span>{post.comments.length} comments</span>
                      </div>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'photos' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {posts.filter(post => post.mediaType === 'image').map(post => (
                  <div key={post._id} className="aspect-square rounded-xl overflow-hidden bg-[#f5f5f7] cursor-pointer hover:opacity-90 transition-opacity duration-200">
                    <img 
                      src={post.mediaUrl} 
                      alt="Post media" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'likes' && (
              <div className="py-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#86868b] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-xl font-medium mb-2">No liked posts yet</h3>
                <p className="text-[#86868b]">Posts you like will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;