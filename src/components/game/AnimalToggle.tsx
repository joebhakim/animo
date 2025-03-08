import React from 'react';

interface AnimalClassToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function AnimalClassToggle({
  enabled,
  onToggle,
}: AnimalClassToggleProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`w-12 h-6 rounded-full transition-colors relative ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span 
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
          enabled ? 'right-1' : 'left-1'
        }`}
      />
    </button>
  );
} 