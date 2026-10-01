import { games } from '@/games/registry';
import type { GameId } from '@/games/registry';
import * as Icons from 'lucide-react';
import { Brain, ArrowLeft } from 'lucide-react';

interface Props {
  onSelectGame: (id: GameId) => void;
}

export function HomeScreen({ onSelectGame }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100">
      {/* Decorative floating shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-yellow-300/30 animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-pink-300/30 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-24 h-24 rounded-full bg-cyan-300/30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-14 h-14 rounded-full bg-green-300/30 animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-10 sm:py-14">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg animate-float">
              <Brain size={36} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-800 mb-2">
            Beyin Oyunları
          </h1>
          <p className="text-lg text-slate-500 font-semibold">
            10 eğlenceli zeka oyunu seni bekliyor!
          </p>
        </div>

        {/* Game grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {games.map((game, i) => {
            const Icon = (Icons as any)[game.icon] ?? Icons.Circle;
            return (
              <button
                key={game.id}
                onClick={() => onSelectGame(game.id)}
                className="group relative overflow-hidden rounded-3xl p-5 text-left transition-all duration-300 hover:scale-105 hover:-rotate-1 shadow-lg hover:shadow-2xl animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient}`} />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                <div className="relative z-10 flex flex-col items-center text-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon size={28} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-white font-display font-bold text-base leading-tight mt-1">
                    {game.title}
                  </h3>
                  <p className="text-white/80 text-xs font-semibold">
                    {game.description}
                  </p>
                  <span className="text-2xl mt-1">{game.emoji}</span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-slate-400 text-sm mt-10 font-semibold">
          Bir oyun seç ve oynamaya başla!
        </p>
      </div>
    </div>
  );
}

export function GameShell({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h2 className="text-2xl font-display font-bold text-slate-800">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}
