'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { GameQuestion } from '@/types/taxonomy'
import { getOptionsForRank } from '@/utils/taxonomyMaps'
import { getHints } from '@/utils/hintManager'
import HintBox from '@/components/HintBox'
import StatusMessage from '@/components/StatusMessage'

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

  useEffect(() => {
    fetchQuestion()
  }, [])

  const fetchQuestion = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/questions')
      const data = await response.json()
      setQuestion(data)
      setCurrentRankIndex(0)
      setShowHint(false)
      setHints({})
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
      
      const taxonsToHint = options.slice(0, 3);
      const newHints = await getHints(taxonsToHint);
      setHints(newHints);
    }
    setShowHint(!showHint);
  }

  const handleCorrectAnswer = () => {
    if (currentRankIndex === RANK_ORDER.length - 1) {
      fetchQuestion();
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
      setTimeout(() => {
        handleCorrectAnswer();
        setLastGuess(null);
        setIsCorrect(null);
      }, 2500);
    }
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
    <main className="min-h-screen p-8 max-w-4xl mx-auto bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Animo</h1>
      
      <div className="space-y-8">
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <Image
            src={question.identifier}
            alt={question.taxon.scientificName}
            fill
            className="object-cover"
          />
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

          <div className="grid grid-cols-2 gap-2">
            {getOptionsForRank(currentRank, 
              currentRankIndex > 0 ? question.taxon[RANK_ORDER[currentRankIndex - 1]] : undefined
            ).map((option) => (
              <button
                key={option}
                onClick={() => handleGuess(option)}
                className="p-3 text-left border rounded-md hover:bg-gray-50 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>

          <HintBox
            hints={hints}
            taxonNames={getOptionsForRank(currentRank, 
              currentRankIndex > 0 ? question.taxon[RANK_ORDER[currentRankIndex - 1]] : undefined
            ).slice(0, 3)}
            isVisible={showHint}
            onToggle={handleShowHint}
            isLoading={Object.keys(hints).length === 0 && showHint}
          />
        </div>
      </div>
    </main>
  )
}
