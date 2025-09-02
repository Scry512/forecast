import {
  ChangeDetectionStrategy,
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
  public temperatures = input.required<number[]>();
  public dates = input.required<string[]>();
  public currentTemperature = computed(() => {
    const dates = this.dates();
    const temps = this.temperatures();
    if (!dates || !temps) return;
    const currentHour = new Date().getUTCHours();
    return temps[currentHour];
  });
}
