interface ScoreCalculationProps {
  guessHistory: Record<string, string[]>;
}

export default function ScoreCalculation({ guessHistory }: ScoreCalculationProps) {
  const ranks = ['K', 'P', 'C', 'O', 'F', 'G', 'S'];
  const rankNames = ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'];
  
  const calculateScore = () => {
    return ranks.reduce((total, rank, index) => {
      const incorrectGuesses = guessHistory[rank]?.length || 0;
      const weight = ranks.length - index;  // 7 for Kingdom, 6 for Phylum, etc.
      return total + (incorrectGuesses * weight);
    }, 0);
  };

  const score = calculateScore();

  if (score === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
          Perfect Score!
        </h3>
        <p className="font-mono text-green-600 text-center">
          No mistakes = score 0 (best!)
        </p>
      </div>
    );
  }

  const scoreFormula = ranks.map((rank, index) => {
    const count = guessHistory[rank]?.length || 0;
    const weight = ranks.length - index;
    if (count === 0) return null;
    return `(${weight} × ${rankNames[index]} × ${count} errors)`;
  }).filter(Boolean).join(' + ');

  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
        Weighted Error Score (Lower is Better)
      </h3>
      <p className="font-mono text-gray-700 text-center">
        {scoreFormula || '0'} = {score}
      </p>
    </div>
  );
} 