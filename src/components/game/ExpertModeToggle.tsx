import React from 'react';

interface ExpertModeToggleProps {
  expertMode: boolean;
  onToggleExpertMode: () => void;
}

export default function ExpertModeToggle({
  expertMode,
  onToggleExpertMode,
}: ExpertModeToggleProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleExpertMode();
      }}
      className={`w-12 h-6 rounded-full transition-colors relative ${
        expertMode ? 'bg-purple-600' : 'bg-gray-200'
      }`}
    >
      <span 
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
          expertMode ? 'right-1' : 'left-1'
        }`}
      />
    </button>
  );
} 