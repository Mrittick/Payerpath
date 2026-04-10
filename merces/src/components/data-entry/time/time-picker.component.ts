import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { TimeFieldComponent } from './time-field.component';
import { StringfieldMessageComponent } from '../stringfield-plain/stringfield-plain-message/stringfield-plain-message.component';
import type { TimeFormat, TimeFieldValidationState } from './time-field.types';

@Component({
  selector: 'merces-time-picker',
  standalone: true,
  imports: [TimeFieldComponent, StringfieldMessageComponent],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.tp--vertical]':   'layout() === "vertical"',
    '[class.tp--horizontal]': 'layout() === "horizontal"',
    '[class.tp--span]':       'padding() === "span"',
    '[class.tp--disabled]':   'disabled()',
  },
})
export class TimePickerComponent {
  /** Selected time in "HH:MM" 24hr format, or null. */
  readonly value = model<string | null>(null);

  readonly format          = input<TimeFormat>('24hr');
  readonly label           = input<string>('Time');
  readonly layout          = input<'vertical' | 'horizontal'>('vertical');
  readonly padding         = input<'default' | 'span'>('default');
  readonly validationState = input<TimeFieldValidationState>('valid');
  readonly disabled        = input<boolean>(false);
  readonly message         = input<string>('');

  readonly showMessage = computed(() =>
    (this.validationState() === 'warning' || this.validationState() === 'error') &&
    this.message().length > 0,
  );
}
