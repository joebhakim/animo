import { useState, useEffect } from 'react';

interface TypingFieldProps {
    onSubmitTypedText: (text: string) => void;
    species?: string; // Optional species name for debugging
    suggestions?: string[]; // Array of suggestions
    onInputChange: (text: string) => void; // Callback for input changes
  }
  
  export default function TypingField({ 
    onSubmitTypedText,
    species,
    suggestions = [], // Default to empty array
    onInputChange
  }: TypingFieldProps) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // Debug: Log the correct species to console
    console.log('Debug - Correct species:', species);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      onInputChange(value); // Notify parent component about input change
      
      // Only show suggestions if we have input and suggestions
      setShowSuggestions(value.length > 0 && suggestions.length > 0);
    };
    
    const handleSuggestionClick = (suggestion: string) => {
      setInputValue(suggestion);
      onSubmitTypedText(suggestion); // Treat as a submission
      setShowSuggestions(false);
    };
    
    // Close suggestions on click outside
    useEffect(() => {
      const handleClickOutside = () => setShowSuggestions(false);
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, []);
    
    return (
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="If you know, enter the species directly"
            value={inputValue}
            onChange={handleInputChange}
            onClick={(e) => e.stopPropagation()} // Prevent outside click handler
          />
        </div>
        
        {showSuggestions && (
          <div className="absolute top-full left-0 z-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg mt-1">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } 