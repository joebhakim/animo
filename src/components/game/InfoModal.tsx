import { useEffect, useRef } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg max-w-md mx-4 relative overflow-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        
        <h2 className="text-xl font-bold mb-4">How to Play</h2>
        <div className="space-y-4 text-gray-600 mb-8">
          <p>
            Animorl is a game about identifying animals through their taxonomic classification.
          </p>
          <p>
            Starting with Kingdom and working down to Species, youll identify the animal in the image by selecting the correct taxonomic rank at each level.
          </p>
          <p>
            Each incorrect guess adds to your score, with mistakes at higher ranks (like Kingdom) costing more points than mistakes at lower ranks (like Species). A lower score is better!
          </p>
          <p>
            Need help? Use the hint button to narrow down your choices to three options and learn more about each one.
          </p>
        </div>

        <h2 className="text-xl font-bold mb-4">Changelog</h2>
        <div className="space-y-2 text-gray-600">
          <div className="flex gap-4">
            <span className="text-sm text-gray-400 shrink-0">Mar 2, 2025 A.D.</span>
            <p>People seem to be persistently playing this game, including insane people who can e.g. recognize birds IMMEDIATELY, so Ive been commissioned to add a TYPING BOX in which one can instantly win by entering the correct scientific name. Also added reptiles, but these are too often roadkill, so they might not last. </p>
          </div>
          <div className="flex gap-4">
            <span className="text-sm text-gray-400 shrink-0">Dec 27, 2024 A.D.</span>
            <p>This game became too hard, so I added an expert mode, which was the game as it was, and I play on baby mode personally. EDIT: no more possums. Too much roadkill.</p>
          </div>
          <div className="flex gap-4">
            <span className="text-sm text-gray-400 shrink-0">Dec 26, 2024 A.D.</span>
            <p>Added Aves, added more observations. Alex, I delegate upon you your new hobby of Bird-Expertise.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 