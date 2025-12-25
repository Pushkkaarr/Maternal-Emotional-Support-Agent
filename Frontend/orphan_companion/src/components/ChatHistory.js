'use client';

import React from 'react';
import { MessageSquare, Check, Search } from 'lucide-react';

const formatDate = (date) => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  
  if (diff < 24 * 60 * 60 * 1000) {
    return `${new Date(date).getHours()}:${String(new Date(date).getMinutes()).padStart(2, '0')}`;
  }
  if (diff < 48 * 60 * 60 * 1000) {
    return 'Yesterday';
  }
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(date).getDay()];
  }
  return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear().toString().slice(2)}`;
};

const ChatHistory = ({ conversations, activeConversationId, onSelectConversation, isDarkMode = true }) => {
  const getTextClass = () => (isDarkMode ? 'text-white' : 'text-[#111b21]');
  const getSecondaryTextClass = () => (isDarkMode ? 'text-gray-400' : 'text-[#667781]');
  const getSearchBgClass = () => (isDarkMode ? 'bg-[#202c33]' : 'bg-[#f0f2f5]');

  return (
    <div className="space-y-1">
      <div className="px-3 pb-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-4 w-4 ${getSecondaryTextClass()}`} />
          </div>
          <input
            type="text"
            placeholder="Search in conversations"
            className={`w-full py-1.5 pl-10 pr-4 rounded-lg ${getSearchBgClass()} ${getTextClass()} border-none focus:outline-none text-sm`}
          />
        </div>
      </div>
      
      <div className="overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className={`w-8 h-8 mx-auto mb-2 ${getSecondaryTextClass()} opacity-50`} />
            <p className={`text-sm ${getSecondaryTextClass()}`}>No conversations yet</p>
            <p className={`text-xs ${getSecondaryTextClass()} mt-1`}>Start a new chat to connect</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={`w-full text-left py-3 px-3 flex items-start
                ${activeConversationId === conversation.id 
                  ? isDarkMode ? 'bg-[#2a3942]' : 'bg-[#f0f2f5]'
                  : isDarkMode ? 'hover:bg-[#202c33]' : 'hover:bg-[#f5f6f6]'}`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className={`w-12 h-12 rounded-full shrink-0 mr-3 flex items-center justify-center
                ${conversation.model === 'mom' ? 'bg-[#E8A87C]' : 
                  conversation.model === 'dad' ? 'bg-[#128c7e]' :
                  conversation.model === 'sibling' ? 'bg-[#5D9BD5]' : 'bg-[#D6A2E8]'}`}
              >
                <span className="text-lg text-white font-bold">
                  {conversation.model.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1 min-w-0 border-b border-gray-200 dark:border-gray-800 pb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className={`font-medium truncate ${getTextClass()}`}>
                    {conversation.title}
                  </h3>
                  <span className={`text-xs ${getSecondaryTextClass()} whitespace-nowrap ml-2`}>
                    {formatDate(conversation.timestamp)}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <Check className={`h-3.5 w-3.5 text-[#53bdeb] mr-0.5`} />
                  <p className={`text-sm ${getSecondaryTextClass()} truncate`}>
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
