import {
  Component,
  ChangeDetectionStrategy,
  computed,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';

@Component({
  selector: 'merces-date-display',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './date-display.component.html',
  styleUrl: './date-display.component.css',
})
export class DateDisplayComponent {
  private readonly _destroyRef = inject(DestroyRef);

  protected readonly _today  = signal(new Date());

  protected readonly _label = computed(() =>
    this._today().toLocaleDateString('en-US', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric',
    })
  );

  constructor() {
    this._scheduleMidnightRefresh();
  }

  private _scheduleMidnightRefresh(): void {
    const now      = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const ms       = tomorrow.getTime() - now.getTime();

    const id = setTimeout(() => {
      this._today.set(new Date());
      this._scheduleMidnightRefresh();
    }, ms);

    this._destroyRef.onDestroy(() => clearTimeout(id));
  }
}
