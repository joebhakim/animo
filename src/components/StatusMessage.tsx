interface StatusMessageProps {
  currentRank: string;
  lastGuess: string | null;
  isCorrect: boolean | null;
  previousRank?: string;
}

export default function StatusMessage({ currentRank, lastGuess, isCorrect, previousRank }: StatusMessageProps) {
  return (
    <div className="space-y-2">
      {/* Current command - always shown */}
      <p className="text-gray-600 font-medium">
        Select the correct {currentRank} from the options below
      </p>

      {/* Previous guess status - shown when there's a guess */}
      {lastGuess && (
        <p className={isCorrect ? "text-green-600" : "text-red-600"}>
          {isCorrect ? (
            <>Moving to next rank. Your {previousRank || currentRank} guess of <span className="font-medium">{lastGuess}</span> was correct!</>
          ) : (
            <>Your guess of <span className="font-medium">{lastGuess}</span> was incorrect. Try again!</>
          )}
        </p>
      )}
    </div>
  );
} 