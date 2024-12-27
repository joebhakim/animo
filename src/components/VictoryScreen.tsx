import { useState, useEffect } from 'react';
import { getWikiExtract, getWikiHeaderImage } from '@/utils/wikiApi';
import TreeViewScore from './TreeViewScore';
import ScoreCalculation from './ScoreCalculation';
import FullscreenImage from './FullscreenImage';

interface VictoryScreenProps {
  scientificName: string;
  imageUrl: string;
  onNewGame: () => void;
  guessHistory: Record<string, string[]>;
  correctGuesses: string[];
  correctGuessValues: Record<string, string>;
}

export default function VictoryScreen({
  scientificName,
  imageUrl,
  onNewGame,
  guessHistory,
  correctGuesses,
  correctGuessValues
}: VictoryScreenProps) {
  const [speciesInfo, setSpeciesInfo] = useState<string | null>(null);
  const [wikiPageTitle, setWikiPageTitle] = useState<string | null>(null);
  const [wikiHeaderImage, setWikiHeaderImage] = useState<string | null>(null);

  const numSentencesToFetch = 5;
  useEffect(() => {
    const fetchSpeciesInfo = async () => {
      let info = await getWikiExtract(scientificName, numSentencesToFetch);
      if (!info.pageTitle) {
        const speciesNoSub = scientificName.split(' ').slice(0, 2).join(' ');
        info = await getWikiExtract(speciesNoSub, numSentencesToFetch);
      }
      setSpeciesInfo(info.extract);
      setWikiPageTitle(info.pageTitle);

      if (info.pageTitle) {
        const headerImage = await getWikiHeaderImage(info.pageTitle);
        setWikiHeaderImage(headerImage);
      }
    };
    fetchSpeciesInfo();
  }, [scientificName]);

  const wikiUrl = wikiPageTitle
    ? `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiPageTitle)}`
    : null;

  return (
    <div className="space-y-8">


      <TreeViewScore
        guessHistory={guessHistory}
        correctGuesses={correctGuesses}
        currentRank="species"
        correctGuessValues={correctGuessValues}
      />

      <div>
        <FullscreenImage
          src={imageUrl}
          alt={scientificName}
        />
      </div>

      <ScoreCalculation guessHistory={guessHistory} />

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Congratulations!
        </h2>
        <p className="text-gray-600 mb-4">
          Youve correctly identified: <span className="font-medium italic">{scientificName}</span>
        </p>

        <div className="space-y-4">
          {wikiHeaderImage && (
            <div>
              <FullscreenImage
                src={wikiHeaderImage}
                alt={`Wikipedia image of ${scientificName}`}
              />
              <p className="text-sm text-gray-500 mt-1">Wikipedia header image</p>
            </div>
          )}

          <div className="bg-white p-4 rounded-md border border-gray-100">
            {speciesInfo ? (
              <>
                <p className="text-gray-700">{speciesInfo}</p>
                {wikiUrl && (
                  <a
                    href={wikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 mt-2 inline-block"
                  >
                    Read more on Wikipedia →
                  </a>
                )}
              </>
            ) : (
              <p className="text-gray-500">Loading species information...</p>
            )}
          </div>
        </div>

        <button
          onClick={onNewGame}
          className="mt-6 w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Start New Game
        </button>
      </div>
    </div>
  );
} 