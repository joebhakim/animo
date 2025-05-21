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
  onRefresh: () => void;
  isLoading?: boolean;
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
  onRefresh,
  isLoading = false,
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
        <button
          onClick={onRefresh}
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 ring-1 ring-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Get new animal"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>

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
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 ring-1 ring-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ?
        </button>
      </div>
    </div>
  );
} 