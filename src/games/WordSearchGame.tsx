import { useState, useCallback, useMemo } from 'react';
import { GameShell } from '@/components/HomeScreen';
import { RotateCcw, Trophy } from 'lucide-react';

const wordPool = ['KEDİ', 'KÖPEK', 'BALIK', 'KUŞ', 'AYI', 'TİLKİ', 'ASLAN', 'MAYMUN', 'TAVŞAN', 'YILAN'];
const gridSize = 10;

interface Cell {
  letter: string;
  row: number;
  col: number;
}

function generateGrid(words: string[]): { grid: string[][]; placed: { word: string; cells: { r: number; c: number }[] }[] } {
  const grid: string[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
  const placed: { word: string; cells: { r: number; c: number }[] }[] = [];
  const dirs = [[0,1],[1,0],[1,1],[0,-1],[1,-1]];

  for (const word of words) {
    let placedWord = false;
    for (let attempt = 0; attempt < 50 && !placedWord; attempt++) {
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      const r = Math.floor(Math.random() * gridSize);
      const c = Math.floor(Math.random() * gridSize);
      const endR = r + dir[0] * (word.length - 1);
      const endC = c + dir[1] * (word.length - 1);
      if (endR < 0 || endR >= gridSize || endC < 0 || endC >= gridSize) continue;
      let ok = true;
      const cells: { r: number; c: number }[] = [];
      for (let i = 0; i < word.length; i++) {
        const rr = r + dir[0] * i;
        const cc = c + dir[1] * i;
        if (grid[rr][cc] && grid[rr][cc] !== word[i]) { ok = false; break; }
        cells.push({ r: rr, c: cc });
      }
      if (ok) {
        for (let i = 0; i < word.length; i++) {
          grid[cells[i].r][cells[i].c] = word[i];
        }
        placed.push({ word, cells });
        placedWord = true;
      }
    }
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (!grid[r][c]) grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
  }
  return { grid, placed };
}

export function WordSearchGame({ onBack }: { onBack: () => void }) {
  const words = useMemo(() => {
    const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, []);

  const [{ grid, placed }, setBoard] = useState(() => generateGrid(words));
  const [found, setFound] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState<{ r: number; c: number } | null>(null);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);

  const foundCells = useMemo(() => {
    const s = new Set<string>();
    found.forEach((w) => {
      const p = placed.find((pl) => pl.word === w);
      if (p) p.cells.forEach((c) => s.add(`${c.r}-${c.c}`));
    });
    return s;
  }, [found, placed]);

  const allFound = words.every((w) => found.has(w));

  const handleStart = (r: number, c: number) => {
    setSelecting({ r, c });
    setSelectedCells([`${r}-${c}`]);
  };

  const handleEnter = (r: number, c: number) => {
    if (!selecting) return;
    const key = `${r}-${c}`;
    if (!selectedCells.includes(key)) {
      setSelectedCells((prev) => [...prev, key]);
    }
  };

  const handleEnd = useCallback(() => {
    if (selectedCells.length >= 2) {
      const word = selectedCells
        .map((k) => {
          const [r, c] = k.split('-').map(Number);
          return grid[r][c];
        })
        .join('');
      const reversed = word.split('').reverse().join('');
      const matched = words.find((w) => w === word || w === reversed);
      if (matched && !found.has(matched)) {
        setFound((prev) => new Set([...prev, matched]));
      }
    }
    setSelecting(null);
    setSelectedCells([]);
  }, [selectedCells, words, found, grid]);

  const reset = () => {
    setBoard(generateGrid(words));
    setFound(new Set());
    setSelectedCells([]);
    setSelecting(null);
  };

  return (
    <GameShell title="Kelime Bulma" onBack={onBack}>
      {allFound && (
        <div className="mb-4 rounded-2xl bg-green-100 border-2 border-green-300 p-4 flex items-center gap-3 animate-pop">
          <Trophy className="text-green-600" size={28} />
          <p className="text-green-700 font-bold text-lg">Tüm kelimeleri buldun!</p>
        </div>
      )}

      {/* Word list */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {words.map((w) => (
          <span
            key={w}
            className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
              found.has(w)
                ? 'bg-green-200 text-green-700 line-through'
                : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            {w}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="flex justify-center mb-4 overflow-x-auto">
        <div
          className="grid gap-0.5 touch-none select-none"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
        >
          {grid.map((row, r) =>
            row.map((letter, c) => {
              const key = `${r}-${c}`;
              const isFound = foundCells.has(key);
              const isSelected = selectedCells.includes(key);
              return (
                <div
                  key={key}
                  onMouseDown={() => handleStart(r, c)}
                  onMouseEnter={() => handleEnter(r, c)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold rounded-md cursor-pointer transition-colors ${
                    isFound
                      ? 'bg-green-300 text-green-800'
                      : isSelected
                      ? 'bg-amber-300 text-amber-800'
                      : 'bg-white text-slate-600 hover:bg-indigo-50'
                  }`}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-800 transition-colors"
        >
          <RotateCcw size={18} /> Yeni Oyun
        </button>
      </div>
    </GameShell>
  );
}
