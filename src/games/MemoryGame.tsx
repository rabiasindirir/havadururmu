import { useState, useEffect, useCallback } from 'react';
import { GameShell } from '@/components/HomeScreen';
import { RotateCcw, Trophy } from 'lucide-react';

const emojis = ['🐶','🐱','🦊','🐼','🦁','🐸','🐵','🐰'];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function generateDeck(): Card[] {
  const pairs = [...emojis, ...emojis];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
}

export function MemoryGame({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<Card[]>(() => generateDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const handleClick = useCallback((id: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );
    setFlipped((prev) => [...prev, id]);
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = flipped;
      const cardA = cards.find((c) => c.id === a);
      const cardB = cards.find((c) => c.id === b);
      if (cardA?.emoji === cardB?.emoji) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === a || c.id === b ? { ...c, matched: true } : c
            )
          );
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === a || c.id === b ? { ...c, flipped: false } : c
            )
          );
          setFlipped([]);
        }, 900);
      }
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setWon(true);
    }
  }, [cards]);

  const reset = () => {
    setCards(generateDeck());
    setFlipped([]);
    setMoves(0);
    setWon(false);
  };

  return (
    <GameShell title="Hafıza Kartları" onBack={onBack}>
      {won && (
        <div className="mb-4 rounded-2xl bg-green-100 border-2 border-green-300 p-4 flex items-center gap-3 animate-pop">
          <Trophy className="text-green-600" size={28} />
          <p className="text-green-700 font-bold text-lg">Harika! {moves} hamlede bitirdin!</p>
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

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => !card.flipped && !card.matched && flipped.length < 2 && handleClick(card.id)}
            className="aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all duration-300 shadow-md"
            style={{
              background: card.matched
                ? 'linear-gradient(135deg, #86efac, #4ade80)'
                : card.flipped
                ? 'linear-gradient(135deg, #fef3c7, #fde68a)'
                : 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
              transform: card.flipped || card.matched ? 'scale(1)' : 'scale(1)',
              opacity: card.matched ? 0.6 : 1,
            }}
          >
            {card.flipped || card.matched ? card.emoji : '❓'}
          </button>
        ))}
      </div>
    </GameShell>
  );
}
