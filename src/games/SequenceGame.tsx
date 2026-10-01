import { useState, useCallback, useEffect } from 'react';
import { GameShell } from '@/components/HomeScreen';
import { RotateCcw, Trophy, Check, X } from 'lucide-react';

interface Puzzle {
  sequence: (number | null)[];
  answer: number;
  hint: string;
}

function generatePuzzle(): Puzzle {
  const type = Math.floor(Math.random() * 4);
  let seq: number[] = [];
  let answer = 0;
  let hint = '';

  if (type === 0) {
    const start = Math.floor(Math.random() * 5) + 1;
    const step = Math.floor(Math.random() * 3) + 2;
    seq = [start, start + step, start + step * 2, start + step * 3, start + step * 4];
    answer = start + step * 5;
    hint = `Her sayı ${step} artıyor`;
  } else if (type === 1) {
    const start = Math.floor(Math.random() * 3) + 2;
    seq = [start, start * 2, start * 3, start * 4, start * 5];
    answer = start * 6;
    hint = `Her sayı ${start} ile çarpılıyor`;
  } else if (type === 2) {
    let a = Math.floor(Math.random() * 5) + 1;
    let b = Math.floor(Math.random() * 5) + 6;
    seq = [a, b, a + b, a + 2 * b, a + 3 * b];
    answer = a + 4 * b;
    hint = 'Fibonacci benzeri toplama';
  } else {
    const start = Math.floor(Math.random() * 10) + 10;
    seq = [start, start - 2, start - 4, start - 6, start - 8];
    answer = start - 10;
    hint = 'Her sayı 2 azalıyor';
  }

  const blankIdx = Math.floor(Math.random() * 5);
  const answerInSeq = seq[blankIdx];
  seq[blankIdx] = -1;
  return { sequence: seq.map((v) => (v === -1 ? null : v)), answer: answerInSeq, hint };
}

function generateChoices(answer: number): number[] {
  const choices = new Set<number>([answer]);
  while (choices.size < 4) {
    const delta = Math.floor(Math.random() * 10) - 5;
    if (delta !== 0) choices.add(answer + delta);
  }
  return [...choices].sort(() => Math.random() - 0.5);
}

export function SequenceGame({ onBack }: { onBack: () => void }) {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => generatePuzzle());
  const [choices, setChoices] = useState<number[]>(() => generateChoices(puzzle.answer));
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const next = useCallback(() => {
    const p = generatePuzzle();
    setPuzzle(p);
    setChoices(generateChoices(p.answer));
    setPicked(null);
    setResult(null);
    setRound((r) => r + 1);
  }, []);

  const handlePick = (val: number) => {
    if (result) return;
    setPicked(val);
    if (val === puzzle.answer) {
      setResult('correct');
      setScore((s) => s + 1);
      setTimeout(next, 1500);
    } else {
      setResult('wrong');
    }
  };

  const reset = () => {
    setScore(0);
    setRound(1);
    next();
  };

  return (
    <GameShell title="Sayı Sıralama" onBack={onBack}>
      <div className="flex items-center justify-between mb-5 px-2">
        <span className="text-slate-600 font-bold">Skor: {score}</span>
        <span className="text-slate-500 font-semibold">Tur: {round}</span>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-800 transition-colors"
        >
          <RotateCcw size={18} /> Sıfırla
        </button>
      </div>

      {/* Sequence display */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-5">
        <p className="text-center text-slate-400 text-sm font-semibold mb-4">İpucu: {puzzle.hint}</p>
        <div className="flex justify-center items-center gap-2 sm:gap-3 flex-wrap">
          {puzzle.sequence.map((val, i) => (
            <div
              key={i}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md ${
                val === null
                  ? 'bg-gradient-to-br from-teal-400 to-cyan-500 text-white border-4 border-dashed border-white animate-pulse'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {val === null ? '?' : val}
            </div>
          ))}
        </div>
      </div>

      {/* Choices */}
      <p className="text-center text-slate-500 font-bold mb-3">Doğru sayıyı seç:</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
        {choices.map((c) => {
          const isPicked = picked === c;
          const isCorrect = result === 'correct' && isPicked;
          const isWrong = result === 'wrong' && isPicked;
          return (
            <button
              key={c}
              onClick={() => handlePick(c)}
              disabled={!!result}
              className={`h-16 rounded-2xl text-2xl font-bold shadow-md transition-all hover:scale-105 ${
                isCorrect
                  ? 'bg-green-400 text-white animate-pop'
                  : isWrong
                  ? 'bg-red-400 text-white animate-shake'
                  : 'bg-white text-slate-700 hover:bg-teal-50'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {result && (
        <div className="mt-5 flex justify-center">
          {result === 'correct' ? (
            <div className="flex items-center gap-2 text-green-600 font-bold text-lg animate-pop">
              <Check size={24} /> Doğru!
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-500 font-bold text-lg animate-pop">
              <X size={24} /> Tekrar dene
            </div>
          )}
        </div>
      )}
    </GameShell>
  );
}
