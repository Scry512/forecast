import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrentLocationComponent } from './components/current-location/current-location.component';
import { TemperatureComponent } from './components/temperature/temperature.component';
import { PredictionsComponent } from './components/predictions/predictions.component';
import { WeatherService } from './services/weather.service';
import { HoursData, WeekData } from './models/weather.model';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
export class AppComponent {
  private readonly weatherService = inject(WeatherService);

  public readonly hoursData = toSignal<HoursData>(
    this.weatherService.fetchHourlyData$()
  );

  public readonly weekData = toSignal<WeekData>(
    this.weatherService.fetchWeeklyData$()
  );
}
