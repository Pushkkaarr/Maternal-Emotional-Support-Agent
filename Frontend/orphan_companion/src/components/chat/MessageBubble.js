// File: Frontend/orphan_companion/src/components/MessageBubble.js
'use client';

import React from 'react';
import AudioMessage from './../AudioMessage';
import IndianMaleAudioMessage from './../IndianMaleAudioMessage'; // Import the new component
import IndianFemaleAudioMessage from "./../IndianFemaleAudioMessage";

const MessageBubble = ({
  message,
  selectedModel = 'mom',
  isSpeakerEnabled,
  isDarkMode,
  voiceConfig
}) => {
  const getModelColorClass = () => {
    switch (selectedModel) {
      case 'mom': return 'bg-[#E8A87C]';
      case 'dad': return 'bg-family-deep-blue';
      case 'brother': return 'bg-[#5D9BD5]';
      case 'sister': return 'bg-[#FFB6C1]'; // Add sister color if needed
      case 'grandparent': return 'bg-[#D6A2E8]';
      default: return 'bg-family-deep-blue';
    }
  };

  const getModelAvatar = () => {
    return selectedModel ? selectedModel.charAt(0).toUpperCase() : 'M';
  };

  const getUserBubbleClass = () => isDarkMode ? 'bg-[#005c4b]' : 'bg-[#d9fdd3]';
  const getBotBubbleClass = () => isDarkMode ? 'bg-[#202c33]' : 'bg-white';
  const getTextClass = () => isDarkMode ? 'text-white' : 'text-[#111b21]';

  return (
    <div className={`${getTextClass()} transition-colors duration-300 mb-4`}>
      <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`${message.sender === 'user' ? getUserBubbleClass() : getBotBubbleClass()}
          p-2 px-3 rounded-lg max-w-[75%] shadow-sm ${message.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
          <div className={`flex ${message.sender === 'bot' ? 'items-start' : ''}`}>
            {message.sender === 'bot' && (
              <div className={`w-8 h-8 rounded-full ${getModelColorClass()} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mr-3 hidden`}>
                {getModelAvatar()}
              </div>
            )}
            
            <div className="flex-1">
              {message.sender === 'bot' && selectedModel && (
                <p className={`font-medium text-sm mb-1 ${isDarkMode ? 'text-[#00a884]' : 'text-[#00a884]'} hidden`}>
                  {selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)}
                </p>
              )}
              <div className="prose max-w-none">
                <p className={`${message.sender === 'user' ? (isDarkMode ? 'text-white' : 'text-[#111b21]') : (isDarkMode ? 'text-white' : 'text-[#111b21]')}`}>
                  {message.content}
                </p>
              </div>
              {message.sender === 'bot' && isSpeakerEnabled && (
                selectedModel === 'sibling' ? (
                  <IndianMaleAudioMessage
                    text={message.content}
                    messageId={message.id}
                    voiceConfig={voiceConfig}
                    isDarkMode={isDarkMode}
                  />
                ) : selectedModel === "grandparent" ? (
                  <IndianFemaleAudioMessage
                    text={message.content}
                    messageId={message.id}
                    voiceConfig={voiceConfig}
                    isDarkMode={isDarkMode}
                  />
                ) : selectedModel === "mom" ? (
                  <IndianFemaleAudioMessage
                    text={message.content}
                    messageId={message.id}
                    voiceConfig={voiceConfig}
                    isDarkMode={isDarkMode}
                  />
                ) : selectedModel === "dad" ? (
                  <IndianMaleAudioMessage
                    text={message.content}
                    messageId={message.id}
                    voiceConfig={voiceConfig}
                    isDarkMode={isDarkMode}
                  />
                ) : (
                  <AudioMessage
                    text={message.content}
                    messageId={message.id}
                    voiceConfig={voiceConfig}
                    isDarkMode={isDarkMode}
                  />
                )
              )}
              <div className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-[#667781]'} text-right mt-1`}>
                {new Date(message.timestamp).getHours()}:{String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}
                {message.sender === 'user' && (
                  <span className="ml-1 text-[#53bdeb]">✓✓</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;