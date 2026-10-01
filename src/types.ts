export type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'foggy';

export interface DayForecast {
  id: string;
  dayName: string;
  date: string;
  condition: WeatherCondition;
  conditionLabel: string;
  high: number;
  low: number;
  temp: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  sunrise: string;
  sunset: string;
  feelsLike: number;
  hourly: HourlyForecast[];
}

export interface HourlyForecast {
  hour: string;
  temp: number;
  condition: WeatherCondition;
  precipitation: number;
}
