import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ChatInterface from '../components/ChatInterface';
import { ArrowLeft } from 'lucide-react';

const ChatBot = () => {
  const router = useRouter();
  const { model } = router.query; // Get query param from URL
  const [selectedModel, setSelectedModel] = useState(null); // Initialize as null
  const [showSidebar, setShowSidebar] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Define valid models (must match internal model IDs)
    const validModels = ['mom', 'dad', 'sibling', 'grandparent'];

    // Set selected model from URL, default to 'mom' if invalid
    if (model && validModels.includes(model.toLowerCase())) {
      setSelectedModel(model.toLowerCase());
    } else {
      setSelectedModel('mom'); // Fallback to 'mom' if model is invalid
    }

    // Check for dark mode preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    // Listen for theme changes
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [model]);

  // Don't render ChatInterface until selectedModel is set
  if (!selectedModel) {
    return null;
  }

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-[#111b21] text-white' : 'bg-[#f0f2f5] text-[#111b21]'}`}>
      {/* Header */}
      <div className={`p-4 flex items-center ${isDarkMode ? 'bg-[#202c33] border-[#222e35]' : 'bg-[#00a884] text-white'} transition-colors`}>
        <Link href="/Models" className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-white/80 hover:text-white'} transition-colors`}>
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        <h1 className="text-lg font-medium mx-auto">FamilyConnect</h1>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden flex">
        <ChatInterface
          initialModel={selectedModel}
          showSidebar={showSidebar}
          toggleSidebar={() => setShowSidebar(!showSidebar)}
        />
      </div>
    </div>
  );
};

export default ChatBot;