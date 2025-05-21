'use client'

import { useState, useEffect } from 'react'
import type { GameQuestion } from '@/types/taxonomy'
import { getOptionsForRank, getRandomOptions } from '@/utils/taxonomyMaps'
import { getHints } from '@/utils/hintManager'
import VictoryScreen from '@/components/VictoryScreen'
import GameHeader from '@/components/game/GameHeader'
import GameContent from '@/components/game/GameContent'
import InfoModal from '@/components/game/InfoModal'

const RANK_ORDER = [
  'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'
] as const;

const QUESTION_TIME_DELAY = 1000;

export default function Home() {
  const [question, setQuestion] = useState<GameQuestion | null>(null)
  const [currentRankIndex, setCurrentRankIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hints, setHints] = useState<Record<string, string>>({})
  const [lastGuess, setLastGuess] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [previousRank, setPreviousRank] = useState<string | null>(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [guessHistory, setGuessHistory] = useState<Record<string, string[]>>({})
  const [correctGuesses, setCorrectGuesses] = useState<string[]>([])
  const [correctGuessValues, setCorrectGuessValues] = useState<Record<string, string>>({})
  const [showScoreOnMobile, setShowScoreOnMobile] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [birdsEnabled, setBirdsEnabled] = useState(false)
  const [mammalsEnabled, setMammalsEnabled] = useState(true)
  const [reptilesEnabled, setReptilesEnabled] = useState(false)
  const [expertMode, setExpertMode] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState<string[]>([])
  const [noAnimalsSelected, setNoAnimalsSelected] = useState(false)

  useEffect(() => {
    fetchQuestion()
  }, [])

  useEffect(() => {
    fetchQuestion()
  }, [birdsEnabled, mammalsEnabled, reptilesEnabled])

  const fetchQuestion = async () => {
    try {
      // Check if all animal toggles are off
      if (!birdsEnabled && !mammalsEnabled && !reptilesEnabled) {
        setNoAnimalsSelected(true)
        setLoading(false)
        return
      }

      setNoAnimalsSelected(false)
      setLoading(true)
      // Reset the game state
      setGameCompleted(false)
      setCurrentRankIndex(0)
      setShowHint(false)
      setHints({})
      setGuessHistory({})
      setCorrectGuesses([])
      setCorrectGuessValues({})
      setFilteredOptions([])
      setIsCorrect(null)
      setLastGuess(null)
      setPreviousRank(null)

      // Add a random parameter to ensure we get a different animal each time
      // Create a random seed combining current timestamp and random number for unpredictability
      const randomSeed = Date.now() ^ Math.floor(Math.random() * 1000000);
      const response = await fetch(`/api/questions?birdsEnabled=${birdsEnabled}&mammalsEnabled=${mammalsEnabled}&reptilesEnabled=${reptilesEnabled}&random=${randomSeed}`)
      const data = await response.json()
      setQuestion(data)
    } catch (error) {
      console.error('Error fetching question:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShowHint = async () => {
    if (!showHint && Object.keys(hints).length === 0 && question) {
      const correctAnswer = question.taxon[RANK_ORDER[currentRankIndex]];
      const totalNumHints = expertMode ? 6 : 3;

      // Use the already filtered options for hints
      const optionsForHints = filteredOptions.length > 0 ? filteredOptions : options;

      // Then select the hint options from those options
      const otherOptions = optionsForHints
        .filter(opt => opt !== correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, totalNumHints - 1);

      const taxonsToHint = [correctAnswer, ...otherOptions];
      const newHints = await getHints(taxonsToHint);
      setHints(newHints);
    }
    setShowHint(!showHint);
  }

  const handleCorrectAnswer = () => {
    if (currentRankIndex === RANK_ORDER.length - 1) {
      setGameCompleted(true);
    } else {
      setPreviousRank(RANK_ORDER[currentRankIndex]);
      setCurrentRankIndex(currentRankIndex + 1);
      setShowHint(false);
      setHints({});
      setFilteredOptions([]); // Reset filtered options for next rank
    }
  }

  const handleGuess = (option: string) => {
    setLastGuess(option);
    const correct = option.toLowerCase() === question!.taxon[currentRank].toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      const rankKey = currentRank[0].toUpperCase();
      setCorrectGuesses([...correctGuesses, rankKey]);
      setCorrectGuessValues(prev => ({
        ...prev,
        [rankKey]: option
      }));
      setTimeout(() => {
        handleCorrectAnswer();
        setLastGuess(null);
        setIsCorrect(null);
      }, QUESTION_TIME_DELAY);
    } else {
      // Track incorrect guess
      const rankKey = currentRank[0].toUpperCase();
      setGuessHistory(prev => ({
        ...prev,
        [rankKey]: [...(prev[rankKey] || []), option]
      }));
    }
  };

  // New function to handle species direct guess
  const handleDirectSpeciesGuess = (option: string) => {
    // Check if the guess matches the correct species regardless of current rank
    if (option.toLowerCase() === question!.taxon.species.toLowerCase()) {
      // Set last guess and mark as correct
      setLastGuess(option);
      setIsCorrect(true);

      // Create a new array with all ranks as correct
      const allRanks = RANK_ORDER.map(rank => rank[0].toUpperCase());

      // Create an object with all the correct taxonomic values
      const allCorrectValues: Record<string, string> = {};
      RANK_ORDER.forEach(rank => {
        const rankKey = rank[0].toUpperCase();
        allCorrectValues[rankKey] = question!.taxon[rank];
      });

      // Update state to reflect all correct guesses
      setCorrectGuesses(allRanks);
      setCorrectGuessValues(allCorrectValues);

      // Temporarily override currentRank to show the correct message
      // We'll set a special flag to indicate this is a direct species guess
      setPreviousRank('direct_species_win');

      // Complete the game after a short delay
      setTimeout(() => {
        setGameCompleted(true);
        setLastGuess(null);
        setIsCorrect(null);
      }, QUESTION_TIME_DELAY);
    } else {
      // For incorrect species guesses, first record it in the guessHistory as a species incorrect attempt
      const speciesRankKey = 'S'; // Species rank key
      setGuessHistory(prev => ({
        ...prev,
        [speciesRankKey]: [...(prev[speciesRankKey] || []), option]
      }));

      // Then use the normal handler for the current rank
      handleGuess(option);
    }
  };

  // Function to get suggestions based on user input
  const getSuggestions = async (text: string): Promise<string[]> => {
    if (!text || text.trim().length < 2) return [];

    try {
      const response = await fetch(`/api/typingSuggestions?query=${encodeURIComponent(text)}`);


      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();

      return data.suggestions || [];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      // Fallback to placeholder suggestions in case of error
      const placeholderSuggestions = [
        text.toLowerCase() + " vulgaris",
        text.toLowerCase() + " commensis",
        text.toLowerCase() + " domesticus",
      ];

      // Add the correct species if it includes the text (for easier testing)
      if (question && question.taxon.species.toLowerCase().includes(text.toLowerCase())) {
        placeholderSuggestions.push(question.taxon.species);
      }

      return placeholderSuggestions;
    }
  };

  const startNewGame = () => {
    setGameCompleted(false);
    fetchQuestion();
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading a new animal...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return <div className="min-h-screen p-8 flex items-center justify-center">
      <p>Error loading question</p>
    </div>
  }

  const currentRank = RANK_ORDER[currentRankIndex];
  const allOptions = getOptionsForRank(
    currentRank,
    currentRankIndex > 0 ? question.taxon[RANK_ORDER[currentRankIndex - 1]] : undefined,
    true, // Always get all options
    question.taxon[currentRank]
  );

  // If we haven't filtered options yet and we're in easy mode, do it now
  if (filteredOptions.length === 0 && !expertMode && allOptions.length > 6) {
    setFilteredOptions(getRandomOptions(allOptions, question.taxon[currentRank], 6));
  }

  // Use filtered options if available, otherwise use all options
  const options = filteredOptions.length > 0 ? filteredOptions : allOptions;

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto bg-white text-gray-800">
      <GameHeader
        birdsEnabled={birdsEnabled}
        mammalsEnabled={mammalsEnabled}
        reptilesEnabled={reptilesEnabled}
        expertMode={expertMode}
        onBirdsToggle={() => setBirdsEnabled(!birdsEnabled)}
        onMammalsToggle={() => setMammalsEnabled(!mammalsEnabled)}
        onReptilesToggle={() => setReptilesEnabled(!reptilesEnabled)}
        onExpertModeToggle={() => setExpertMode(!expertMode)}
        onInfoClick={() => setShowInfo(true)}
        onRefresh={fetchQuestion}
        isLoading={loading}
      />

      <InfoModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
      />

      {noAnimalsSelected ? (
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-3xl font-bold text-center text-gray-800">NO ANIMAL TYPES SELECTED</h1>
          <p className="mt-4 text-center text-gray-600">Why do you dislike animals? Or maybe youre more into plants? Email me and I can try adding them from the API if so.</p>
        </div>
      ) : gameCompleted ? (
        <VictoryScreen
          scientificName={question.taxon.scientificName}
          imageUrl={question.identifier}
          onNewGame={startNewGame}
          guessHistory={guessHistory}
          correctGuesses={correctGuesses}
          correctGuessValues={correctGuessValues}
        />
      ) : (
        <GameContent
          question={question}
          currentRank={currentRank}
          showScoreOnMobile={showScoreOnMobile}
          onToggleScore={() => setShowScoreOnMobile(!showScoreOnMobile)}
          guessHistory={guessHistory}
          correctGuesses={correctGuesses}
          correctGuessValues={correctGuessValues}
          lastGuess={lastGuess}
          isCorrect={isCorrect}
          previousRank={previousRank || ''}
          showHint={showHint}
          hints={hints}
          onShowHint={handleShowHint}
          onTypedGuess={handleDirectSpeciesGuess}
          onGetSuggestions={getSuggestions}
          options={options}
          expertMode={expertMode}
        />
      )}
    </main>
  );
}
