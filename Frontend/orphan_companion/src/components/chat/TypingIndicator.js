'use client';
import React from 'react';

const TypingIndicator = ({ isDarkMode }) => {
  const getBotBubbleClass = () => (isDarkMode ? 'bg-[#202c33]' : 'bg-white');
  const getTextClass = () => (isDarkMode ? 'text-white' : 'text-[#111b21]');

  return (
    <div className={`${getTextClass()} transition-colors duration-300 mb-4`}>
      <div className="flex justify-start">
        <div className={`${getBotBubbleClass()} p-4 rounded-lg rounded-tl-none shadow-sm max-w-[75%]`}>
          <div className="flex items-center justify-center">
            <div className="flex space-x-2">
              <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
