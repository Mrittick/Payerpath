import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { IconComponent } from '../../../assets/icon/icon.component';
import type { TimeEntry, TimeFormat } from './time-selection-dropdown.types';

@Component({
  selector: 'merces-time-selection-dropdown',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './time-selection-dropdown.component.html',
  styleUrl: './time-selection-dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSelectionDropdownComponent {
  readonly format = input<TimeFormat>('24hr');
  /** Currently selected time in "HH:MM" 24hr format, or null. */
  readonly value = input<string | null>(null);
  /** Set of "HH:MM" values that should render as disabled. */
  readonly disabledValues = input<string[]>([]);

  readonly timeSelected = output<string>();

  private readonly _el = inject(ElementRef<HTMLElement>);

  /** All 48 time entries (30-min intervals, 00:00–23:30) for the current format. */
  readonly entries = computed<TimeEntry[]>(() => {
    const fmt = this.format();
    const disabledSet = new Set(this.disabledValues());
    const result: TimeEntry[] = [];

    for (let totalMinutes = 0; totalMinutes < 24 * 60; totalMinutes += 30) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      const paddedMin = String(minutes).padStart(2, '0');

      if (fmt === '24hr') {
        result.push({
          value,
          label: value,
          meridian: null,
          disabled: disabledSet.has(value),
        });
      } else {
        const meridian: 'am' | 'pm' = hours < 12 ? 'am' : 'pm';
        const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        result.push({
          value,
          label: `${displayHour}:${paddedMin}`,
          meridian,
          disabled: disabledSet.has(value),
        });
      }
    }

    return result;
  });

  onRowClick(entry: TimeEntry): void {
    if (entry.disabled) return;
    this.timeSelected.emit(entry.value);
  }

  /** Called by the parent field when the panel opens — scrolls to the selected row. */
  scrollToSelected(): void {
    requestAnimationFrame(() => {
      const el = this._el.nativeElement.querySelector('.time-row--current') as HTMLElement | null;
      el?.scrollIntoView({ block: 'nearest' });
    });
  }
}
