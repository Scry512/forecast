export interface HoursData {
  temperature: number[];
  time: string[];
  weatherCode: number[];
}

export interface DayData {
  min: number;
  max: number;
  day: string;
  weatherCode: number;
  sunrise: string;
  sunset: string;
  image: string;
  description: string;
}

export interface WeekData extends Array<DayData> {}

export interface WeatherAPIResponse {
  daily: {
    sunrise: string[];
    sunset: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    time: string[];
    weather_code: number[];
  };
  hourly: {
    temperature: number[];
    time: string[];
    weather_code: number[];
  };
  latitude: number;
  longitude: number;
}

export interface FullWeatherAPIResponse extends WeatherAPIResponse {
  daily_units: {
    sunrise: string;
    sunset: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    time: string;
    weather_code: string;
  };
  hourly_units: {
    temperature: string;
    time: string;
    weather_code: string;
  };
  elevation: number;
  generationtime_ms: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}
