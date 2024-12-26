'use client' 

import React from 'react'
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
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
          Animo: Guess the Phylogeny
        </h1>
        
        <div className="space-y-8">
          {/* Image card with shadow and better aspect ratio */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/mus_musculus.png"
                alt="Mystery organism"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <select
                value={selectedKingdom}
                onChange={(e) => setSelectedKingdom(e.target.value as Kingdom)}
                className="w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a kingdom</option>
                {Object.keys(kingdoms).map((kingdom) => (
                  <option key={kingdom} value={kingdom}>
                    {kingdom.charAt(0).toUpperCase() + kingdom.slice(1)}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>

              <button
                onClick={handleSubmit}
                className="inline-flex items-center px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Submit
              </button>
            </div>

            {showHint && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Kingdom Descriptions:</h2>
                <ul className="space-y-3">
                  {Object.entries(kingdoms).map(([kingdom, description]) => (
                    <li key={kingdom} className="flex flex-col">
                      <span className="font-medium capitalize text-gray-700">{kingdom}</span>
                      <span className="text-gray-600">{description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback && (
              <div className={`p-4 rounded-lg ${
                feedback.includes('Correct') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {feedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 