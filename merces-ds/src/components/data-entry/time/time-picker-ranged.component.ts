import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { TimeFieldComponent } from './time-field.component';
import type { TimeFormat, TimeFieldValidationState } from './time-field.types';

@Component({
  selector: 'merces-time-picker-ranged',
  standalone: true,
  imports: [TimeFieldComponent],
  templateUrl: './time-picker-ranged.component.html',
  styleUrl: './time-picker-ranged.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.tpr--vertical]':   'layout() === "vertical"',
    '[class.tpr--horizontal]': 'layout() === "horizontal"',
    '[class.tpr--span]':       'padding() === "span"',
    '[class.tpr--disabled]':   'disabled()',
  },
})
export class TimePickerRangedComponent {
  /** Start time in "HH:MM" 24hr format, or null. */
  readonly startValue = model<string | null>(null);
  /** End time in "HH:MM" 24hr format, or null. */
  readonly endValue   = model<string | null>(null);

  readonly format          = input<TimeFormat>('24hr');
  readonly label           = input<string>('Time Range');
  readonly layout          = input<'vertical' | 'horizontal'>('vertical');
  readonly padding         = input<'default' | 'span'>('default');
  readonly validationState = input<TimeFieldValidationState>('valid');
  readonly disabled        = input<boolean>(false);
}
