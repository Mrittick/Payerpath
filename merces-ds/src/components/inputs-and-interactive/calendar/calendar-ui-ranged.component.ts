import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import { CtaButtonComponent } from '../cta-button/cta-button.component';
import {
  CalendarCell,
  CalendarLevel,
  MonthCell,
  YearCell,
  WEEKDAY_LABELS,
  MONTH_LABELS,
} from './calendar-ui.types';

@Component({
  selector: 'merces-calendar-ui-ranged',
  templateUrl: './calendar-ui-ranged.component.html',
  styleUrl: './calendar-ui-ranged.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CtaButtonComponent],
  host: {
    '[class.cal--range-incomplete]': 'rangeStart() !== null && rangeEnd() === null',
  },
})
export class CalendarUiRangedComponent {
  /** Two-way bound range — null on either means the range is incomplete. */
  rangeStart = model<Date | null>(null);
  rangeEnd   = model<Date | null>(null);

  /** Emitted each time the range changes (after every click). */
  rangeChanged = output<{ start: Date | null; end: Date | null }>();

  readonly weekdays = WEEKDAY_LABELS;

  // ApplicationRef.tick() forces a synchronous CD cycle inside the
  // startViewTransition callback so the browser captures the new DOM state
  // as the "after" snapshot. Without it, Angular's signal CD is async
  // (microtask-scheduled) and the browser sees the same DOM before and after,
  // producing no animation.
  private readonly _appRef = inject(ApplicationRef);

  private readonly _today   = new Date();
  private readonly _todayMs = new Date(
    this._today.getFullYear(),
    this._today.getMonth(),
    this._today.getDate(),
  ).getTime();

  // ── Per-panel level ────────────────────────────────────────────────────────

  _leftLevel  = signal<CalendarLevel>('date');
  _rightLevel = signal<CalendarLevel>('date');

  // ── Per-panel display year/month ───────────────────────────────────────────

  _leftYear  = signal(this._today.getFullYear());
  _leftMonth = signal(this._today.getMonth());

  _rightYear  = signal(
    this._today.getMonth() === 11
      ? this._today.getFullYear() + 1
      : this._today.getFullYear(),
  );
  _rightMonth = signal((this._today.getMonth() + 1) % 12);

  // ── Year page anchors ──────────────────────────────────────────────────────

  _leftYearAnchor  = signal(this._today.getFullYear());
  _rightYearAnchor = signal(
    this._today.getMonth() === 11
      ? this._today.getFullYear() + 1
      : this._today.getFullYear(),
  );

  // ── Header labels — change per level ──────────────────────────────────────

  private _leftMonthLabel = computed(() =>
    new Date(this._leftYear(), this._leftMonth(), 1)
      .toLocaleDateString('en-US', { month: 'long' }),
  );
  private _rightMonthLabel = computed(() =>
    new Date(this._rightYear(), this._rightMonth(), 1)
      .toLocaleDateString('en-US', { month: 'long' }),
  );

  private _leftYearRangeStart  = computed(() => Math.floor(this._leftYearAnchor()  / 20) * 20);
  private _rightYearRangeStart = computed(() => Math.floor(this._rightYearAnchor() / 20) * 20);

  leftYearRangeLabel  = computed(() => { const s = this._leftYearRangeStart();  return `${s} - ${s + 19}`; });
  rightYearRangeLabel = computed(() => { const s = this._rightYearRangeStart(); return `${s} - ${s + 19}`; });

  leftLevelLabel = computed(() => {
    switch (this._leftLevel()) {
      case 'date':  return `${this._leftMonthLabel()} ${this._leftYear()}`;
      case 'month': return `Year ${this._leftYear()}`;
      case 'year':  return this.leftYearRangeLabel();
    }
  });

  rightLevelLabel = computed(() => {
    switch (this._rightLevel()) {
      case 'date':  return `${this._rightMonthLabel()} ${this._rightYear()}`;
      case 'month': return `Year ${this._rightYear()}`;
      case 'year':  return this.rightYearRangeLabel();
    }
  });

  // ── Normalised range timestamps ────────────────────────────────────────────

  _rangeStartMs = computed(() => {
    const s = this.rangeStart();
    return s ? new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime() : null;
  });
  _rangeEndMs = computed(() => {
    const e = this.rangeEnd();
    return e ? new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime() : null;
  });

  // ── Date grids ────────────────────────────────────────────────────────────

  leftGrid  = computed(() => this._buildGrid(this._leftYear(),  this._leftMonth()));
  rightGrid = computed(() => this._buildGrid(this._rightYear(), this._rightMonth()));

  private _buildGrid(year: number, month: number): CalendarCell[] {
    const firstDow    = new Date(year, month, 1).getDay();
    const startOffset = (firstDow + 6) % 7;
    const startMs     = this._rangeStartMs();
    const endMs       = this._rangeEndMs();

    const cells: CalendarCell[] = [];
    for (let i = 0; i < 42; i++) {
      const dayOffset = i - startOffset;
      const date      = new Date(year, month, 1 + dayOffset);
      const normMs    = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

      let rangePosition: CalendarCell['rangePosition'] = 'none';
      if (startMs !== null && endMs !== null) {
        if      (normMs === startMs)                 rangePosition = 'start';
        else if (normMs === endMs)                   rangePosition = 'end';
        else if (normMs > startMs && normMs < endMs) rangePosition = 'middle';
      } else if (startMs !== null && normMs === startMs) {
        rangePosition = 'start';
      }

      cells.push({
        date,
        dayOfMonth: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: normMs === this._todayMs,
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        rangePosition,
      });
    }
    return cells;
  }

  // ── Month grids (4 rows × 3) ───────────────────────────────────────────────

  leftMonthGrid = computed<MonthCell[][]>(() => {
    const todayMonth   = this._today.getMonth();
    const displayMonth = this._leftMonth();
    const grid: MonthCell[][] = [];
    for (let row = 0; row < 4; row++) {
      grid.push(Array.from({ length: 3 }, (_, col) => {
        const monthIndex = row * 3 + col;
        return { label: MONTH_LABELS[monthIndex], monthIndex,
          isDisplayed: monthIndex === displayMonth, isToday: monthIndex === todayMonth };
      }));
    }
    return grid;
  });

  rightMonthGrid = computed<MonthCell[][]>(() => {
    const todayMonth   = this._today.getMonth();
    const displayMonth = this._rightMonth();
    const grid: MonthCell[][] = [];
    for (let row = 0; row < 4; row++) {
      grid.push(Array.from({ length: 3 }, (_, col) => {
        const monthIndex = row * 3 + col;
        return { label: MONTH_LABELS[monthIndex], monthIndex,
          isDisplayed: monthIndex === displayMonth, isToday: monthIndex === todayMonth };
      }));
    }
    return grid;
  });

  // ── Year grids (5 rows × 4) ───────────────────────────────────────────────

  leftYearGrid = computed<YearCell[][]>(() => {
    const start       = this._leftYearRangeStart();
    const todayYear   = this._today.getFullYear();
    const displayYear = this._leftYear();
    const grid: YearCell[][] = [];
    for (let row = 0; row < 5; row++) {
      grid.push(Array.from({ length: 4 }, (_, col) => {
        const year = start + row * 4 + col;
        return { year, isDisplayed: year === displayYear, isToday: year === todayYear };
      }));
    }
    return grid;
  });

  rightYearGrid = computed<YearCell[][]>(() => {
    const start       = this._rightYearRangeStart();
    const todayYear   = this._today.getFullYear();
    const displayYear = this._rightYear();
    const grid: YearCell[][] = [];
    for (let row = 0; row < 5; row++) {
      grid.push(Array.from({ length: 4 }, (_, col) => {
        const year = start + row * 4 + col;
        return { year, isDisplayed: year === displayYear, isToday: year === todayYear };
      }));
    }
    return grid;
  });

  // ── Navigation helpers ─────────────────────────────────────────────────────

  private _mv(year: number, month: number): number { return year * 12 + month; }

  private _addMonth(year: number, month: number): { year: number; month: number } {
    return month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 };
  }

  private _subMonth(year: number, month: number): { year: number; month: number } {
    return month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 };
  }

  // ── View Transitions animation ─────────────────────────────────────────────
  //
  // All signal mutations for a single user action are batched inside ONE
  // _transition() call. This means one startViewTransition per interaction —
  // the browser captures a single "before" and a single "after" snapshot,
  // covering any combination of left/right level and month/year changes.
  //
  // _isTransitioning is true during the synchronous callback so that
  // CalendarRangedComponent.onFocusout ignores the focusout event that fires
  // when Angular's tick() removes the focused date-cell from the DOM.
  //
  // Graceful degradation: browsers without startViewTransition get an
  // instant swap — same as before any animation was added.

  private _isTransitioning = false;

  /** Read by CalendarRangedComponent.onFocusout to suppress spurious closes. */
  get transitioning(): boolean { return this._isTransitioning; }

  private _transition(mutate: () => void): void {
    this._isTransitioning = true;

    if ('startViewTransition' in document) {
      document.startViewTransition(() => {
        mutate();
        // Force synchronous CD so the DOM is in its new state before the
        // browser captures the "after" snapshot.
        this._appRef.tick();
      });
    } else {
      mutate();
    }

    // Reset after the synchronous call stack — focusout has already fired
    // and been handled inside tick() above.
    this._isTransitioning = false;
  }

  // ── Independent navigation — arrows change meaning per level ──────────────
  //
  // Arrow navigation only changes which month/year is displayed — not the
  // level — so it does not use _transition(). The edge-case exception is
  // when the nudge logic forces the OTHER panel's level back to 'date',
  // which is a real level change and therefore does animate.

  prevLeft(): void {
    switch (this._leftLevel()) {
      case 'date': {
        const prev = this._subMonth(this._leftYear(), this._leftMonth());
        this._leftYear.set(prev.year);
        this._leftMonth.set(prev.month);
        break;
      }
      case 'month': this._leftYear.update(y => y - 1); break;
      case 'year':  this._leftYearAnchor.update(y => y - 20); break;
    }
  }

  nextLeft(): void {
    switch (this._leftLevel()) {
      case 'date': {
        const next = this._addMonth(this._leftYear(), this._leftMonth());
        this._leftYear.set(next.year);
        this._leftMonth.set(next.month);
        if (this._mv(next.year, next.month) >= this._mv(this._rightYear(), this._rightMonth())) {
          const nudge = this._addMonth(next.year, next.month);
          this._rightYear.set(nudge.year);
          this._rightMonth.set(nudge.month);
          this._rightYearAnchor.set(nudge.year);
          if (this._rightLevel() !== 'date') {
            this._transition(() => this._rightLevel.set('date'));
          }
        }
        break;
      }
      case 'month': this._leftYear.update(y => y + 1); break;
      case 'year':  this._leftYearAnchor.update(y => y + 20); break;
    }
  }

  prevRight(): void {
    switch (this._rightLevel()) {
      case 'date': {
        const prev = this._subMonth(this._rightYear(), this._rightMonth());
        this._rightYear.set(prev.year);
        this._rightMonth.set(prev.month);
        if (this._mv(prev.year, prev.month) <= this._mv(this._leftYear(), this._leftMonth())) {
          const nudge = this._subMonth(prev.year, prev.month);
          this._leftYear.set(nudge.year);
          this._leftMonth.set(nudge.month);
          this._leftYearAnchor.set(nudge.year);
          if (this._leftLevel() !== 'date') {
            this._transition(() => this._leftLevel.set('date'));
          }
        }
        break;
      }
      case 'month': this._rightYear.update(y => y - 1); break;
      case 'year':  this._rightYearAnchor.update(y => y - 20); break;
    }
  }

  nextRight(): void {
    switch (this._rightLevel()) {
      case 'date': {
        const next = this._addMonth(this._rightYear(), this._rightMonth());
        this._rightYear.set(next.year);
        this._rightMonth.set(next.month);
        break;
      }
      case 'month': this._rightYear.update(y => y + 1); break;
      case 'year':  this._rightYearAnchor.update(y => y + 20); break;
    }
  }

  // ── Header label button clicks ─────────────────────────────────────────────

  onLeftLabelClick(): void {
    switch (this._leftLevel()) {
      case 'date':
        this._transition(() => {
          this._leftYearAnchor.set(this._leftYear());
          this._leftLevel.set('month');
        });
        break;
      case 'month':
        this._transition(() => {
          this._leftYearAnchor.set(this._leftYear());
          this._leftLevel.set('year');
        });
        break;
      case 'year': break; // static — no further drill
    }
  }

  onRightLabelClick(): void {
    switch (this._rightLevel()) {
      case 'date':
        this._transition(() => {
          this._rightYearAnchor.set(this._rightYear());
          this._rightLevel.set('month');
        });
        break;
      case 'month':
        this._transition(() => {
          this._rightYearAnchor.set(this._rightYear());
          this._rightLevel.set('year');
        });
        break;
      case 'year': break;
    }
  }

  // ── Month / year selection ─────────────────────────────────────────────────
  //
  // All mutations for a selection (including any nudge to the other panel)
  // are batched into a single _transition() so the browser captures one
  // before/after snapshot covering both panels simultaneously.

  selectLeftMonth(monthIndex: number): void {
    this._transition(() => {
      this._leftMonth.set(monthIndex);
      this._leftLevel.set('date');
      if (this._mv(this._leftYear(), monthIndex) >= this._mv(this._rightYear(), this._rightMonth())) {
        const nudge = this._addMonth(this._leftYear(), monthIndex);
        this._rightYear.set(nudge.year);
        this._rightMonth.set(nudge.month);
        this._rightYearAnchor.set(nudge.year);
        this._rightLevel.set('date');
      }
    });
  }

  selectRightMonth(monthIndex: number): void {
    this._transition(() => {
      this._rightMonth.set(monthIndex);
      this._rightLevel.set('date');
      if (this._mv(this._rightYear(), monthIndex) <= this._mv(this._leftYear(), this._leftMonth())) {
        const nudge = this._subMonth(this._rightYear(), monthIndex);
        this._leftYear.set(nudge.year);
        this._leftMonth.set(nudge.month);
        this._leftYearAnchor.set(nudge.year);
        this._leftLevel.set('date');
      }
    });
  }

  selectLeftYear(year: number): void {
    this._transition(() => {
      this._leftYear.set(year);
      this._leftYearAnchor.set(year);
      this._leftLevel.set('month');
    });
  }

  selectRightYear(year: number): void {
    this._transition(() => {
      this._rightYear.set(year);
      this._rightYearAnchor.set(year);
      this._rightLevel.set('month');
    });
  }

  // ── Date selection ────────────────────────────────────────────────────────

  onDateClick(date: Date): void {
    const start  = this.rangeStart();
    const end    = this.rangeEnd();
    const dateMs = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

    if (!start || end !== null) {
      this.rangeStart.set(date);
      this.rangeEnd.set(null);
      this.rangeChanged.emit({ start: date, end: null });
      return;
    }

    const startMs = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    if (dateMs <= startMs) {
      this.rangeStart.set(date);
      this.rangeChanged.emit({ start: date, end: null });
    } else {
      this.rangeEnd.set(date);
      this.rangeChanged.emit({ start, end: date });
    }
  }

  // ── External API ───────────────────────────────────────────────────────────

  syncToDate(): void {
    // Called when the calendar overlay opens. Reset both panels to date level
    // instantly (no animation — the calendar isn't visible yet).
    this._leftLevel.set('date');
    this._rightLevel.set('date');

    const start = this.rangeStart() ?? this._today;
    const leftY = start.getFullYear();
    const leftM = start.getMonth();
    this._leftYear.set(leftY);
    this._leftMonth.set(leftM);
    this._leftYearAnchor.set(leftY);

    const end = this.rangeEnd();
    if (end && this._mv(end.getFullYear(), end.getMonth()) > this._mv(leftY, leftM)) {
      this._rightYear.set(end.getFullYear());
      this._rightMonth.set(end.getMonth());
      this._rightYearAnchor.set(end.getFullYear());
    } else {
      const next = this._addMonth(leftY, leftM);
      this._rightYear.set(next.year);
      this._rightMonth.set(next.month);
      this._rightYearAnchor.set(next.year);
    }
  }
}
