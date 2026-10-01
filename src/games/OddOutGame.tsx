import { useState, useCallback } from 'react';
import { GameShell } from '@/components/HomeScreen';
import { RotateCcw, Trophy, Check, X } from 'lucide-react';

interface Round {
  items: { emoji: string; different: boolean }[];
  hint: string;
}

function generateRound(): Round {
  const allEmojis = ['🍎','🍌','🍇','🍓','🍒','🥝','🍑','🍍','🥥','🥕','🌽','🍅','🫐','🍈','🥭','🍐'];
  const main = allEmojis[Math.floor(Math.random() * allEmojis.length)];
  let diff = allEmojis[Math.floor(Math.random() * allEmojis.length)];
  while (diff === main) diff = allEmojis[Math.floor(Math.random() * allEmojis.length)];

  const items = Array(9).fill(0).map(() => ({ emoji: main, different: false }));
  const oddIdx = Math.floor(Math.random() * 9);
  items[oddIdx] = { emoji: diff, different: true };

  return { items, hint: 'Farklı olanı bul!' };
}

export function OddOutGame({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState<Round>(() => generateRound());
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const next = useCallback(() => {
    setRound(generateRound());
    setPicked(null);
    setResult(null);
  }, []);

  const handlePick = (idx: number) => {
    if (result) return;
    setPicked(idx);
    if (round.items[idx].different) {
      setResult('correct');
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setTimeout(next, 1200);
    } else {
      setResult('wrong');
      setStreak(0);
      setTimeout(next, 1200);
    }
  };

  const reset = () => {
    setScore(0);
    setStreak(0);
    next();
  };

  return (
    <GameShell title="Farklı Olanı Bul" onBack={onBack}>
      <div className="flex items-center justify-between mb-5 px-2">
        <span className="text-slate-600 font-bold">Skor: {score}</span>
        <span className="text-pink-600 font-bold">Üst üste: {streak} 🔥</span>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-800 transition-colors"
        >
          <RotateCcw size={18} /> Sıfırla
        </button>
      </div>

      <p className="text-center text-slate-500 font-bold mb-4">{round.hint}</p>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {round.items.map((item, i) => {
          const isPicked = picked === i;
          const isCorrect = result === 'correct' && isPicked;
          const isWrong = result === 'wrong' && isPicked;
          const showAnswer = result && item.different;
          return (
            <button
              key={i}
              onClick={() => handlePick(i)}
              disabled={!!result}
              className={`aspect-square rounded-2xl text-5xl flex items-center justify-center shadow-md transition-all duration-300 ${
                isCorrect
                  ? 'bg-green-300 scale-110 animate-pop'
                  : isWrong
                  ? 'bg-red-300 animate-shake'
                  : showAnswer
                  ? 'bg-amber-200 ring-2 ring-amber-400'
                  : 'bg-white hover:bg-pink-50 hover:scale-105'
              }`}
            >
              {item.emoji}
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
              <X size={24} /> Yanlış!
            </div>
          )}
        </div>
      )}
    </GameShell>
  );
}
