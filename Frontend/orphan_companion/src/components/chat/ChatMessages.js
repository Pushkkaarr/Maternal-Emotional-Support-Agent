'use client';

import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const ChatMessages = ({
  messages,
  isTyping,
  selectedModel,
  isSpeakerEnabled,
  isDarkMode,
  voiceConfig
}) => {
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  const getChatBgClass = () => (isDarkMode ? 'bg-[#0c1317]' : 'bg-[#efeae2]');
  
  return (
    <div
      className={`flex-1 overflow-y-auto ${getChatBgClass()} bg-repeat transition-colors duration-300`}
    >
      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message} 
          selectedModel={selectedModel}
          isSpeakerEnabled={isSpeakerEnabled}
          isDarkMode={isDarkMode}
          voiceConfig={voiceConfig}
        />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;