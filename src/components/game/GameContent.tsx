import FullscreenImage from '../FullscreenImage';
import TreeViewScore from '../TreeViewScore';
import StatusMessage from '../StatusMessage';
import HintBox from '../HintBox';
import AnswerGrid from './AnswerGrid';
import { GameQuestion } from '@/types/taxonomy';
import TypingField from './TypingField';
import { useState } from 'react';

interface GameContentProps {
  question: GameQuestion;
  currentRank: string;
  showScoreOnMobile: boolean;
  onToggleScore: () => void;
  guessHistory: Record<string, string[]>;
  correctGuesses: string[];
  correctGuessValues: Record<string, string>;
  lastGuess: string | null;
  isCorrect: boolean | null;
  previousRank: string;
  showHint: boolean;
  hints: Record<string, string>;
  onShowHint: () => void;
  onTypedGuess: (option: string) => void;
  onGetSuggestions?: (text: string) => Promise<string[]>;
  options: string[];
  expertMode: boolean;
}

export default function GameContent(props: GameContentProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const handleInputChange = async (text: string) => {
    if (text.length >= 3 && props.onGetSuggestions) {
      try {
        const newSuggestions = await props.onGetSuggestions(text);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-rows-[auto,1fr] md:grid-rows-1 md:grid-cols-[1fr,300px] lg:grid-cols-[1fr,300px] gap-2 md:gap-4">
        <button
          onClick={props.onToggleScore}
          className="md:hidden order-1 bg-gray-100 p-2 rounded-md flex items-center justify-between"
        >
          <span>Progress</span>
          <span className={`transform transition-transform ${props.showScoreOnMobile ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        <div className={`
          order-1 md:order-2
          ${props.showScoreOnMobile ? 'block' : 'hidden'}
          md:block
        `}>
          <TreeViewScore
            guessHistory={props.guessHistory}
            correctGuesses={props.correctGuesses}
            currentRank={props.currentRank}
            correctGuessValues={props.correctGuessValues}
          />
        </div>

        <div className="order-2 md:order-1">
          <FullscreenImage
            src={props.question.identifier}
            alt={'NO CHEATING. This is an image of the animal you are trying to identify.'}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <StatusMessage
            currentRank={props.currentRank}
            lastGuess={props.lastGuess}
            isCorrect={props.isCorrect}
          />
        </div>

        <HintBox
          hints={props.hints}
          isVisible={props.showHint}
          onToggle={props.onShowHint}
          isLoading={Object.keys(props.hints).length === 0 && props.showHint}
          currentRank={props.currentRank}
        />

        <AnswerGrid
          options={props.options}
          showHint={props.showHint}
          hints={props.hints}
          lastGuess={props.lastGuess}
          isCorrect={props.isCorrect}
          onGuess={props.onTypedGuess}
        />

        <TypingField
          onSubmitTypedText={props.onTypedGuess}
          species={props.question.taxon.species}
          suggestions={suggestions}
          onInputChange={handleInputChange}
        />

        {/* if not on expert mode, hint that we're hiding some options... */}
        {!props.expertMode && (
          <div className="bg-white p-4 rounded-md">
            <p className="text-sm text-gray-400">
              Easy mode: max 6 options, 3 if you use hints!
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 