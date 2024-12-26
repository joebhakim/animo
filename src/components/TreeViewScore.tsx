interface TreeViewScoreProps {
  guessHistory: Record<string, string[]>;  // key is rank, value is array of incorrect guesses
  correctGuesses: string[];  // array of ranks that were guessed correctly
  currentRank: string;
}

export default function TreeViewScore({ guessHistory, correctGuesses, currentRank }: TreeViewScoreProps) {
  const ranks = ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'];
  
  const renderIncorrectGuesses = (incorrectGuesses: string[]) => {
    if (incorrectGuesses.length <= 3) {
      return incorrectGuesses.map((_, index) => (
        <span key={index} className="text-red-500 w-5 text-center">✗</span>
      ));
    }
    return (
      <span className="text-red-500 w-auto text-center">
        ✗ <span className="text-sm">×{incorrectGuesses.length}</span>
      </span>
    );
  };

  const getRankKey = (rank: string) => rank.charAt(0);
  
  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 h-full">
      <div className="flex flex-col space-y-6">
        {ranks.map((rank) => {
          const rankKey = getRankKey(rank);
          return (
            <div key={rank} className="flex items-center space-x-4">
              <span className={`
                w-8 text-center font-mono
                ${currentRank.toLowerCase() === rank.toLowerCase() ? 'text-blue-600 font-bold' : 'text-gray-400'}
              `}>
                <span className="font-bold">{rank.charAt(0)}</span>{rank.slice(1)}
              </span>

              <div className="flex-grow min-w-[20px]" />

              <div className="flex items-center space-x-1">
                {correctGuesses.includes(rankKey) && (
                  <span className="text-green-500 w-5 text-center">✓</span>
                )}
                {guessHistory[rankKey] && renderIncorrectGuesses(guessHistory[rankKey])}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 