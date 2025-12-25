'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const models = [
  {
    id: "mom",
    role: "Mom",
    name: "Sarah",
    description: "Warm, nurturing, and always ready with practical advice.",
    color: "bg-[#E8A87C]",
    avatar: "M"
  },
  {
    id: "dad",
    role: "Dad",
    name: "Michael",
    description: "Thoughtful, protective, with a touch of humor and wisdom.",
    color: "bg-family-deep-blue",
    avatar: "D"
  },
  {
    id: "sibling",
    role: "Sibling",
    name: "Alex",
    description: "Fun, relatable, and always ready to listen.",
    color: "bg-[#5D9BD5]",
    avatar: "S"
  },
  {
    id: "grandparent",
    role: "Grandparent",
    name: "Eleanor",
    description: "Patient, full of stories, and offering wisdom.",
    color: "bg-[#D6A2E8]",
    avatar: "G"
  }
];

const ModelSelector = ({ selectedModel, onSelectModel }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentModel = models.find(model => model.id === selectedModel) || models[0];
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-3 rounded-xl glass-panel hover:shadow-medium transition-all"
      >
        <div className={`w-10 h-10 rounded-full ${currentModel.color} flex items-center justify-center text-white font-bold`}>
          {currentModel.avatar}
        </div>
        <div className="text-left flex-1">
          <h3 className="font-medium">{currentModel.name}</h3>
          <p className="text-xs text-family-text-light">{currentModel.role}</p>
        </div>
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 mt-2 rounded-xl glass-panel shadow-medium overflow-hidden z-10"
          >
            <div className="py-2">
              {models.map(model => (
                <button
                  key={model.id}
                  className={`w-full text-left flex items-center gap-3 p-3 transition-colors hover:bg-family-soft-blue/30 ${
                    model.id === selectedModel ? 'bg-family-soft-blue/20' : ''
                  }`}
                  onClick={() => {
                    onSelectModel(model.id);
                    setIsOpen(false);
                  }}
                >
                  <div className={`w-10 h-10 rounded-full ${model.color} flex items-center justify-center text-white font-bold`}>
                    {model.avatar}
                  </div>
                  <div>
                    <h3 className="font-medium">{model.name}</h3>
                    <p className="text-xs text-family-text-light line-clamp-1">{model.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModelSelector;
