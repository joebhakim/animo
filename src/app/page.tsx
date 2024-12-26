'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { GameQuestion } from '@/types/taxonomy'
import { getOptionsForRank } from '@/utils/taxonomyMaps'
import { getHints } from '@/utils/hintManager'
import HintBox from '@/components/HintBox'
import StatusMessage from '@/components/StatusMessage'
import VictoryScreen from '@/components/VictoryScreen'
import TreeViewScore from '@/components/TreeViewScore'

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
  const [showScoreOnMobile, setShowScoreOnMobile] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [hardMode, setHardMode] = useState(false)
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)

  useEffect(() => {
    fetchQuestion()
  }, [])

  useEffect(() => {
    fetchQuestion()
  }, [hardMode])

  const fetchQuestion = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/questions?hardMode=${hardMode}`)
      const data = await response.json()
      setQuestion(data)
      setCurrentRankIndex(0)
      setShowHint(false)
      setHints({})
      setGuessHistory({})
      setCorrectGuesses([])
    } catch (error) {
      console.error('Error fetching question:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShowHint = async () => {
    if (!showHint && Object.keys(hints).length === 0 && question) {
      const options = getOptionsForRank(
        RANK_ORDER[currentRankIndex],
        currentRankIndex > 0 ? question.taxon[RANK_ORDER[currentRankIndex - 1]] : undefined
      );

      const correctAnswer = question.taxon[RANK_ORDER[currentRankIndex]];
      const otherOptions = options
        .filter(opt => opt !== correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      console.log('Options:', options);
      console.log('Correct answer:', correctAnswer);
      console.log('Other options:', otherOptions);
      // error if correct answer not in options
      if (!options.includes(correctAnswer)) {
        throw new Error(`Correct answer ${correctAnswer} not found in options for rank ${RANK_ORDER[currentRankIndex]}`);
      }

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
    }
  }

  const handleGuess = (option: string) => {
    setLastGuess(option);
    const correct = option.toLowerCase() === question!.taxon[currentRank].toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      setCorrectGuesses([...correctGuesses, currentRank[0].toUpperCase()]);
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

  const currentRank = RANK_ORDER[currentRankIndex]

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto bg-white text-gray-800">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Animo</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Birds, too?!</span>
            <button
              onClick={() => setHardMode(!hardMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                hardMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                hardMode ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            i
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md mx-4 relative overflow-auto max-h-[90vh]">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <h2 className="text-xl font-bold mb-4">How to Play</h2>
            <div className="space-y-4 text-gray-600 mb-8">
              <p>
                Animo is a game about identifying animals through their taxonomic classification.
              </p>
              <p>
                Starting with Kingdom and working down to Species, youll identify the animal in the image by selecting the correct taxonomic rank at each level.
              </p>
              <p>
                Each incorrect guess adds to your score, with mistakes at higher ranks (like Kingdom) costing more points than mistakes at lower ranks (like Species). A lower score is better!
              </p>
              <p>
                Need help? Use the hint button to narrow down your choices to three options and learn more about each one.
              </p>
            </div>

            <h2 className="text-xl font-bold mb-4">Changelog</h2>
            <div className="space-y-2 text-gray-600">
              <div className="flex gap-4">
                <span className="text-sm text-gray-400 shrink-0">Dec 26, 2024 A.D.</span>
                <p>Added Aves, added more observations. Alex, I delegate upon you your new hobby of Bird-Expertise.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameCompleted ? (
        <VictoryScreen
          scientificName={question.taxon.scientificName}
          imageUrl={question.identifier}
          onNewGame={startNewGame}
          guessHistory={guessHistory}
          correctGuesses={correctGuesses}
        />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-rows-[auto,1fr] md:grid-rows-1 md:grid-cols-[1fr,200px] gap-4 md:gap-8">
            <button 
              onClick={() => setShowScoreOnMobile(!showScoreOnMobile)}
              className="md:hidden order-1 bg-gray-100 p-2 rounded-md flex items-center justify-between"
            >
              <span>Progress</span>
              <span className={`transform transition-transform ${showScoreOnMobile ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            <div className={`
              order-1 md:order-2
              ${showScoreOnMobile ? 'block' : 'hidden'}
              md:block
            `}>
              <TreeViewScore
                guessHistory={guessHistory}
                correctGuesses={correctGuesses}
                currentRank={currentRank}
              />
            </div>

            <div className="order-2 md:order-1 aspect-video relative rounded-lg overflow-hidden group">
              <div 
                onClick={() => setIsImageFullscreen(!isImageFullscreen)} 
                className="cursor-pointer relative w-full h-full"
              >
                <Image
                  src={question.identifier}
                  alt={question.taxon.scientificName}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/50 px-3 py-1.5 rounded-md text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Fullscreen
                </div>
              </div>
            </div>

            {isImageFullscreen && (
              <div 
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                onClick={() => setIsImageFullscreen(false)}
              >
                <div className="relative w-full h-full p-4">
                  <Image
                    src={question.identifier}
                    alt={question.taxon.scientificName}
                    fill
                    className="object-contain"
                  />
                  <button 
                    className="absolute top-4 right-4 bg-black/50 px-3 py-1.5 rounded-md text-white text-sm hover:bg-black/70 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsImageFullscreen(false);
                    }}
                  >
                    Exit fullscreen
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <StatusMessage
                currentRank={currentRank}
                lastGuess={lastGuess}
                isCorrect={isCorrect}
                previousRank={previousRank || ''}
              />
            </div>

            <HintBox
              hints={hints}
              isVisible={showHint}
              onToggle={handleShowHint}
              isLoading={Object.keys(hints).length === 0 && showHint}
              currentRank={currentRank}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
              {getOptionsForRank(currentRank,
                currentRankIndex > 0 ? question.taxon[RANK_ORDER[currentRankIndex - 1]] : undefined
              ).map((option) => {
                const isHinted = showHint && Object.keys(hints).includes(option);
                const isGuessed = lastGuess === option;
                const isCorrectGuess = isGuessed && isCorrect;
                const isIncorrectGuess = isGuessed && !isCorrect;

                return (
                  <button
                    key={option}
                    onClick={() => handleGuess(option)}
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
          </div>
        </div>
      )}
    </main>
  )
}
