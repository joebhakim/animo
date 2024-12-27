import FullscreenImage from '../FullscreenImage';
import TreeViewScore from '../TreeViewScore';
import StatusMessage from '../StatusMessage';
import HintBox from '../HintBox';
import AnswerGrid from './AnswerGrid';
import { GameQuestion } from '@/types/taxonomy';

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
  onGuess: (option: string) => void;
  options: string[];
  expertMode: boolean;
}

export default function GameContent(props: GameContentProps) {
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
            alt={props.question.taxon.scientificName}
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
          onGuess={props.onGuess}
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