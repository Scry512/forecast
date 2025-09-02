import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import {
  HoursData,
  DayData,
  WeekData,
  WeatherAPIResponse,
  FullWeatherAPIResponse,
} from '../models/weather.model';
import WMOCodes from '../data/descriptions.json';
import { WMOCodesObject } from '../models/wmo.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseWeatherUrl = signal<string>(
    'https://api.open-meteo.com/v1/forecast'
  );
  private readonly wmoCodes: WMOCodesObject = WMOCodes;

  public location = signal<{ latitude: number; longitude: number }>({
    latitude: 40.73061,
    longitude: -73.935242,
  });

  private fetchWeatherData(
    params: any
  ): Observable<FullWeatherAPIResponse | never[]> {
    // No sé que es ese never[], se me queja TS si no lo pongo xd
    return this.httpClient
      .get<FullWeatherAPIResponse>(this.baseWeatherUrl(), {
        params: new HttpParams({ fromObject: params }),
      })
      .pipe(
        catchError(() => of([])) //Para manejar errores.
      );
  }

  private readonly fullWeatherResponse$: Observable<WeatherAPIResponse> =
    this.fetchWeatherData({
      latitude: this.location().latitude,
      longitude: this.location().longitude,
      timezone: 'UTC',
      daily: [
        'temperature_2m_min',
        'temperature_2m_max',
        'weather_code',
        'sunrise',
        'sunset',
      ],
      hourly: ['temperature', 'weather_code'],
    }).pipe(tap(console.log), shareReplay(1));

  public fetchWeeklyData(): Observable<WeekData> {
    return this.fullWeatherResponse$.pipe(
      map((resp: WeatherAPIResponse) => {
        const {
          temperature_2m_min,
          temperature_2m_max,
          time,
          weather_code,
          sunrise,
          sunset,
        } = resp.daily;

        return {
          minArray: temperature_2m_min,
          maxArray: temperature_2m_max,
          weekArray: time,
          weatherCodeArray: weather_code,
          sunriseArray: sunrise,
          sunsetArray: sunset,
        } as WeekData;
      })
    );
  }

  public fetchDailyData(): Observable<DayData> {
    return this.fullWeatherResponse$.pipe(
      map((resp: WeatherAPIResponse) => {
        const {
          temperature_2m_min,
          temperature_2m_max,
          time,
          weather_code,
          sunrise,
          sunset,
        } = resp.daily;

        return {
          min: temperature_2m_min[0],
          max: temperature_2m_max[0],
          day: time[0],
          weatherCode: weather_code[0],
          sunrise: sunrise[0],
          sunset: sunset[0],
        } as DayData;
      })
    );
  }

  public fetchHourlyData(): Observable<HoursData> {
    return this.fullWeatherResponse$.pipe(
      map((resp: WeatherAPIResponse) => {
        const { temperature, time, weather_code } = resp.hourly;

        return {
          temperature: temperature.slice(0, 24),
          time: time.slice(0, 24),
          weatherCode: weather_code.slice(0, 24),
        } as HoursData;
      })
    );
  }

  public fetchWeekSunriseAndSunset(): Observable<{
    sunriseArray: string[];
    sunsetArray: string[];
  }> {
    return this.fullWeatherResponse$.pipe(
      map((resp: WeatherAPIResponse) => {
        const { sunrise, sunset } = resp.daily;

        return { sunriseArray: sunrise, sunsetArray: sunset } as {
          sunriseArray: string[];
          sunsetArray: string[];
        };
      })
    );
  }

  public fetchTodaySunriseAndSunset(): Observable<{
    sunrise: string;
    sunset: string;
  }> {
    return this.fullWeatherResponse$.pipe(
      map((resp: WeatherAPIResponse) => {
        const sunrise = resp.daily.sunrise[0];
        const sunset = resp.daily.sunset[0];

        return { sunrise, sunset } as { sunrise: string; sunset: string };
      })
    );
  }

  public fetchWMOImage(wmoCode: string): Observable<string> {
    return this.fetchTodaySunriseAndSunset().pipe(
      map(({ sunrise, sunset }) => {
        const now = Date.now();
        const sunriseTime = new Date(sunrise).getTime();
        const sunsetTime = new Date(sunset).getTime();
        const isDay = sunriseTime < now && now < sunsetTime;

        return this.wmoCodes[wmoCode][isDay ? 'day' : 'night'].image;
      })
    );
  }

  public fetchWMODescription(wmoCode: string): string {
    return this.wmoCodes[wmoCode].night.description;
  }
}
