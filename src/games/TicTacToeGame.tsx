import { useState, useCallback } from 'react';
import { GameShell } from '@/components/HomeScreen';
import { RotateCcw, Trophy } from 'lucide-react';

type Cell = 'X' | 'O' | null;

function checkWinner(board: Cell[]): Cell | 'draw' | null {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every((c) => c !== null)) return 'draw';
  return null;
}

function bestMove(board: Cell[], player: 'O'): number {
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = player;
      if (checkWinner(board) === player) { board[i] = null; return i; }
      board[i] = null;
    }
  }
  const human: 'X' = 'X';
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = human;
      if (checkWinner(board) === human) { board[i] = null; return i; }
      board[i] = null;
    }
  }
  if (!board[4]) return 4;
  const corners = [0,2,6,8].filter((i) => !board[i]);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  const edges = [1,3,5,7].filter((i) => !board[i]);
  if (edges.length) return edges[Math.floor(Math.random() * edges.length)];
  return -1;
}

export function TicTacToeGame({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [winner, setWinner] = useState<Cell | 'draw' | null>(null);
  const [score, setScore] = useState({ you: 0, ai: 0, draws: 0 });

  const play = useCallback((i: number) => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = 'X';
    const w = checkWinner(next);
    setBoard(next);
    if (w) {
      setWinner(w);
      if (w === 'X') setScore((s) => ({ ...s, you: s.you + 1 }));
      else if (w === 'draw') setScore((s) => ({ ...s, draws: s.draws + 1 }));
      return;
    }
    const aiIdx = bestMove([...next], 'O');
    if (aiIdx >= 0) {
      next[aiIdx] = 'O';
      setBoard(next);
      const w2 = checkWinner(next);
      if (w2) {
        setWinner(w2);
        if (w2 === 'O') setScore((s) => ({ ...s, ai: s.ai + 1 }));
        else if (w2 === 'draw') setScore((s) => ({ ...s, draws: s.draws + 1 }));
      }
    }
  }, [board, winner]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
  };

  return (
    <GameShell title="XOX Oyunu" onBack={onBack}>
      {/* Score */}
      <div className="flex justify-center gap-4 mb-5">
        <div className="bg-emerald-100 rounded-xl px-5 py-2 text-center">
          <p className="text-emerald-600 text-xs font-bold">SEN</p>
          <p className="text-emerald-700 text-2xl font-bold">{score.you}</p>
        </div>
        <div className="bg-slate-100 rounded-xl px-5 py-2 text-center">
          <p className="text-slate-500 text-xs font-bold">BERABERE</p>
          <p className="text-slate-600 text-2xl font-bold">{score.draws}</p>
        </div>
        <div className="bg-rose-100 rounded-xl px-5 py-2 text-center">
          <p className="text-rose-500 text-xs font-bold">BİLGİSAYAR</p>
          <p className="text-rose-600 text-2xl font-bold">{score.ai}</p>
        </div>
      </div>

      {winner && (
        <div className="mb-4 rounded-2xl p-4 flex items-center justify-center gap-3 animate-pop"
          style={{
            background: winner === 'X' ? '#dcfce7' : winner === 'O' ? '#ffe4e6' : '#f1f5f9',
            border: `2px solid ${winner === 'X' ? '#86efac' : winner === 'O' ? '#fda4af' : '#cbd5e1'}`,
          }}
        >
          <Trophy size={28} style={{ color: winner === 'X' ? '#16a34a' : winner === 'O' ? '#e11d48' : '#64748b' }} />
          <p className="font-bold text-lg" style={{ color: winner === 'X' ? '#16a34a' : winner === 'O' ? '#e11d48' : '#64748b' }}>
            {winner === 'X' ? 'Kazandın!' : winner === 'O' ? 'Bilgisayar kazandı!' : 'Berabere!'}
          </p>
        </div>
      )}

      <div className="flex justify-center mb-5">
        <div className="grid grid-cols-3 gap-2 bg-slate-200 p-3 rounded-2xl shadow-xl">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => play(i)}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl text-5xl font-bold flex items-center justify-center shadow-md transition-all hover:scale-105 ${
                cell === 'X' ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white' : cell === 'O' ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white' : 'bg-white'
              }`}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-800 transition-colors"
        >
          <RotateCcw size={18} /> Tekrar Oyna
        </button>
      </div>
    </GameShell>
  );
}
