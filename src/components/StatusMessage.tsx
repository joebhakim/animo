interface StatusMessageProps {
  currentRank: string;
  lastGuess: string | null;
  isCorrect: boolean | null;
}

export default function StatusMessage({ currentRank, lastGuess, isCorrect }: StatusMessageProps) {
  const formatRank = (rank: string) => {
    const capitalizedRank = rank.charAt(0).toUpperCase() + rank.slice(1);
    return <span className="font-bold">{capitalizedRank}</span>;
  };

  return (
    <div className="space-y-3">
      {/* Current command - always shown */}
      <p className="text-blue-700 font-semibold text-lg bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100">
        Select the correct {formatRank(currentRank)} from the options below
      </p>

      {/* Previous guess status - shown when there's a guess */}
      {lastGuess && (
        <p className={`${isCorrect ? "text-green-700 bg-green-50 border-green-100" : "text-red-700 bg-red-50 border-red-100"} font-semibold text-lg p-3 rounded-lg shadow-sm border`}>
          {isCorrect ? (
            <>Moving to next rank. Your {formatRank(currentRank)} guess of <span className="font-bold">{lastGuess}</span> was correct!</>
          ) : (
            <>Your guess of <span className="font-bold">{lastGuess}</span> was incorrect. Try again!</>
          )}
        </p>
      )}
    </div>
  );
} 