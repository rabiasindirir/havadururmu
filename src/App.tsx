import { useState } from 'react';
import { HomeScreen } from '@/components/HomeScreen';
import type { GameId } from '@/games/registry';
import { SudokuGame } from '@/games/SudokuGame';
import { MemoryGame } from '@/games/MemoryGame';
import { ColoringGame } from '@/games/ColoringGame';
import { PuzzleGame } from '@/games/PuzzleGame';
import { TicTacToeGame } from '@/games/TicTacToeGame';
import { SequenceGame } from '@/games/SequenceGame';
import { WordSearchGame } from '@/games/WordSearchGame';
import { MazeGame } from '@/games/MazeGame';
import { OddOutGame } from '@/games/OddOutGame';
import { MathQuizGame } from '@/games/MathQuizGame';

function App() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const back = () => setActiveGame(null);

  switch (activeGame) {
    case 'sudoku': return <SudokuGame onBack={back} />;
    case 'memory': return <MemoryGame onBack={back} />;
    case 'coloring': return <ColoringGame onBack={back} />;
    case 'puzzle': return <PuzzleGame onBack={back} />;
    case 'tictactoe': return <TicTacToeGame onBack={back} />;
    case 'sequence': return <SequenceGame onBack={back} />;
    case 'wordsearch': return <WordSearchGame onBack={back} />;
    case 'maze': return <MazeGame onBack={back} />;
    case 'oddout': return <OddOutGame onBack={back} />;
    case 'mathquiz': return <MathQuizGame onBack={back} />;
    default: return <HomeScreen onSelectGame={setActiveGame} />;
  }
}

export default App;
