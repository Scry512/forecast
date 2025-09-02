import { Component, input, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-predictions',
  imports: [DatePipe, AsyncPipe],
  templateUrl: './predictions.component.html',
  styleUrl: './predictions.component.css',
})
export class PredictionsComponent {
  public weatherService = inject(WeatherService);
  public predictions = input.required<any>();
  public formatedPredictions = computed(() => {
    if (!this.predictions()) return;

    const { minArray, maxArray, weekArray, weatherCodeArray } = this.predictions();
    const predictionsAsArray = [];

    for (let i = 0; i < 7; i++) {
      predictionsAsArray.push({
        min: minArray[i],
        max: maxArray[i],
        date: weekArray[i],
        src: weatherCodeArray[i],
        alt: this.weatherService.fetchWMODescription(weatherCodeArray[i]),
      });
    }
    return predictionsAsArray;
  });
}
