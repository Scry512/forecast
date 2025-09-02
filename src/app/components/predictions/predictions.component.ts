import { Component, input, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { WeekData } from '../../models/weather.model';

@Component({
  selector: 'app-predictions',
  imports: [DatePipe],
  templateUrl: './predictions.component.html',
  styleUrl: './predictions.component.css',
})
export class PredictionsComponent {
  public readonly predictions = input.required<WeekData>();
}
