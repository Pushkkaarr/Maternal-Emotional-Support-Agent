'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import { Mic, MicOff } from 'lucide-react';
import Image from 'next/image';
import mother from '../images/mother.jpg';

function VoiceChatting() {
  const [selectedAvatar, setSelectedAvatar] = useState('mother');
  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const conversationEndRef = useRef(null);

  const avatars = [
    { name: 'mother', label: 'Mother', modelEndpoint: 'mother', image: mother }
  ];

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        if (transcript) {
          await sendMessage(transcript);
          stopRecording();
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast.error(`Speech recognition error: ${event.error}`);
        stopRecording();
      };
    } else {
      toast.error('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.info('Listening...');
      }
    } catch (error) {
      console.error('Microphone access error:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendMessage = useCallback(async (message) => {
    try {
      console.log('Current Selected Avatar:', selectedAvatar);

      setConversation((prev) => [...prev, { sender: 'user', text: message }]);

      const currentAvatar = avatars.find((a) => a.name === selectedAvatar);
      
      if (!currentAvatar) {
        console.error('No avatar found for selection:', selectedAvatar);
        toast.error('Invalid avatar selection');
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/model/${currentAvatar.modelEndpoint}`;
      console.log('Sending message to:', apiUrl);

      const response = await axios.post(apiUrl, { message });

      console.log('Backend Response:', response.data.response);

      const aiResponse = response.data.response;
      setConversation((prev) => [...prev, { sender: 'ai', text: aiResponse }]);

      speakResponse(aiResponse);
    } catch (error) {
      console.error('Error sending message:', error);

      const mockResponses = {
        mother: "My dear child, I'm always here for you. Your feelings are valid and important.",
        father: "Stay strong. Life has challenges, but you have the courage to overcome them.",
        sister: "Hey, I understand. We can get through this together. Want to talk more?",
        brother: "You're not alone. I've got your back, no matter what."
      };

      const aiResponse = mockResponses[selectedAvatar] || "I'm here to listen and support you.";

      console.log('Using mock response:', aiResponse);

      setConversation((prev) => [...prev, { sender: 'ai', text: aiResponse }]);

      speakResponse(aiResponse);
      toast.error('Failed to send message to backend. Using mock response.');
    }
  }, [selectedAvatar, avatars]);

  const handleAvatarChange = (newAvatar) => {
    console.log('Changing avatar to:', newAvatar);
    setSelectedAvatar(newAvatar);
    setConversation([]);
  };

  const speakResponse = (text) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const currentAvatar = avatars.find((a) => a.name === selectedAvatar);

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
      <Toaster richColors />

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 flex">
        <div className="w-1/4 pr-4 border-r">
          <select
            value={selectedAvatar}
            onChange={(e) => handleAvatarChange(e.target.value)}
            className="w-full mb-4 p-2 border rounded bg-[#F5E6D3]"
          >
            {avatars.map((avatar) => (
              <option key={avatar.name} value={avatar.name}>
                {avatar.label}
              </option>
            ))}
          </select>

          <div className="flex justify-center mb-6">
            <Image
              src={currentAvatar.image}
              alt={`${currentAvatar.label} Avatar`}
              width={200}
              height={200}
              className={`rounded-full object-cover ${isSpeaking ? 'animate-pulse' : ''}`}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-24 h-24 flex items-center justify-center rounded-full transition-all duration-300 ${
                isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-[#F5E6D3] text-black hover:bg-[#E5D6C3]'
              }`}
            >
              {isRecording ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
            </button>
          </div>
        </div>

        <div className="w-3/4 pl-4">
          <div className="h-[500px] overflow-y-auto mb-4 p-3 bg-[#FFF8F0] rounded border">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded ${msg.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-green-100 text-left'}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={conversationEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceChatting; 