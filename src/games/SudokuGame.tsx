import { useState, useCallback } from 'react';
import { GameShell } from '@/components/HomeScreen';
import { RotateCcw, Trophy } from 'lucide-react';

function generateSudoku(): number[][] {
  const base = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9],
  ];
  const puzzle = base.map((row) => [...row]);
  const cellsToRemove = 35;
  let removed = 0;
  while (removed < cellsToRemove) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      removed++;
    }
  }
  return puzzle;
}

export function SudokuGame({ onBack }: { onBack: () => void }) {
  const [puzzle, setPuzzle] = useState<number[][]>(() => generateSudoku());
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);

  const setCell = useCallback((r: number, c: number, val: number) => {
    setPuzzle((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = val;
      return next;
    });
  }, []);

  const isComplete = puzzle.every((row) => row.every((v) => v !== 0));
  const isCorrect = isComplete && puzzle.every((row, r) => {
    return row.every((v, c) => {
      const col = puzzle.map((row2) => row2[c]);
      const boxR = Math.floor(r / 3) * 3;
      const boxC = Math.floor(c / 3) * 3;
      const box: number[] = [];
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) box.push(puzzle[boxR + i][boxC + j]);
      return row.filter((x) => x === v).length === 1 &&
             col.filter((x) => x === v).length === 1 &&
             box.filter((x) => x === v).length === 1;
    });
  });

  return (
    <GameShell title="Sudoku" onBack={onBack}>
      {isCorrect && (
        <div className="mb-4 rounded-2xl bg-green-100 border-2 border-green-300 p-4 flex items-center gap-3 animate-pop">
          <Trophy className="text-green-600" size={28} />
          <p className="text-green-700 font-bold text-lg">Tebrikler! Sudokuyu çözdün!</p>
        </div>
      )}

      <div className="flex justify-center mb-4">
        <div className="grid grid-cols-9 gap-0.5 bg-slate-300 rounded-xl overflow-hidden p-1">
          {puzzle.map((row, r) =>
            row.map((cell, c) => {
              const isSelected = selected?.r === r && selected?.c === c;
              const borderR = r % 3 === 0 ? 'border-t-2 border-t-slate-400' : '';
              const borderC = c % 3 === 0 ? 'border-l-2 border-l-slate-400' : '';
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => setSelected({ r, c })}
                  className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-lg font-bold transition-colors ${borderR} ${borderC} ${
                    isSelected ? 'bg-amber-300' : cell !== 0 ? 'bg-blue-50 text-blue-700' : 'bg-white text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  {cell !== 0 ? cell : ''}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Number pad */}
      <div className="flex justify-center gap-2 mb-4">
        {[1,2,3,4,5,6,7,8,9].map((n) => (
          <button
            key={n}
            onClick={() => {
              if (selected) setCell(selected.r, selected.c, n);
            }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-lg shadow-md hover:scale-110 transition-transform"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => {
            if (selected) setCell(selected.r, selected.c, 0);
          }}
          className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 font-bold shadow-md hover:scale-110 transition-transform"
        >
          ✕
        </button>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => {
            setPuzzle(generateSudoku());
            setSelected(null);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-800 transition-colors"
        >
          <RotateCcw size={18} /> Yeni Oyun
        </button>
      </div>
    </GameShell>
  );
}
