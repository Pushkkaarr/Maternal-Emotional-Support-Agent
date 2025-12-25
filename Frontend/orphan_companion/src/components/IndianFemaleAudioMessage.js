// File: Frontend/orphan_companion/src/components/IndianFemaleAudioMessage.js
"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, Square } from "lucide-react";

const IndianFemaleAudioMessage = ({ text, voiceConfig, isDarkMode = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();

      audioRef.current.onended = () => {
        setIsPlaying(false);
      };

      audioRef.current.onerror = () => {
        console.error("Error playing audio");
        setIsPlaying(false);
      };
    }

    // Load voices and update state when voices are available
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        console.log("Available voices:", voices.map(v => ({
          name: v.name,
          lang: v.lang,
          default: v.default,
          localService: v.localService
        })));
        setVoicesLoaded(true);
      }
    };

    // Initial load and listen for voiceschanged event
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const playAudio = () => {
    if (!window.speechSynthesis) {
      console.error("SpeechSynthesis API not supported in this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Add slight pauses to mimic Indian intonation
    const modifiedText = text.replace(/(\.|\,|\?|\!)/g, "$1 "); // Add space after punctuation

    const utterance = new SpeechSynthesisUtterance(modifiedText);

    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    let indianFemaleVoice = null;

    if (voices.length > 0) {
      // First preference: Google हिन्दी (hi-IN)
      indianFemaleVoice = voices.find((voice) => 
        voice.name === "Google हिन्दी"
      );

      // Second preference: Any hi-IN voice if Google हिन्दी isn’t found
      if (!indianFemaleVoice) {
        indianFemaleVoice = voices.find((voice) => voice.lang === "hi-IN");
      }

      // Third preference: Microsoft Heera - English (India) (en-IN)
      if (!indianFemaleVoice) {
        indianFemaleVoice = voices.find((voice) => 
          voice.name === "Microsoft Heera - English (India)"
        );
      }

      // Fallback to any en-IN voice
      if (!indianFemaleVoice) {
        indianFemaleVoice = voices.find((voice) => voice.lang === "en-IN");
      }

      // Fallback to any female voice
      if (!indianFemaleVoice) {
        indianFemaleVoice = voices.find((voice) => 
          voice.name.toLowerCase().includes("female") || 
          voice.name.toLowerCase().includes("woman") || 
          voice.name === "Microsoft Zira - English (United States)"
        );
      }

      // Apply the selected voice and adjust rate based on language
      if (indianFemaleVoice) {
        console.log("Selected voice:", {
          name: indianFemaleVoice.name,
          lang: indianFemaleVoice.lang,
          default: indianFemaleVoice.default,
          localService: indianFemaleVoice.localService
        });
        utterance.voice = indianFemaleVoice;

        // Set rate based on language, overriding voiceConfig.rate
        if (indianFemaleVoice.lang === "hi-IN") {
          utterance.rate = 1.1; // Fixed rate 1.1 for hi-IN
          utterance.pitch = 1;
        } else {
          utterance.rate = 2; // Fixed rate 1.5 for other languages
          utterance.pitch = 1.8;
        }
      } else {
        console.warn("No suitable Indian female voice found, using default voice.");
        utterance.rate = voiceConfig?.rate || 1.7; // Fallback to voiceConfig or 1.5
        utterance.pitch = 1.6;
      }
    } else {
      console.warn("No voices available, using default voice.");
      utterance.rate = voiceConfig?.rate || 1.7; // Fallback to voiceConfig or 1.5
      utterance.pitch = 1.6;
    }

    // Apply pitch and volume
    // utterance.pitch = voiceConfig?.pitch || 1; // Higher pitch for young female
    utterance.volume = 1.0;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Set up event handlers
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (event) => {
      console.error("Error in speech synthesis:", event.error);
      setIsPlaying(false);
    };

    // Start speaking
    window.speechSynthesis.speak(utterance);
  };

  const getTextClass = () => (isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-family-deep-blue");

  return (
    <div className="mt-2 flex items-center">
      <button onClick={playAudio} className={`${getTextClass()} transition-colors inline-flex items-center gap-1 text-xs`}>
        {isPlaying ? (
          <>
            <Square className="h-3 w-3" /> Stop
          </>
        ) : (
          <>
            <Volume2 className="h-3 w-3" /> Listen
          </>
        )}
      </button>
      {voiceConfig && <span className="ml-2 text-xs text-gray-500">(Female)</span>}
    </div>
  );
};

export default IndianFemaleAudioMessage;