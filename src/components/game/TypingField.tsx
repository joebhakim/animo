import { useState, useEffect, useRef } from 'react';

interface TypingFieldProps {
  onSubmitTypedText: (text: string) => void;
  species?: string; // Optional species name for debugging
  suggestions?: string[]; // Array of suggestions
  onInputChange: (text: string) => void; // Callback for input changes
  isLoading?: boolean; // Whether suggestions are currently loading
}

export default function TypingField({
  onSubmitTypedText,
  suggestions = [], // Default to empty array
  onInputChange,
  isLoading = false
}: TypingFieldProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onInputChange(value); // Notify parent component about input change

    // Show suggestions panel if we have 3+ characters of input
    if (value.length >= 3) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    setSelectedIndex(-1); // Reset selection when input changes
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onSubmitTypedText(suggestion); // Treat as a submission
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If suggestions are not shown, do nothing special
    if (!showSuggestions || (!isLoading && suggestions.length === 0)) {
      if (e.key === 'Enter') {
        // Submit the current text
        onSubmitTypedText(inputValue);
        setInputValue('');
      }
      return;
    }

    // Handle arrow keys for navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        // If we have a suggestion selected, use it
        const selectedSuggestion = suggestions[selectedIndex];
        setInputValue(selectedSuggestion);
        onSubmitTypedText(selectedSuggestion);
      } else {
        // Otherwise submit whatever is in the input
        onSubmitTypedText(inputValue);
      }
      setInputValue('');
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      // Close suggestions on escape
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1.5">
        <input
          ref={inputRef}
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="Type the scientific name (e.g., 'Panthera leo')"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onClick={(e) => {
            e.stopPropagation(); // Prevent outside click handler
            // Show suggestions again if we have input and suggestions
            if (inputValue.length >= 3) {
              setShowSuggestions(true);
            }
          }}
        />
      </div>

      {showSuggestions && (
        <div className="absolute top-full left-0 z-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg mt-1">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Loading suggestions...
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-2 cursor-pointer ${selectedIndex === index ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {suggestion}
              </div>
            ))
          ) : inputValue.length >= 3 ? (
            <div className="p-3 text-gray-500 text-center">
              No matching species found
            </div>
          ) : (
            <div className="p-3 text-gray-500 text-center">
              Type at least 3 characters to see suggestions
            </div>
          )}
        </div>
      )}
    </div>
  );
} 