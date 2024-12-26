'use client'

import { useState } from 'react'
import Image from 'next/image'

const kingdoms = {
  animalia: "Animals consume organic material, breathe oxygen, have myocytes and are able to move, can reproduce sexually.",
  plantae: "Plants are photosynthetic organisms that have cell walls containing cellulose.",
  fungi: "Fungi are heterotrophic organisms that digest their food externally and absorb nutrients directly.",
  protista: "Protists are diverse eukaryotic organisms that don't fit into other kingdoms.",
  bacteria: "Bacteria are prokaryotic microorganisms with cell walls containing peptidoglycan.",
  archaea: "Archaea are prokaryotic microorganisms distinct from bacteria, often found in extreme environments."
}

type Kingdom = keyof typeof kingdoms

export default function Home() {
  const [selectedKingdom, setSelectedKingdom] = useState<Kingdom | ''>('')
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = () => {
    if (!selectedKingdom) {
      setFeedback('Please select a kingdom')
      return
    }
    
    if (selectedKingdom === 'animalia') {
      setFeedback('Correct! This is indeed an animal.')
    } else {
      setFeedback('Incorrect. Try again!')
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Animo: Guess the Phylogeny</h1>
      
      <div className="space-y-6">
        {/* Image container with fixed aspect ratio */}
        <div className="relative w-full aspect-square max-w-2xl mx-auto border rounded-lg overflow-hidden">
          <Image
            src="/mouse.jpg"
            alt="Mystery organism"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <select
              value={selectedKingdom}
              onChange={(e) => setSelectedKingdom(e.target.value as Kingdom)}
              className="p-2 border rounded"
            >
              <option value="">Select a kingdom</option>
              {Object.keys(kingdoms).map((taxon) => (
                <option key={taxon} value={taxon}>
                  {taxon.charAt(0).toUpperCase() + taxon.slice(1)}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>

            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>

          {showHint && (
            <div className="bg-gray-100 p-4 rounded">
              <h2 className="font-bold mb-2">Taxon Descriptions:</h2>
              <ul className="space-y-2">
                {Object.entries(kingdoms).map(([taxon, description]) => (
                  <li key={taxon}>
                    <span className="font-semibold capitalize">{taxon}</span>: {description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feedback && (
            <div className={`p-4 rounded ${
              feedback.includes('Correct') ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {feedback}
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 