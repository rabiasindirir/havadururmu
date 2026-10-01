import type { DayForecast } from '@/types';
import { WeatherAnimation } from '@/components/WeatherAnimation';
import { WeatherIcon } from '@/components/WeatherIcon';
import {
  Droplets, Wind, Eye, Sun, Gauge, Sunrise, Sunset, Thermometer,
  ArrowUp, ArrowDown, Clock,
} from 'lucide-react';

interface Props {
  day: DayForecast;
}

function MetricCard({
  icon, label, value, unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 ring-1 ring-white/15 hover:bg-white/15 transition-colors duration-200">
      <div className="flex items-center gap-2 text-white/60 mb-2">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-white text-xl font-semibold">
        {value}
        {unit && <span className="text-white/50 text-sm ml-1">{unit}</span>}
      </div>
    </div>
  );
}

export function DayDetail({ day }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/20 shadow-2xl">
      {/* Animated weather background */}
      <div className="absolute inset-0">
        <WeatherAnimation condition={day.condition} />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <WeatherIcon condition={day.condition} size={48} className="text-white" />
              <div>
                <h2 className="text-white text-3xl font-bold">{day.dayName}</h2>
                <p className="text-white/60 text-sm">{day.date}</p>
              </div>
            </div>
            <p className="text-white/80 text-lg mt-2">{day.conditionLabel}</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-white text-6xl font-bold leading-none">{day.temp}°</div>
            <p className="text-white/60 text-sm mt-1">Hissedilen {day.feelsLike}°</p>
          </div>
        </div>

        {/* High/Low bar */}
        <div className="flex items-center gap-4 mb-6 bg-white/10 backdrop-blur-md rounded-xl p-4 ring-1 ring-white/15">
          <div className="flex items-center gap-2">
            <ArrowUp size={18} className="text-orange-300" />
            <span className="text-white/70 text-sm">En Yüksek</span>
            <span className="text-white font-bold text-lg">{day.high}°</span>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <ArrowDown size={18} className="text-blue-300" />
            <span className="text-white/70 text-sm">En Düşük</span>
            <span className="text-white font-bold text-lg">{day.low}°</span>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          <MetricCard icon={<Droplets size={16} />} label="Nem" value={day.humidity} unit="%" />
          <MetricCard icon={<Wind size={16} />} label="Rüzgar" value={`${day.windSpeed} km/s`} />
          <MetricCard icon={<Wind size={16} />} label="Rüzgar Yönü" value={day.windDirection} />
          <MetricCard icon={<Gauge size={16} />} label="Basınç" value={day.pressure} unit="hPa" />
          <MetricCard icon={<Eye size={16} />} label="Görüş" value={day.visibility} unit="km" />
          <MetricCard icon={<Sun size={16} />} label="UV Indeksi" value={day.uvIndex} />
          <MetricCard icon={<Sunrise size={16} />} label="Gün Doğumu" value={day.sunrise} />
          <MetricCard icon={<Sunset size={16} />} label="Gün Batımı" value={day.sunset} />
        </div>

        {/* Hourly forecast */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 ring-1 ring-white/15">
          <div className="flex items-center gap-2 text-white/70 mb-4">
            <Clock size={16} />
            <span className="text-sm font-medium">Saatlik Tahmin</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {day.hourly.map((h, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors duration-200"
              >
                <span className="text-white/50 text-xs">{h.hour}</span>
                <WeatherIcon condition={h.condition} size={22} className="text-white/80" />
                <span className="text-white font-semibold text-sm">{h.temp}°</span>
                {h.precipitation > 0 && (
                  <span className="text-blue-200 text-xs">{h.precipitation}%</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Temperature detail */}
        <div className="mt-4 flex items-center gap-2 text-white/50 text-sm">
          <Thermometer size={16} />
          <span>
            Sıcaklık {day.low}° ile {day.high}° arasında değişecek
          </span>
        </div>
      </div>
    </div>
  );
}
