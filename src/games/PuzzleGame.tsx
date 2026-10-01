import { useState, useEffect, useCallback } from 'react';
import { GameShell } from '@/components/HomeScreen';
import { RotateCcw, Trophy } from 'lucide-react';

type Board = number[];

function generateBoard(): Board {
  const board: Board = [];
  for (let i = 1; i <= 15; i++) board.push(i);
  board.push(0);
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }
  return board;
}

function isSolved(board: Board): boolean {
  for (let i = 0; i < 15; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[15] === 0;
}

const tileColors = [
  'from-red-400 to-red-500',
  'from-orange-400 to-orange-500',
  'from-amber-400 to-amber-500',
  'from-yellow-400 to-yellow-500',
  'from-lime-400 to-lime-500',
  'from-green-400 to-green-500',
  'from-emerald-400 to-emerald-500',
  'from-teal-400 to-teal-500',
  'from-cyan-400 to-cyan-500',
  'from-sky-400 to-sky-500',
  'from-blue-400 to-blue-500',
  'from-indigo-400 to-indigo-500',
  'from-violet-400 to-violet-500',
  'from-purple-400 to-purple-500',
  'from-fuchsia-400 to-fuchsia-500',
];

export function PuzzleGame({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<Board>(() => generateBoard());
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const move = useCallback((index: number) => {
    const empty = board.indexOf(0);
    const r = Math.floor(index / 4);
    const c = index % 4;
    const er = Math.floor(empty / 4);
    const ec = empty % 4;
    if ((r === er && Math.abs(c - ec) === 1) || (c === ec && Math.abs(r - er) === 1)) {
      const next = [...board];
      [next[index], next[empty]] = [next[empty], next[index]];
      setBoard(next);
      setMoves((m) => m + 1);
    }
  }, [board]);

  useEffect(() => {
    if (isSolved(board)) setWon(true);
  }, [board]);

  const reset = () => {
    setBoard(generateBoard());
    setMoves(0);
    setWon(false);
  };

  return (
    <GameShell title="Kaydırma Yapbozu" onBack={onBack}>
      {won && (
        <div className="mb-4 rounded-2xl bg-green-100 border-2 border-green-300 p-4 flex items-center gap-3 animate-pop">
          <Trophy className="text-green-600" size={28} />
          <p className="text-green-700 font-bold text-lg">Tebrikler! {moves} hamlede bitirdin!</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-slate-600 font-bold">Hamle: {moves}</span>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-800 transition-colors"
        >
          <RotateCcw size={18} /> Yeni
        </button>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-4 gap-2 bg-slate-200 p-3 rounded-2xl shadow-xl">
          {board.map((tile, i) => (
            <button
              key={i}
              onClick={() => tile !== 0 && move(i)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl font-bold text-2xl text-white shadow-md transition-all hover:scale-105 ${
                tile === 0
                  ? 'bg-transparent shadow-none'
                  : `bg-gradient-to-br ${tileColors[tile - 1]}`
              }`}
            >
              {tile !== 0 ? tile : ''}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
