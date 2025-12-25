"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, Square } from "lucide-react";

const AudioMessage = ({ text, voiceConfig, isDarkMode = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
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

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
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

    const utterance = new SpeechSynthesisUtterance(text);

    if (voiceConfig) {
      utterance.rate = voiceConfig.rate;
      utterance.pitch = voiceConfig.pitch;
    } else {
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
    }

    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (voiceConfig?.name.includes("Female") || voiceConfig?.name.includes("Elder")) {
        const femaleVoice = voices.find((voice) => voice.name.includes("female") || voice.name.includes("woman"));
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
      } else if (voiceConfig?.name.includes("Male")) {
        const maleVoice = voices.find((voice) => voice.name.includes("male") || voice.name.includes("man"));
        if (maleVoice) {
          utterance.voice = maleVoice;
        }
      } else if (voiceConfig?.name.includes("Young")) {
        const youngVoice = voices.find((voice) => voice.name.toLowerCase().includes("young"));
        if (youngVoice) {
          utterance.voice = youngVoice;
        }
      }
    }

    window.speechSynthesis.cancel();

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

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
      {voiceConfig && <span className="ml-2 text-xs text-gray-500">({voiceConfig.name})</span>}
    </div>
  );
};

export default AudioMessage;
