import {
  Sun, Cloud, CloudSun, CloudRain, CloudLightning, CloudSnow, CloudFog,
} from 'lucide-react';
import type { WeatherCondition } from '@/types';

export function WeatherIcon({
  condition,
  size = 24,
  className = '',
}: {
  condition: WeatherCondition;
  size?: number;
  className?: string;
}) {
  const props = { size, className, strokeWidth: 1.8 };
  switch (condition) {
    case 'sunny': return <Sun {...props} />;
    case 'partly-cloudy': return <CloudSun {...props} />;
    case 'cloudy': return <Cloud {...props} />;
    case 'rainy': return <CloudRain {...props} />;
    case 'stormy': return <CloudLightning {...props} />;
    case 'snowy': return <CloudSnow {...props} />;
    case 'foggy': return <CloudFog {...props} />;
  }
}
