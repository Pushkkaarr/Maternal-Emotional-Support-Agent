import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../utils/speechUtils';

const VoiceInteraction = ({ 
  onUserMessage, 
  isProcessing 
}) => {
  const [isAnimating, setIsAnimating] = useState([]);

  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening,
    hasRecognitionSupport
  } = useSpeechRecognition();

  useEffect(() => {
    // Animation for the sound waves when listening
    if (isListening) {
      const interval = setInterval(() => {
        setIsAnimating(Array(5).fill(0).map(() => Math.random() > 0.5));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  // Submit transcript when user stops speaking
  useEffect(() => {
    if (!isListening && transcript) {
      onUserMessage(transcript);
    }
  }, [isListening, transcript, onUserMessage]);

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!hasRecognitionSupport) {
    return (
      <div className="text-center p-4 glass rounded-xl mt-8">
        <p className="text-cream-600">
          Your browser doesn't support speech recognition.
          Please try using Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col items-center">
      <button
        onClick={handleMicToggle}
        disabled={isProcessing}
        className={`mic-button ${isListening ? 'active' : ''} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
      
      {isListening && (
        <div className="mt-4 glass p-3 rounded-xl animate-fade-in">
          <div className="wave-container">
            {isAnimating.map((isActive, index) => (
              <div
                key={index}
                className="wave-bar"
                style={{
                  height: isActive ? `${Math.random() * 20 + 10}px` : '4px',
                  transition: 'height 0.1s ease'
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
      
      {transcript && (
        <div className="mt-4 glass p-4 rounded-xl max-w-md animate-slide-up">
          <p className="text-center text-cream-600">{transcript}</p>
        </div>
      )}
      
      <p className="mt-3 text-cream-500 text-sm">
        {isListening 
          ? 'Listening...' 
          : isProcessing 
            ? 'Processing...' 
            : 'Tap the microphone to start speaking'}
      </p>
    </div>
  );
};

export default VoiceInteraction;
