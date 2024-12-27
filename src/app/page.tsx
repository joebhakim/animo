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
  const [birdMode, setBirdMode] = useState(false)
  const [expertMode, setExpertMode] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState<string[]>([])

  useEffect(() => {
    fetchQuestion()
  }, [])

  useEffect(() => {
    fetchQuestion()
  }, [birdMode])

  const fetchQuestion = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/questions?birdMode=${birdMode}`)
      const data = await response.json()
      setQuestion(data)
      setCurrentRankIndex(0)
      setShowHint(false)
      setHints({})
      setGuessHistory({})
      setCorrectGuesses([])
      setCorrectGuessValues({})
      setFilteredOptions([])
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
      }, 2000);
    } else {
      // Track incorrect guess
      const rankKey = currentRank[0].toUpperCase();
      setGuessHistory(prev => ({
        ...prev,
        [rankKey]: [...(prev[rankKey] || []), option]
      }));
    }
  };

  const startNewGame = () => {
    setGameCompleted(false);
    fetchQuestion();
  };

  if (loading) {
    return <div className="min-h-screen p-8 flex items-center justify-center">
      <p>Loading...</p>
    </div>
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
        birdMode={birdMode}
        expertMode={expertMode}
        onBirdModeToggle={() => setBirdMode(!birdMode)}
        onExpertModeToggle={() => setExpertMode(!expertMode)}
        onInfoClick={() => setShowInfo(true)}
      />

      <InfoModal 
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
      />

      {gameCompleted ? (
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
          onGuess={handleGuess}
          options={options}
          expertMode={expertMode}
        />
      )}
    </main>
  );
}
