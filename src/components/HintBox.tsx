import { useState, useEffect } from 'react';

interface HintBoxProps {
  hints: Record<string, string>;
  isVisible: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  currentRank: string;
}

export default function HintBox({ hints, isVisible, onToggle, isLoading = false, currentRank }: HintBoxProps) {
  const [selectedTaxon, setSelectedTaxon] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setSelectedTaxon(null);
    }
  }, [isVisible]);

  const formatRank = (rank: string) => {
    return <span className="font-bold">{rank.charAt(0).toUpperCase() + rank.slice(1)}</span>;
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onToggle}
        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100"
      >
        {isVisible ? 'Hide Hints' : 'Show Hints'}
      </button>

      {isVisible && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="mb-4">
            <h3 className="text-sm text-gray-600 mb-2">The {formatRank(currentRank)} is one of these three. Click to learn more.</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(hints).map((taxon) => (
                <button
                  key={taxon}
                  onClick={() => setSelectedTaxon(taxon)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTaxon === taxon
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {taxon}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            {selectedTaxon ? (
              <div className="bg-white p-4 rounded-md border border-gray-100">
                <p className="text-gray-600">
                  {isLoading ? 'Loading...' : hints[selectedTaxon]}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">{/* Select a taxon to see information */}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 