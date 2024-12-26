import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getWikiExtract } from '@/utils/wikiApi';

interface VictoryScreenProps {
  scientificName: string;
  imageUrl: string;
  onNewGame: () => void;
}

export default function VictoryScreen({ scientificName, imageUrl, onNewGame }: VictoryScreenProps) {
  const [speciesInfo, setSpeciesInfo] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpeciesInfo = async () => {
      let info = await getWikiExtract(scientificName);

      // sometimes scientificName is three words, with subspecies. If this happens, info is empty, 
      // try again with just the first two space-separated strings.

      if(!info){
        const speciesNoSub = scientificName.split(' ').slice(0, 2).join(' ');
        info = await getWikiExtract(speciesNoSub)
      }

      // if it's still empty, fine.

      setSpeciesInfo(info);
    };
    fetchSpeciesInfo();
  }, [scientificName]);

  return (
    <div className="space-y-8">
      <div className="aspect-video relative rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={scientificName}
          fill
          className="object-cover"
        />
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Congratulations!
        </h2>
        <p className="text-gray-600 mb-4">
          Youve correctly identified: <span className="font-medium italic">{scientificName}</span>
        </p>
        
        <div className="bg-white p-4 rounded-md border border-gray-100">
          {speciesInfo ? (
            <p className="text-gray-700">{speciesInfo}</p>
          ) : (
            <p className="text-gray-500">Loading species information...</p>
          )}
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