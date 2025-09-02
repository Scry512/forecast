import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrentLocationComponent } from './components/current-location/current-location.component';
import { TemperatureComponent } from './components/temperature/temperature.component';
import { PredictionsComponent } from './components/predictions/predictions.component';
import { WeatherService } from './services/weather.service';
import { Subscription } from 'rxjs';
import { HoursData, WeekData } from './models/weather.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    CurrentLocationComponent,
    TemperatureComponent,
    PredictionsComponent,
  ],
})
export class AppComponent implements OnInit {
  private readonly weatherService = inject(WeatherService);
  private readonly destroyRef = inject(DestroyRef);
  public hoursData = signal<HoursData | undefined>(undefined);
  public weekData = signal<WeekData | undefined>(undefined);

  ngOnInit(): void {
    const week: Subscription = this.weatherService.fetchWeeklyData().subscribe({
      next: (weekData: WeekData) => {
        this.weekData.set({ ...weekData });
      },
    });

    const day: Subscription = this.weatherService.fetchDailyData().subscribe({
      next: (dailyData) => {},
    });

    const hour: Subscription = this.weatherService.fetchHourlyData().subscribe({
      next: (hoursData: HoursData) => this.hoursData.set({ ...hoursData }),
    });

    this.destroyRef.onDestroy(() => {
      week.unsubscribe();
      day.unsubscribe();
      hour.unsubscribe();
    });
  }
}
