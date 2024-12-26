import { useState, useEffect } from 'react';

interface HintBoxProps {
  hints: Record<string, string>;
  taxonNames: string[];
  isVisible: boolean;
  onToggle: () => void;
  isLoading?: boolean;
}

export default function HintBox({ hints, taxonNames, isVisible, onToggle, isLoading = false }: HintBoxProps) {
  const [selectedTaxon, setSelectedTaxon] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setSelectedTaxon(null);
    }
  }, [isVisible]);

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
          <h3 className="font-semibold mb-4 text-gray-900">Hints</h3>
          
          <div className="mb-4">
            <h4 className="text-sm text-gray-600 mb-2">Select option to learn about:</h4>
            <div className="flex gap-2">
              {taxonNames.map((taxon, index) => (
                <button
                  key={taxon}
                  onClick={() => setSelectedTaxon(taxon)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTaxon === taxon
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Option {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            {selectedTaxon ? (
              <div className="bg-white p-4 rounded-md border border-gray-100">
                <p className="text-gray-600">
          {selectedTaxon && (
            <div className="mb-4">
              <h4 className="text-sm text-gray-600 mb-2">Select category:</h4>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(HINT_LABELS).map(([category, label]) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            {selectedTaxon && selectedCategory ? (
              <div className="bg-white p-4 rounded-md border border-gray-100">
                <h4 className="font-medium text-gray-800">
                  {HINT_LABELS[selectedCategory as keyof typeof HINT_LABELS]}:
                </h4>
                <p className="text-gray-600 mt-2">
                  {isLoading 
                    ? 'Loading...' 
                    : hints[selectedTaxon]?.[selectedCategory] || 'No information available'
                  }
                </p>
              </div>
            ) : (
              <p className="text-gray-500">
                {!selectedTaxon 
                  ? 'Select an option to see hints' 
                  : 'Select a category to see information'
                }
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 