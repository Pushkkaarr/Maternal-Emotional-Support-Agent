import { useState, useCallback, useRef, useEffect } from 'react';

export const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const lastSpeechTimestampRef = useRef(Date.now());

  // Cleanup function for timers and recognition
  const cleanupResources = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Recognition already stopped');
      }
      recognitionRef.current = null;
    }
  }, []);

  // Restart recognition to prevent it from stopping
  const restartRecognition = useCallback(() => {
    if (isListening && !recognitionRef.current) {
      console.log('Restarting voice recognition');
      startListening();
    }
  }, [isListening]);

  // Handle silence detection more gracefully
  useEffect(() => {
    let silenceDetectionInterval = null;

    if (isListening) {
      // Check for silence every 300ms
      silenceDetectionInterval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastSpeechTimestampRef.current;

        // Stop after 2 seconds of silence
        if (elapsed > 2000) {
          console.log('Long silence detected, stopping recognition');
          stopListening();
        }
      }, 300);
    }

    return () => {
      if (silenceDetectionInterval) {
        clearInterval(silenceDetectionInterval);
      }
    };
  }, [isListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, [cleanupResources]);

  const startListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      cleanupResources();

      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        console.error('Speech recognition not supported');
        return null;
      }

      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English

      recognition.onstart = () => {
        console.log('Voice recognition started');
        setIsListening(true);
        lastSpeechTimestampRef.current = Date.now();
      };

      recognition.onresult = (event) => {
        lastSpeechTimestampRef.current = Date.now();

        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }

        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);

        if (event.error === 'no-speech') {
          lastSpeechTimestampRef.current = Date.now();
          return;
        }

        setIsListening(false);
        cleanupResources();
      };

      recognition.onend = () => {
        console.log('Voice recognition ended');

        if (isListening) {
          console.log('Recognition ended but still listening, restarting...');
          if (Date.now() - lastSpeechTimestampRef.current < 1000) {
            setTimeout(() => {
              if (isListening) {
                startListening();
              }
            }, 100);
          } else {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      try {
        recognition.start();
        console.log('Started voice recognition');
      } catch (error) {
        console.error('Error starting voice recognition:', error);
      }

      return recognition;
    } else {
      console.error('Speech recognition not supported in this browser');
      return null;
    }
  }, [cleanupResources, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Recognition already stopped');
      }

      recognitionRef.current = null;
    }

    setIsListening(false);

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
  };
};
