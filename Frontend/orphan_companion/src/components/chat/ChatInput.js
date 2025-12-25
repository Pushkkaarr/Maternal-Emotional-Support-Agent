'use client';

import { useRef, useEffect, useState } from 'react';
import { Paperclip, Send, Mic, MicOff, Smile } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { toast } from 'sonner';

const ChatInput = ({ 
  inputValue, 
  setInputValue, 
  handleSendMessage, 
  handleKeyPress,
  isDarkMode 
}) => {
  const inputRef = useRef(null);
  const { isListening, transcript, startListening, stopListening } = useVoiceInput();
  const [previousTranscript, setPreviousTranscript] = useState('');

  // Update input value when transcript changes
  useEffect(() => {
    if (transcript && transcript !== previousTranscript) {
      setPreviousTranscript(transcript);
      setInputValue(transcript);
    }
  }, [transcript, setInputValue, previousTranscript]);

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      toast.success('Voice recording stopped');
    } else {
      startListening();
      if (inputRef.current) {
        inputRef.current.focus();
      }
      toast.success('Voice recording started');
    }
  };

  const getSecondaryTextClass = () => isDarkMode ? 'text-gray-300' : 'text-[#54656f]';
  const getSidebarBgClass = () => isDarkMode ? 'bg-[#111b21]' : 'bg-white';
  const getBorderClass = () => isDarkMode ? 'border-[#222e35]' : 'border-[#d1d7db]';
  const getInputBgClass = () => isDarkMode ? 'bg-[#2a3942]' : 'bg-white';
  const getButtonHoverClass = () => isDarkMode ? 'hover:bg-[#222e35]' : 'hover:bg-gray-100';
  const getTextClass = () => isDarkMode ? 'text-white' : 'text-[#111b21]';

  return (
    <div className={`py-2 px-4 ${getSidebarBgClass()} transition-colors duration-300 border-t ${getBorderClass()}`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <button className={`p-2 rounded-full ${getSecondaryTextClass()} hover:text-[#00a884] ${getButtonHoverClass()}`}>
            <Smile className="w-5 h-5" />
          </button>
          
          <button className={`p-2 rounded-full ${getSecondaryTextClass()} hover:text-[#00a884] ${getButtonHoverClass()}`}>
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder={isListening ? "Listening..." : "Type a message"}
              className={`w-full px-4 py-2.5 rounded-full ${getInputBgClass()} border-none ${getTextClass()} focus:outline-none transition-colors`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {isListening && (
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className="flex gap-1">
                  <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse delay-150"></span>
                  <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse delay-300"></span>
                </span>
              </span>
            )}
          </div>
          
          {inputValue.trim() ? (
            <button
              onClick={handleSendMessage}
              className={`p-2 rounded-full bg-[#00a884] text-white transition-colors`}
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleVoiceInput}
              className={`p-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-[#00a884]'} text-white transition-colors`}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
