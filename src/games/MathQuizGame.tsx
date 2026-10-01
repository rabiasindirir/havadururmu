import { useState, useCallback, useEffect } from 'react';
import { GameShell } from '@/components/HomeScreen';
import { RotateCcw, Trophy, Check, X, Timer } from 'lucide-react';

interface Question {
  a: number;
  b: number;
  op: '+' | '-' | '×' | '÷';
  answer: number;
  choices: number[];
}

function generateQuestion(): Question {
  const ops: ('+' | '-' | '×' | '÷')[] = ['+', '-', '×', '÷'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;

  if (op === '+') {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    answer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * 25) + 5;
    b = Math.floor(Math.random() * a);
    answer = a - b;
  } else if (op === '×') {
    a = Math.floor(Math.random() * 9) + 1;
    b = Math.floor(Math.random() * 9) + 1;
    answer = a * b;
  } else {
    b = Math.floor(Math.random() * 9) + 1;
    answer = Math.floor(Math.random() * 9) + 1;
    a = b * answer;
  }

  const choices = new Set<number>([answer]);
  while (choices.size < 4) {
    const delta = Math.floor(Math.random() * 10) - 5;
    if (delta !== 0 && answer + delta > 0) choices.add(answer + delta);
  }
  return { a, b, op, answer, choices: [...choices].sort(() => Math.random() - 0.5) };
}

export function MathQuizGame({ onBack }: { onBack: () => void }) {
  const [question, setQuestion] = useState<Question>(() => generateQuestion());
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  const next = useCallback(() => {
    setQuestion(generateQuestion());
    setPicked(null);
    setResult(null);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  const handlePick = (val: number) => {
    if (result || gameOver) return;
    setPicked(val);
    if (val === question.answer) {
      setResult('correct');
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setTimeout(next, 800);
    } else {
      setResult('wrong');
      setStreak(0);
      setTimeout(next, 1200);
    }
  };

  const reset = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setGameOver(false);
    next();
  };

  return (
    <GameShell title="Matematik Bulmaca" onBack={onBack}>
      {gameOver && (
        <div className="mb-4 rounded-2xl bg-amber-100 border-2 border-amber-300 p-4 flex items-center gap-3 animate-pop">
          <Trophy className="text-amber-600" size={28} />
          <p className="text-amber-700 font-bold text-lg">Süre bitti! Skorun: {score}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-5 px-2">
        <span className="text-slate-600 font-bold">Skor: {score}</span>
        <span className="text-orange-500 font-bold flex items-center gap-1">
          {streak > 1 && `🔥 ${streak}`}
        </span>
        <span className={`flex items-center gap-1 font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-600'}`}>
          <Timer size={18} /> {timeLeft}s
        </span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-5 text-center">
        <div className="text-5xl font-bold text-slate-800 font-display">
          {question.a} {question.op} {question.b} = ?
        </div>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {question.choices.map((c) => {
          const isPicked = picked === c;
          const isCorrect = result === 'correct' && isPicked;
          const isWrong = result === 'wrong' && isPicked;
          const showAnswer = result && c === question.answer;
          return (
            <button
              key={c}
              onClick={() => handlePick(c)}
              disabled={!!result || gameOver}
              className={`h-16 rounded-2xl text-2xl font-bold shadow-md transition-all hover:scale-105 ${
                isCorrect
                  ? 'bg-green-400 text-white animate-pop'
                  : isWrong
                  ? 'bg-red-400 text-white animate-shake'
                  : showAnswer
                  ? 'bg-green-200 text-green-700'
                  : 'bg-white text-slate-700 hover:bg-orange-50'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {result && !gameOver && (
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

      {gameOver && (
        <div className="flex justify-center mt-5">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            <RotateCcw size={18} /> Tekrar Oyna
          </button>
        </div>
      )}
    </GameShell>
  );
}
