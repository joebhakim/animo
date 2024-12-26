'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { GameQuestion } from '@/types/taxonomy'
import { getOptionsForRank } from '@/utils/taxonomyMaps'
import { getWikiExtract } from '@/utils/wikiApi'

const RANK_ORDER = [
  'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'
] as const;

export default function Home() {
  const [question, setQuestion] = useState<GameQuestion | null>(null)
  const [currentRankIndex, setCurrentRankIndex] = useState(0)
  const [selectedTaxon, setSelectedTaxon] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hintText, setHintText] = useState<string | null>(null)

  useEffect(() => {
    fetchQuestion()
  }, [])

  const fetchQuestion = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/questions')
      const data = await response.json()
      setQuestion(data)
      setCurrentRankIndex(0) // Reset to kingdom when getting new question
      setSelectedTaxon('')
    } catch (error) {
      console.error('Error fetching question:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question) return

    const currentRank = RANK_ORDER[currentRankIndex]
    if (selectedTaxon.toLowerCase() === question.taxon[currentRank].toLowerCase()) {
      if (currentRankIndex === RANK_ORDER.length - 1) {
        alert('Congratulations! You\'ve correctly identified all taxonomic ranks!')
        fetchQuestion()
      } else {
        setCurrentRankIndex(currentRankIndex + 1)
        setSelectedTaxon('')
        alert('Correct! Try the next taxonomic rank.')
      }
    } else {
      alert('Try again!')
    }
  }

  const handleShowHint = async () => {
    if (!showHint && !hintText && question) {
      const extract = await getWikiExtract(question.taxon[RANK_ORDER[currentRankIndex]]);
      setHintText(extract);
    }
    setShowHint(!showHint);
  }

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="taxonRank" className="block text-sm font-medium text-gray-700 mb-2">
              Select {currentRank.charAt(0).toUpperCase() + currentRank.slice(1)}:
            </label>
            <select
              id="taxonRank"
              value={selectedTaxon}
              onChange={(e) => setSelectedTaxon(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900"
              required
            >
              <option value="">Select a {currentRank}...</option>
              {getOptionsForRank(currentRank, 
                currentRankIndex > 0 ? question.taxon[RANK_ORDER[currentRankIndex - 1]] : undefined
              ).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleShowHint}
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100"
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>

            {showHint && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="font-semibold mb-2 text-gray-900">Hint:</h3>
                {hintText ? (
                  <div dangerouslySetInnerHTML={{ __html: hintText }} />
                ) : (
                  <p>Loading hint...</p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
