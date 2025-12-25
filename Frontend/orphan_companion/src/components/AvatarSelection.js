import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// FamilyMember type is just for type safety in TypeScript, which is not required in JavaScript
const AvatarSelection = ({ currentAvatar, onSelectAvatar }) => {
  const avatarOptions = [
    { value: 'mother', label: 'Mother' }
  ];

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="fixed top-6 right-6 z-10 animate-fade-in">
      <DropdownMenu>
        <DropdownMenuTrigger className="glass rounded-full px-4 py-2 flex items-center gap-2 hover:shadow-lg transition-all duration-300 text-cream-600 font-medium">
          <span>Talk to {capitalizeFirstLetter(currentAvatar)}</span>
          <ChevronDown size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass border-cream-200 mt-2 rounded-xl overflow-hidden">
          {avatarOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-cream-200/70 transition-colors
                ${currentAvatar === option.value ? 'bg-cream-200/40 font-medium' : ''}`}
              onClick={() => onSelectAvatar(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AvatarSelection;
