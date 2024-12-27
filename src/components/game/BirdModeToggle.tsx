import React from 'react';

interface BirdModeToggleProps {
  birdMode: boolean;
  onToggleBirdMode: () => void;
}

export default function BirdModeToggle({
  birdMode,
  onToggleBirdMode,
}: BirdModeToggleProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleBirdMode();
      }}
      className={`w-12 h-6 rounded-full transition-colors relative ${
        birdMode ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span 
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
          birdMode ? 'right-1' : 'left-1'
        }`}
      />
    </button>
  );
} 