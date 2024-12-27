interface AnswerGridProps {
  options: string[];
  showHint: boolean;
  hints: Record<string, string>;
  lastGuess: string | null;
  isCorrect: boolean | null;
  onGuess: (option: string) => void;
}

export default function AnswerGrid({ 
  options, 
  showHint, 
  hints, 
  lastGuess, 
  isCorrect, 
  onGuess 
}: AnswerGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
      {options.map((option) => {
        const isHinted = showHint && Object.keys(hints).includes(option);
        const isGuessed = lastGuess === option;
        const isCorrectGuess = isGuessed && isCorrect;
        const isIncorrectGuess = isGuessed && !isCorrect;

        return (
          <button
            key={option}
            onClick={() => onGuess(option)}
            className={`p-2 text-left border rounded-md transition-colors
              ${showHint 
                ? isHinted
                  ? 'hover:bg-gray-50 border-gray-200'
                  : 'opacity-40 border-gray-100 cursor-not-allowed'
                : 'hover:bg-gray-50 border-gray-200'
              }
              ${isCorrectGuess ? 'bg-green-50 border-green-200 text-green-700' : ''}
              ${isIncorrectGuess ? 'bg-red-50 border-red-200 text-red-700' : ''}
            `}
            disabled={showHint && !isHinted}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
} 