import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CtaButtonComponent } from '../cta-button/cta-button.component';
import {
  CalendarCell,
  CalendarLevel,
  MONTH_LABELS,
  MonthCell,
  WEEKDAY_LABELS,
  YearCell,
} from './calendar-ui.types';

@Component({
  selector: 'merces-calendar-ui',
  templateUrl: './calendar-ui.component.html',
  styleUrl: './calendar-ui.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CtaButtonComponent],
})
export class CalendarUiComponent {
  /** Two-way bound selected date — null means nothing selected. */
  selectedDate = model<Date | null>(null);

  /** Emitted on each user selection (same value as selectedDate after update). */
  dateSelected = output<Date>();

  readonly weekdays = WEEKDAY_LABELS;

  /**
   * Outer wrapper — owns the height transition and overflow:hidden during level switches.
   * Inner .cal-body is unconstrained so its offsetHeight always returns the natural
   * content height, regardless of the lock on the outer wrapper.
   */
  private readonly _calBodyWrap = viewChild.required<ElementRef<HTMLDivElement>>('calBodyWrap');

  /**
   * True while a level-switch dissolve is in progress.
   * Read by CalendarComponent.onFocusout to suppress spurious close when
   * @switch removes the currently-focused cell from the DOM mid-transition.
   */
  transitioning = false;

  private readonly _today = new Date();
  private readonly _todayMs = new Date(
    this._today.getFullYear(),
    this._today.getMonth(),
    this._today.getDate(),
  ).getTime();

  /** Which picker level is visible: date grid / month grid / year grid. */
  _level = signal<CalendarLevel>('date');

  /** Drives the fade-out/in dissolve when switching levels. */
  _bodyVisible = signal(true);

  /** Display year/month driving the visible grid. Defaults to today's month. */
  _displayYear = signal(this._today.getFullYear());
  _displayMonth = signal(this._today.getMonth()); // 0-based

  /**
   * Separate anchor for the 20-year window shown in the year picker.
   * Navigating the year grid with prev/next moves this — NOT _displayYear —
   * so the highlight (which tracks _displayYear) stays on the correct year
   * regardless of which page of the window the user is browsing.
   */
  private _yearPageAnchor = signal(this._today.getFullYear());

  // ── Header labels ──────────────────────────────────────────────────────────

  /** Full "Month Year" string for date-level aria-label. */
  headerLabel = computed(() =>
    new Date(this._displayYear(), this._displayMonth(), 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    }),
  );

  /** Month name only, e.g. "April". */
  headerMonthLabel = computed(() =>
    new Date(this._displayYear(), this._displayMonth(), 1).toLocaleDateString('en-US', {
      month: 'long',
    }),
  );

  /** Year number as string, e.g. "2026". */
  headerYearLabel = computed(() => String(this._displayYear()));

  /**
   * Single shared label shown in the header button across all levels.
   * The button element stays in the DOM — only this text changes.
   */
  _headerLabel = computed(() => {
    const level = this._level();
    if (level === 'date')  return `${this.headerMonthLabel()} ${this.headerYearLabel()}`;
    if (level === 'month') return `Year ${this.headerYearLabel()}`;
    return this.yearRangeLabel();
  });

  /** Start of the 20-year window shown in the year picker. */
  yearRangeStart = computed(() => Math.floor(this._yearPageAnchor() / 20) * 20);

  /** "2020 - 2039" label for the year-level header. */
  yearRangeLabel = computed(() => {
    const s = this.yearRangeStart();
    return `${s} - ${s + 19}`;
  });

  // ── Normalised selection timestamp ─────────────────────────────────────────

  /** Midnight timestamp of selected date for fast equality checks. */
  _selectedMs = computed(() => {
    const s = this.selectedDate();
    if (!s) return null;
    return new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
  });

  // ── Grids ─────────────────────────────────────────────────────────────────

  /** 42-cell Monday-based date grid for the current display month. */
  calendarGrid = computed<CalendarCell[]>(() => {
    const year = this._displayYear();
    const month = this._displayMonth();

    // Mon-based start offset: 0=Mon, 6=Sun
    const firstDow = new Date(year, month, 1).getDay();
    const startOffset = (firstDow + 6) % 7;

    const cells: CalendarCell[] = [];
    for (let i = 0; i < 42; i++) {
      const dayOffset = i - startOffset;
      const date = new Date(year, month, 1 + dayOffset);
      const normMs = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      cells.push({
        date,
        dayOfMonth: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: normMs === this._todayMs,
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      });
    }
    return cells;
  });

  /** 4 rows × 3 months for the month picker. */
  monthGrid = computed<MonthCell[][]>(() => {
    const todayMonth   = this._today.getMonth();    // drives dot — always today's month
    const displayMonth = this._displayMonth();       // drives highlight — currently viewed month
    const grid: MonthCell[][] = [];
    for (let row = 0; row < 4; row++) {
      grid.push(
        Array.from({ length: 3 }, (_, col) => {
          const monthIndex = row * 3 + col;
          return {
            label: MONTH_LABELS[monthIndex],
            monthIndex,
            isDisplayed: monthIndex === displayMonth,
            isToday:     monthIndex === todayMonth,
          };
        }),
      );
    }
    return grid;
  });

  /** 5 rows × 4 years for the year picker (20-year window). */
  yearGrid = computed<YearCell[][]>(() => {
    const start       = this.yearRangeStart();
    const todayYear   = this._today.getFullYear();  // drives dot — always today's year
    const displayYear = this._displayYear();         // drives highlight — currently viewed year
    const grid: YearCell[][] = [];
    for (let row = 0; row < 5; row++) {
      grid.push(
        Array.from({ length: 4 }, (_, col) => {
          const year = start + row * 4 + col;
          return { year, isDisplayed: year === displayYear, isToday: year === todayYear };
        }),
      );
    }
    return grid;
  });

  // ── Navigation ─────────────────────────────────────────────────────────────

  private prevMonth(): void {
    if (this._displayMonth() === 0) {
      this._displayYear.update(y => y - 1);
      this._displayMonth.set(11);
    } else {
      this._displayMonth.update(m => m - 1);
    }
  }

  private nextMonth(): void {
    if (this._displayMonth() === 11) {
      this._displayYear.update(y => y + 1);
      this._displayMonth.set(0);
    } else {
      this._displayMonth.update(m => m + 1);
    }
  }

  prevUnit(): void {
    switch (this._level()) {
      case 'date':  this.prevMonth(); break;
      case 'month': this._displayYear.update(y => y - 1); break;
      // Move the window anchor only — _displayYear (and its highlight) is unchanged.
      case 'year':  this._yearPageAnchor.update(y => y - 20); break;
    }
  }

  nextUnit(): void {
    switch (this._level()) {
      case 'date':  this.nextMonth(); break;
      case 'month': this._displayYear.update(y => y + 1); break;
      // Move the window anchor only — _displayYear (and its highlight) is unchanged.
      case 'year':  this._yearPageAnchor.update(y => y + 20); break;
    }
  }

  goToLevel(level: CalendarLevel): void {
    // When entering the year picker, sync the window to wherever _displayYear currently is
    // so the highlighted year is always visible on the first page shown.
    if (level === 'year') this._yearPageAnchor.set(this._displayYear());
    this._dissolve(() => this._level.set(level));
  }

  /** Handles header label button click — routes by current level; year is static. */
  onLabelClick(): void {
    const level = this._level();
    if (level === 'date')       this.goToLevel('month');
    else if (level === 'month') this.goToLevel('year');
    // year → static, no action
  }

  // ── Selection ──────────────────────────────────────────────────────────────

  selectDate(cell: CalendarCell): void {
    this.selectedDate.set(cell.date);
    this.dateSelected.emit(cell.date);
  }

  selectMonth(cell: MonthCell): void {
    this._dissolve(() => {
      this._displayMonth.set(cell.monthIndex);
      this._level.set('date');
    });
  }

  selectYear(cell: YearCell): void {
    this._dissolve(() => {
      this._displayYear.set(cell.year);
      this._yearPageAnchor.set(cell.year); // keep window in sync with the newly selected year
      this._level.set('month');
    });
  }

  /**
   * Level-switch dissolve — three phases:
   *
   *  0 ms  Lock OUTER wrapper height at its current px value (overflow:hidden applied).
   *        Fade out inner body + header label (opacity → 0, 75 ms).
   *
   * 75 ms  Run state mutation. Angular renders new DOM inside the inner .cal-body,
   *        which is NOT height-constrained by the wrapper — its offsetHeight always
   *        reflects the natural new content height (no height:'auto' trick, no snap).
   *
   *        Single rAF: read innerEl.offsetHeight → set wrapEl.style.height to that
   *        value → CSS transition animates the wrapper from fromH to toH (200 ms).
   *        Panel grows or shrinks smoothly while content is still invisible.
   *
   *275 ms  Fade in (75 ms). Clean up inline styles.
   */
  private _dissolve(mutate: () => void): void {
    this.transitioning = true;

    const wrapEl  = this._calBodyWrap().nativeElement;
    const innerEl = wrapEl.firstElementChild as HTMLElement; // the .cal-body div

    const fromH = wrapEl.offsetHeight;
    wrapEl.style.overflow = 'hidden';      // clip during animation
    wrapEl.style.height   = `${fromH}px`; // lock outer at current height

    this._bodyVisible.set(false);          // fade out (75 ms)

    setTimeout(() => {
      mutate();                            // swap level; Angular renders new content

      requestAnimationFrame(() => {
        // innerEl is NOT constrained by the wrapper's locked height —
        // its offsetHeight is always the natural height of the new content.
        const toH = innerEl.offsetHeight;
        wrapEl.style.height = `${toH}px`; // CSS transition fires: fromH → toH (200 ms)

        setTimeout(() => {
          // rAF ensures Angular has painted the new content at opacity:0 before we
          // flip _bodyVisible — without this the browser skips the fade-in transition
          // because the class removal and the new DOM insertion happen in the same tick.
          requestAnimationFrame(() => {
            this._bodyVisible.set(true);   // fade in (75 ms)
          });
          setTimeout(() => {
            wrapEl.style.height   = '';    // restore auto; natural height = toH, no snap
            wrapEl.style.overflow = '';    // restore so focus rings aren't clipped
            this.transitioning = false;
          }, 75);
        }, 200);                           // wait for height transition
      });
    }, 75);                                // wait for fade-out
  }

  // ── External API ───────────────────────────────────────────────────────────

  /** Called by the field trigger when opening: sync display to selected date and reset to date level. */
  syncToDate(): void {
    const d = this.selectedDate() ?? this._today;
    this._displayYear.set(d.getFullYear());
    this._yearPageAnchor.set(d.getFullYear()); // ensure year picker opens on the right window
    this._displayMonth.set(d.getMonth());
    this._level.set('date');
  }
}
