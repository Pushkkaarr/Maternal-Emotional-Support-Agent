// File: Frontend/orphan_companion/src/components/IndianMaleAudioMessage.js
"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, Square } from "lucide-react";

const IndianMaleAudioMessage = ({ text, voiceConfig, isDarkMode = true }) => {
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

    // Add slight pauses to mimic Indian English intonation
    const modifiedText = text.replace(/(\.|\,|\?|\!)/g, "$1 "); // Add space after punctuation for natural pauses

    const utterance = new SpeechSynthesisUtterance(modifiedText);

    // Apply voice configuration with adjustments for a more Indian male voice
    if (voiceConfig) {
      utterance.rate = voiceConfig.rate || 1.5; // Normal rate with slight variation for Indian tone
      utterance.pitch = voiceConfig.pitch || -0.5; // Slightly lower pitch for masculinity
    } else {
      utterance.rate = 1.5; // Default rate
      utterance.pitch = -0.5; // Default pitch for male tone
    }
    utterance.volume = 1.0;

    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Explicitly select Microsoft Ravi - English (India)
      let indianMaleVoice = voices.find((voice) => 
        voice.name === "Microsoft Ravi - English (India)"
      );

      // Fallback to any en-IN voice if Ravi isn’t found
      if (!indianMaleVoice) {
        indianMaleVoice = voices.find((voice) => voice.lang === "en-IN");
      }

      // Fallback to any male voice if no en-IN voice is found
      if (!indianMaleVoice) {
        indianMaleVoice = voices.find((voice) => 
          voice.name.toLowerCase().includes("male") || 
          voice.name.toLowerCase().includes("man")
        );
      }

      // Apply the selected voice
      if (indianMaleVoice) {
        console.log("Selected voice:", {
          name: indianMaleVoice.name,
          lang: indianMaleVoice.lang,
          default: indianMaleVoice.default,
          localService: indianMaleVoice.localService
        });
        utterance.voice = indianMaleVoice;
      } else {
        console.warn("No suitable Indian male voice found, using default voice.");
      }
    } else {
      console.warn("No voices available, using default voice.");
    }

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
      {voiceConfig && <span className="ml-2 text-xs text-gray-500">(Male)</span>}
    </div>
  );
};

export default IndianMaleAudioMessage;