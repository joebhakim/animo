import { useState, useRef, useEffect } from 'react';
import ExpertModeToggle from './ExpertModeToggle';
import AnimalToggle from './AnimalToggle';

// GameHeader component props
interface GameHeaderProps {
  birdsEnabled: boolean;
  mammalsEnabled: boolean;
  reptilesEnabled: boolean;
  expertMode: boolean;
  onBirdsToggle: () => void;
  onMammalsToggle: () => void;
  onReptilesToggle: () => void;
  onExpertModeToggle: () => void;
  onInfoClick: () => void;
}

export default function GameHeader({
  birdsEnabled,
  mammalsEnabled,
  reptilesEnabled,
  expertMode,
  onBirdsToggle,
  onMammalsToggle,
  onReptilesToggle,
  onExpertModeToggle,
  onInfoClick,
}: GameHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center w-full px-4 py-2 bg-white shadow-sm">
      <h1 className="text-3xl font-bold text-gray-800">Animorl</h1>
      <div className="flex items-center gap-2">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 ring-1 ring-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Game Modes
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 p-3 space-y-3 z-10">
              
              <div className="text-sm text-gray-600 italic text-center">Im a fan of...</div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Birds</span>
                <AnimalToggle
                  enabled={birdsEnabled}
                  onToggle={onBirdsToggle}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mammals</span>
                <AnimalToggle
                  enabled={mammalsEnabled}
                  onToggle={onMammalsToggle}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reptiles</span>
                <AnimalToggle
                  enabled={reptilesEnabled}
                  onToggle={onReptilesToggle}
                />
              </div>
              
              {/* Separator */}
              <div className="border-t border-gray-200 my-1"></div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expert Mode</span>
                <ExpertModeToggle
                  expertMode={expertMode}
                  onToggleExpertMode={onExpertModeToggle}
                />
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onInfoClick}
          className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50"
        >
          i
        </button>
      </div>
    </div>
  );
} 