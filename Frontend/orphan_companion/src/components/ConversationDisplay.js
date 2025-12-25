import React, { useRef, useEffect } from 'react';

const ConversationDisplay = ({ messages, familyMember }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-4 glass rounded-2xl overflow-hidden">
      <h2 className="text-center font-medium text-cream-600 mb-4">
        Your conversation with {familyMember.charAt(0).toUpperCase() + familyMember.slice(1)}
      </h2>
      
      <div className="max-h-80 overflow-y-auto p-4 space-y-4 flex flex-col">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`conversation-bubble ${
              message.sender === 'user' ? 'user-bubble' : 'avatar-bubble'
            } animate-slide-up`}
          >
            <p>{message.text}</p>
            <div className="text-xs text-cream-500 mt-1 text-right">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ConversationDisplay;
