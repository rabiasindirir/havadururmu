import { useState, useEffect, useCallback } from 'react';
import { GameShell } from '@/components/HomeScreen';
import { RotateCcw, Trophy } from 'lucide-react';

const SIZE = 12;

type Grid = boolean[][];

function generateMaze(): Grid {
  const grid: Grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  const stack: [number, number][] = [[1, 1]];
  grid[1][1] = true;

  while (stack.length) {
    const [r, c] = stack[stack.length - 1];
    const dirs = [[0,2],[0,-2],[2,0],[-2,0]].sort(() => Math.random() - 0.5);
    let moved = false;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr > 0 && nr < SIZE - 1 && nc > 0 && nc < SIZE - 1 && !grid[nr][nc]) {
        grid[r + dr / 2][c + dc / 2] = true;
        grid[nr][nc] = true;
        stack.push([nr, nc]);
        moved = true;
        break;
      }
    }
    if (!moved) stack.pop();
  }
  grid[SIZE - 2][SIZE - 2] = true;
  return grid;
}

export function MazeGame({ onBack }: { onBack: () => void }) {
  const [maze, setMaze] = useState<Grid>(() => generateMaze());
  const [player, setPlayer] = useState<{ r: number; c: number }>({ r: 1, c: 1 });
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const end = { r: SIZE - 2, c: SIZE - 2 };

  const move = useCallback((dr: number, dc: number) => {
    if (won) return;
    setPlayer((p) => {
      const nr = p.r + dr;
      const nc = p.c + dc;
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && maze[nr][nc]) {
        setMoves((m) => m + 1);
        if (nr === end.r && nc === end.c) setWon(true);
        return { r: nr, c: nc };
      }
      return p;
    });
  }, [maze, won, end]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); move(-1, 0); }
      if (e.key === 'ArrowDown' || e.key === 's') { e.preventDefault(); move(1, 0); }
      if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); move(0, -1); }
      if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); move(0, 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [move]);

  const reset = () => {
    setMaze(generateMaze());
    setPlayer({ r: 1, c: 1 });
    setWon(false);
    setMoves(0);
  };

  return (
    <GameShell title="Labirent" onBack={onBack}>
      {won && (
        <div className="mb-4 rounded-2xl bg-green-100 border-2 border-green-300 p-4 flex items-center gap-3 animate-pop">
          <Trophy className="text-green-600" size={28} />
          <p className="text-green-700 font-bold text-lg">Çıkışı buldun! {moves} hamle!</p>
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

      <div className="flex justify-center mb-4">
        <div
          className="grid gap-0.5 bg-slate-800 p-2 rounded-2xl shadow-xl"
          style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
        >
          {maze.map((row, r) =>
            row.map((isPath, c) => {
              const isPlayer = player.r === r && player.c === c;
              const isEnd = end.r === r && end.c === c;
              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-sm ${
                    isPlayer
                      ? 'bg-green-400 shadow-md animate-pulse'
                      : isEnd
                      ? 'bg-red-400'
                      : isPath
                      ? 'bg-lime-100'
                      : 'bg-slate-700'
                  }`}
                />
              )
            })
          )}
        </div>
      </div>

      {/* Touch controls */}
      <div className="flex flex-col items-center gap-2 sm:hidden">
        <button onClick={() => move(-1, 0)} className="w-14 h-14 rounded-xl bg-slate-200 text-2xl font-bold shadow-md active:scale-90">↑</button>
        <div className="flex gap-2">
          <button onClick={() => move(0, -1)} className="w-14 h-14 rounded-xl bg-slate-200 text-2xl font-bold shadow-md active:scale-90">←</button>
          <button onClick={() => move(1, 0)} className="w-14 h-14 rounded-xl bg-slate-200 text-2xl font-bold shadow-md active:scale-90">↓</button>
          <button onClick={() => move(0, 1)} className="w-14 h-14 rounded-xl bg-slate-200 text-2xl font-bold shadow-md active:scale-90">→</button>
        </div>
      </div>
      <p className="hidden sm:block text-center text-slate-400 text-sm font-semibold">
        Ok tuşları veya WASD ile hareket et
      </p>
    </GameShell>
  );
}
