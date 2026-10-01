import { useState } from 'react';
import { weekForecast } from '@/weatherData';
import { ForecastCard } from '@/components/ForecastCard';
import { DayDetail } from '@/components/DayDetail';
import { CloudSun } from 'lucide-react';

function App() {
  const [selectedDay, setSelectedDay] = useState(weekForecast[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <CloudSun size={36} className="text-cyan-300" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Haftalık Hava Durumu
            </h1>
          </div>
          <p className="text-white/50 text-sm sm:text-base">
            1-7 Ekim 2026 · Bir güne tıklayın, o günün hava durumu simülasyonu açılsın
          </p>
        </header>

        {/* 7-day forecast cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 mb-8">
          {weekForecast.map((day) => (
            <ForecastCard
              key={day.id}
              day={day}
              isActive={selectedDay.id === day.id}
              onClick={() => setSelectedDay(day)}
            />
          ))}
        </div>

        {/* Selected day detail with animation */}
        <DayDetail day={selectedDay} />

        {/* Footer */}
        <footer className="mt-10 text-center text-white/30 text-xs">
          Hava durumu bilgileri gösterim amaçlıdır
        </footer>
      </div>
    </div>
  );
}

export default App;
