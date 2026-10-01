import { useState } from 'react';
import { GameShell } from '@/components/HomeScreen';
import { Eraser } from 'lucide-react';

const palette = [
  '#ef4444', '#f97316', '#eab308', '#84cc16',
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6',
  '#ec4899', '#f43f5e', '#78716c', '#000000',
];


const drawings: Record<string, string[]> = {
  Ev: ['M50 80 L50 50 L75 30 L100 50 L100 80 Z', 'M50 50 L75 30 L100 50', 'M60 80 L60 60 L85 60 L85 80'],
  Ağaç: ['M75 85 L75 50', 'M75 50 L50 35 L100 35 Z', 'M60 40 L75 20 L90 40 Z', 'M65 30 L75 15 L85 30 Z'],
  Balık: ['M30 50 Q50 30 80 50 Q50 70 30 50 Z', 'M80 50 L100 35 L100 65 Z', 'M45 45 L47 47', 'M45 55 L47 53'],
  Güneş: ['M75 50 m-25 0 a25 25 0 1 0 50 0 a25 25 0 1 0 -50 0', 'M75 10 L75 20', 'M75 80 L75 90', 'M35 50 L25 50', 'M125 50 L115 50'],
  Yıldız: ['M75 20 L85 50 L115 50 L90 65 L100 95 L75 75 L50 95 L60 65 L35 50 L65 50 Z'],
  Araba: ['M20 70 L30 50 L100 50 L110 70 L110 80 L20 80 Z', 'M40 80 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0', 'M90 80 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0'],
};

const drawingNames = Object.keys(drawings);

export function ColoringGame({ onBack }: { onBack: () => void }) {
  const [selectedDrawing, setSelectedDrawing] = useState('Ev');
  const [color, setColor] = useState('#ef4444');
  const [filled, setFilled] = useState<Record<number, string>>({});
  const paths = drawings[selectedDrawing];
  const allFilled = paths.length > 0 && paths.every((_, i) => filled[i]);

  const reset = () => setFilled({});

  return (
    <GameShell title="Boyama" onBack={onBack}>
      {/* Drawing selector */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {drawingNames.map((name) => (
          <button
            key={name}
            onClick={() => { setSelectedDrawing(name); setFilled({}); }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              selectedDrawing === name
                ? 'bg-purple-500 text-white shadow-lg scale-105'
                : 'bg-white text-slate-600 shadow-md hover:scale-105'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="flex justify-center mb-4">
        <div className="relative bg-white rounded-2xl shadow-xl p-4">
          <svg viewBox="0 0 150 100" className="w-72 h-48 sm:w-96 sm:h-64">
            {paths.map((d, i) => (
              <path
                key={i}
                d={d}
                fill={filled[i] ?? '#ffffff'}
                stroke="#334155"
                strokeWidth={2}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setFilled((prev) => ({ ...prev, [i]: color }))}
              />
            ))}
          </svg>
          {allFilled && (
            <div className="absolute top-2 right-2 bg-green-100 text-green-700 font-bold text-xs px-3 py-1 rounded-full animate-pop">
              Tamamlandı!
            </div>
          )}
        </div>
      </div>

      {/* Color palette */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {palette.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className="w-9 h-9 rounded-full shadow-md transition-transform hover:scale-125"
            style={{
              backgroundColor: c,
              border: color === c ? '3px solid #1e293b' : '2px solid white',
              transform: color === c ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors"
        >
          <Eraser size={18} /> Temizle
        </button>
      </div>
    </GameShell>
  );
}
