import {
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-temperature',
  imports: [],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.css',
})
export class TemperatureComponent {
  public readonly temperatures = input.required<number[]>();
  public readonly currentTemperature = computed(() => {
    return this.temperatures()[new Date().getUTCHours()];
  });
}
