import type { DayForecast } from '@/types';
import { WeatherIcon } from '@/components/WeatherIcon';

interface Props {
  day: DayForecast;
  isActive: boolean;
  onClick: () => void;
}

export function ForecastCard({ day, isActive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 group ${
        isActive
          ? 'ring-2 ring-white/80 scale-[1.03] shadow-2xl'
          : 'ring-1 ring-white/20 hover:ring-white/40 hover:scale-[1.02] hover:shadow-xl'
      } bg-white/10 backdrop-blur-md`}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-white/90 font-semibold text-sm tracking-wide">
          {day.dayName}
        </span>
        <span className="text-white/50 text-xs">{day.date}</span>
        <div className="my-1 transition-transform duration-300 group-hover:scale-110">
          <WeatherIcon condition={day.condition} size={40} className="text-white" />
        </div>
        <span className="text-white/70 text-xs">{day.conditionLabel}</span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-white text-2xl font-bold">{day.high}°</span>
          <span className="text-white/50 text-sm">{day.low}°</span>
        </div>
        <div className="flex items-center gap-1 text-white/40 text-xs">
          <span>{day.precipitation}% yağış</span>
        </div>
      </div>
    </button>
  );
}
