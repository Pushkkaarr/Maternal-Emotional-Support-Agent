'use client';

import { AlignJustify, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import ModelSelector from '../ModelSelector';

const ChatHeader = ({
  selectedModel,
  isTyping,
  isSpeakerEnabled,
  isDarkMode,
  showSidebar,
  toggleSidebar,
  toggleSpeaker,
  toggleTheme,
  handleModelChange
}) => {
  const getModelColorClass = () => {
    return 'bg-[#E8A87C]';
  };

  const getModelAvatar = () => {
    return selectedModel.charAt(0).toUpperCase();
  };
  
  const getModelName = () => {
    return 'Mummy';
  };

  const getSecondaryTextClass = () => isDarkMode ? 'text-gray-300' : 'text-[#54656f]';
  const getSidebarBgClass = () => isDarkMode ? 'bg-[#111b21]' : 'bg-white';
  const getBorderClass = () => isDarkMode ? 'border-[#222e35]' : 'border-[#d1d7db]';
  const getButtonHoverClass = () => isDarkMode ? 'hover:bg-[#222e35]' : 'hover:bg-gray-100';
  const getTextClass = () => isDarkMode ? 'text-white' : 'text-[#111b21]';

  return (
    <div className={`p-3 ${getSidebarBgClass()} flex items-center justify-between border-b ${getBorderClass()} transition-colors duration-300`}>
      <div className="flex items-center">
        {!showSidebar && (
          <button 
            onClick={toggleSidebar}
            className={`mr-3 p-2 ${getSecondaryTextClass()} hover:text-[#00a884] rounded-full ${getButtonHoverClass()}`}
            aria-label="Show sidebar"
          >
            <AlignJustify className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full ${getModelColorClass()} flex items-center justify-center text-white font-bold text-lg`}>
            {getModelAvatar()}
          </div>
          <div>
            <p className={`font-medium ${getTextClass()}`}>
              {getModelName()}
            </p>
            {isTyping ? (
              <p className={`text-xs ${getSecondaryTextClass()}`}>typing...</p>
            ) : (
              <p className={`text-xs ${getSecondaryTextClass()}`}>online</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTheme}
          className={`p-2 ${getSecondaryTextClass()} hover:text-[#00a884] rounded-full ${getButtonHoverClass()} transition-colors`}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button 
          onClick={toggleSpeaker}
          className={`p-2 ${getSecondaryTextClass()} hover:text-[#00a884] rounded-full ${getButtonHoverClass()} transition-colors`}
          aria-label={isSpeakerEnabled ? "Disable speaker" : "Enable speaker"}
        >
          {isSpeakerEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
        <div className="mx-2">
          <ModelSelector selectedModel={selectedModel} onSelectModel={handleModelChange} />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;