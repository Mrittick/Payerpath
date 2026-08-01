import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { IconComponent } from '../../../assets/icon/icon.component';
import { TimeSelectionDropdownComponent } from '../../inputs-and-interactive/time/time-selection-dropdown.component';
import type { TimeFormat, TimeFieldValidationState } from './time-field.types';

@Component({
  selector: 'merces-time-field',
  standalone: true,
  imports: [IconComponent, TimeSelectionDropdownComponent],
  templateUrl: './time-field.component.html',
  styleUrl: './time-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.tfd--empty]':    'isEmpty()',
    '[class.tfd--filled]':   '!isEmpty()',
    '[class.tfd--open]':     '_open()',
    '[class.tfd--disabled]': 'disabled()',
    '[class.tfd--warning]':  'validationState() === "warning"',
    '[class.tfd--error]':    'validationState() === "error"',
  },
})
export class TimeFieldComponent {
  /** Selected time in "HH:MM" 24hr format, or null when empty. */
  readonly value = model<string | null>(null);

  readonly format          = input<TimeFormat>('24hr');
  readonly validationState = input<TimeFieldValidationState>('valid');
  readonly disabled        = input<boolean>(false);
  /** Accessible label for the trigger button. */
  readonly label           = input<string>('Time picker');

  readonly opened  = output<void>();
  readonly closed  = output<void>();

  private readonly _el         = inject(ElementRef<HTMLElement>);
  private readonly _dropdownRef = viewChild(TimeSelectionDropdownComponent);

  readonly _open  = signal(false);
  readonly isEmpty = computed(() => this.value() === null);

  /** Formatted string shown in the trigger field. */
  readonly displayText = computed(() => {
    const v = this.value();
    if (!v) return this.format() === '12hr' ? 'hh : mm tt' : 'HH : MM';
    return this._formatValue(v);
  });

  private _formatValue(value: string): string {
    const [hoursStr, minutesStr] = value.split(':');
    const hours = parseInt(hoursStr, 10);
    const paddedMin = minutesStr.padStart(2, '0');

    if (this.format() === '24hr') {
      return `${String(hours).padStart(2, '0')} : ${paddedMin}`;
    }

    const meridian = hours < 12 ? 'am' : 'pm';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHour} : ${paddedMin} ${meridian}`;
  }

  onFrameClick(): void {
    if (this.disabled()) return;
    if (this._open()) {
      this._open.set(false);
      this.closed.emit();
    } else {
      this._open.set(true);
      this._dropdownRef()?.scrollToSelected();
      this.opened.emit();
    }
  }

  onKeydownActivate(event: Event): void {
    if (this.disabled()) return;
    event.preventDefault();
    if (!this._open()) {
      this._open.set(true);
      this._dropdownRef()?.scrollToSelected();
      this.opened.emit();
    } else {
      this._open.set(false);
      this.closed.emit();
    }
  }

  onEscape(): void {
    if (this._open()) {
      this._open.set(false);
      this.closed.emit();
    }
  }

  onTimeSelected(timeValue: string): void {
    this.value.set(timeValue);
    this._open.set(false);
    this.closed.emit();
  }

  /** Close when clicking outside the component. */
  @HostListener('document:pointerdown', ['$event.target'])
  onDocumentPointerDown(target: HTMLElement): void {
    if (this._open() && !this._el.nativeElement.contains(target)) {
      this._open.set(false);
      this.closed.emit();
    }
  }
}
