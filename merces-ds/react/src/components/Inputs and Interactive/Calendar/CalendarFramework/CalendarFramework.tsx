import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import './CalendarFramework.module.css';
import { CalendarDateCell } from '../CalendarDateCell/CalendarDateCell';
import { CalendarWeekday } from '../CalendarWeekday/CalendarWeekday';
import { CalendarHeader } from '../CalendarHeader/CalendarHeader';
import { CalendarSelectCell } from '../CalendarSelectCell/CalendarSelectCell';
import { CTAButton } from '../../CTA Buttons/CTAButton/CTAButton';
import { ChevronLeftBold16, ChevronRightBold16 } from '../../../Assets/Icon/icons';

/* ==========================================================================
   Merces Design System — Calendar Framework
   Figma: Calendar Framework (736:1434) — 6 variants
   Ranged(False/True) × Level(Date/Month/Year)

   This is the "organ" — it composes cell components into a navigable
   calendar with three drill-down levels: Date → Month → Year.

   Structure:
     Root > Header Row (nav + label) > Body (grid of cells)
   ========================================================================== */

export type CalendarLevel = 'date' | 'month' | 'year';

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Generate the 5-week (35 cell) or 6-week (42 cell) date grid for a given month.
 *  Monday-start: getDay() returns 0=Sun, we convert to Mon=0 … Sun=6. */
function generateDateGrid(year: number, month: number) {
  const firstDaySun = new Date(year, month, 1).getDay();   // 0=Sun
  const firstDay = firstDaySun === 0 ? 6 : firstDaySun - 1; // Mon=0 … Sun=6
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: Array<{ date: number; currentMonth: boolean; monthOffset: number }> = [];

  /* Previous month trailing days (Monday-start) */
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ date: daysInPrev - i, currentMonth: false, monthOffset: -1 });
  }

  /* Current month days */
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: d, currentMonth: true, monthOffset: 0 });
  }

  /* Next month leading days — fill to 35 or 42 */
  const targetCells = cells.length > 35 ? 42 : 35;
  let nextDay = 1;
  while (cells.length < targetCells) {
    cells.push({ date: nextDay++, currentMonth: false, monthOffset: 1 });
  }

  /* Split into weeks of 7 */
  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

/** Compute the decade range for year-level display */
function getDecadeRange(year: number): [number, number] {
  const start = Math.floor(year / 10) * 10;
  return [start, start + 9];
}

export interface CalendarFrameworkProps {
  /** Whether this calendar is in ranged selection mode */
  ranged?: boolean;
  /** Currently displayed year */
  year?: number;
  /** Currently displayed month (0-indexed) */
  month?: number;
  /** Today's date for highlighting */
  today?: Date;
  /** Selected date (single mode) */
  selectedDate?: Date | null;
  /** Selected range (ranged mode) */
  selectedRange?: { start: Date | null; end: Date | null };
  /** Called when a date is clicked */
  onDateClick?: (date: Date) => void;
  /** Called when a month is selected (from month grid) */
  onMonthSelect?: (month: number) => void;
  /** Called when a year is selected (from year grid) */
  onYearSelect?: (year: number) => void;
  /** Called when month/year changes via navigation */
  onNavigate?: (year: number, month: number) => void;
  /** Extra className */
  className?: string;
}

export function CalendarFramework({
  ranged = false,
  year: controlledYear,
  month: controlledMonth,
  today = new Date(),
  selectedDate = null,
  selectedRange,
  onDateClick,
  onMonthSelect,
  onYearSelect,
  onNavigate,
  className,
}: CalendarFrameworkProps) {
  const [internalYear, setInternalYear] = useState(controlledYear ?? today.getFullYear());
  const [internalMonth, setInternalMonth] = useState(controlledMonth ?? today.getMonth());
  const [level, setLevel] = useState<CalendarLevel>('date');

  /* Keep internal state in sync with controlled props */
  useEffect(() => {
    if (controlledYear !== undefined) setInternalYear(controlledYear);
  }, [controlledYear]);
  useEffect(() => {
    if (controlledMonth !== undefined) setInternalMonth(controlledMonth);
  }, [controlledMonth]);

  const displayYear = controlledYear ?? internalYear;
  const displayMonth = controlledMonth ?? internalMonth;

  /* Navigation handlers — use refs to avoid stale closures */
  const displayRef = useRef({ y: displayYear, m: displayMonth });
  displayRef.current = { y: displayYear, m: displayMonth };

  const navigate = useCallback((newYear: number, newMonth: number) => {
    setInternalYear(newYear);
    setInternalMonth(newMonth);
    onNavigate?.(newYear, newMonth);
  }, [onNavigate]);

  const handlePrev = useCallback(() => {
    const { y, m } = displayRef.current;
    if (level === 'date') {
      const nm = m === 0 ? 11 : m - 1;
      const ny = m === 0 ? y - 1 : y;
      navigate(ny, nm);
    } else if (level === 'month') {
      navigate(y - 1, m);
    } else {
      const [start] = getDecadeRange(y);
      navigate(start - 10, m);
    }
  }, [level, navigate]);

  const handleNext = useCallback(() => {
    const { y, m } = displayRef.current;
    if (level === 'date') {
      const nm = m === 11 ? 0 : m + 1;
      const ny = m === 11 ? y + 1 : y;
      navigate(ny, nm);
    } else if (level === 'month') {
      navigate(y + 1, m);
    } else {
      const [start] = getDecadeRange(y);
      navigate(start + 10, m);
    }
  }, [level, navigate]);

  const handleHeaderClick = useCallback(() => {
    if (level === 'date') setLevel('month');
    else if (level === 'month') setLevel('year');
  }, [level]);

  const handleMonthClick = useCallback((m: number) => {
    const { y } = displayRef.current;
    setLevel('date');
    navigate(y, m);
    onMonthSelect?.(m);
  }, [navigate, onMonthSelect]);

  const handleYearClick = useCallback((y: number) => {
    const { m } = displayRef.current;
    setLevel('month');
    navigate(y, m);
    onYearSelect?.(y);
  }, [navigate, onYearSelect]);

  /* Date grid */
  const weeks = useMemo(() => generateDateGrid(displayYear, displayMonth), [displayYear, displayMonth]);

  /* Decade for year grid */
  const [decadeStart, decadeEnd] = getDecadeRange(displayYear);

  /* Helper: is a given date "today"? */
  const isToday = (d: number, isCurrent: boolean) => {
    return isCurrent &&
      d === today.getDate() &&
      displayMonth === today.getMonth() &&
      displayYear === today.getFullYear();
  };

  /* Helper: is date selected (single mode)? */
  const isDateSelected = (d: number, isCurrent: boolean) => {
    if (!selectedDate || !isCurrent) return false;
    return d === selectedDate.getDate() &&
      displayMonth === selectedDate.getMonth() &&
      displayYear === selectedDate.getFullYear();
  };

  /* Helper: ranged selection positioning — uses monthOffset to compute
     the real date for non-current-month cells (prev/next month overflow). */
  const getRangeInfo = (d: number, monthOffset: number): { isSelected: boolean; positioning: 'default' | 'start' | 'middle' | 'end' | 'solo' } => {
    if (!ranged || !selectedRange?.start) return { isSelected: false, positioning: 'default' };
    const cellDate = new Date(displayYear, displayMonth + monthOffset, d);
    const start = selectedRange.start;
    const end = selectedRange.end;
    if (!end) {
      if (cellDate.getTime() === start.getTime()) return { isSelected: true, positioning: 'start' };
      return { isSelected: false, positioning: 'default' };
    }
    const cellTime = cellDate.getTime();
    const startTime = start.getTime();
    const endTime = end.getTime();
    /* Same-day range: both start and end are this cell */
    if (startTime === endTime && cellTime === startTime) return { isSelected: true, positioning: 'solo' };
    if (cellTime === startTime) return { isSelected: true, positioning: 'start' };
    if (cellTime === endTime) return { isSelected: true, positioning: 'end' };
    if (cellTime > startTime && cellTime < endTime) return { isSelected: true, positioning: 'middle' };
    return { isSelected: false, positioning: 'default' };
  };

  /* --- Body height animation ---
     Measures the content height and sets it explicitly on the body
     so the CSS height transition animates smoothly between levels. */
  const bodyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentEl = contentRef.current;
    const bodyEl = bodyRef.current;
    if (contentEl && bodyEl) {
      bodyEl.style.height = `${contentEl.scrollHeight}px`;
    }
  }, [level, weeks]);

  const rootClasses = [
    'mds-cal-fw',
    ranged && 'mds-cal-fw--ranged',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses}>
      {/* ---- Header Row ---- */}
      <div className="mds-cal-fw__header">
        <CTAButton
          icon={ChevronLeftBold16}
          colorTheme="brand"
          ctaType="quaternary"
          size="mini"
          variant="iconOnly"
          onClick={handlePrev}
          aria-label="Previous"
        />
        <CalendarHeader
          level={level}
          month={MONTH_FULL[displayMonth]}
          year={displayYear}
          yearFrom={decadeStart}
          yearTo={decadeEnd}
          onClick={handleHeaderClick}
        />
        <CTAButton
          icon={ChevronRightBold16}
          colorTheme="brand"
          ctaType="quaternary"
          size="mini"
          variant="iconOnly"
          onClick={handleNext}
          aria-label="Next"
        />
      </div>

      {/* ---- Body ---- */}
      <div className="mds-cal-fw__body" ref={bodyRef}>
        <div className="mds-cal-fw__level" ref={contentRef} key={level}>

          {level === 'date' && (
            <>
              {/* Weekday header row */}
              <div className="mds-cal-fw__weekdays">
                {WEEKDAY_LABELS.map((label, i) => (
                  <CalendarWeekday key={i} label={label} ranged={ranged} />
                ))}
              </div>

              {/* Date grid */}
              <div className="mds-cal-fw__dates" role="grid">
                {weeks.map((week, wi) => (
                  <div key={wi} className="mds-cal-fw__week" role="row">
                    {week.map((cell, ci) => {
                      const rangeInfo = getRangeInfo(cell.date, cell.monthOffset);
                      return (
                        <CalendarDateCell
                          key={ci}
                          date={cell.date}
                          currentMonth={cell.currentMonth}
                          isToday={isToday(cell.date, cell.currentMonth)}
                          ranged={ranged}
                          isSelected={ranged ? rangeInfo.isSelected : false}
                          positioning={rangeInfo.positioning}
                          state={
                            !ranged && isDateSelected(cell.date, cell.currentMonth)
                              ? 'focus'
                              : ranged && (rangeInfo.positioning === 'start' || rangeInfo.positioning === 'end' || rangeInfo.positioning === 'solo')
                                ? 'focus'
                                : 'default'
                          }
                          onClick={() => {
                            const clickedDate = new Date(displayYear, displayMonth + cell.monthOffset, cell.date);
                            if (!cell.currentMonth) {
                              navigate(clickedDate.getFullYear(), clickedDate.getMonth());
                            }
                            onDateClick?.(clickedDate);
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          )}

          {level === 'month' && (
            <div className="mds-cal-fw__month-grid" role="grid">
              {[0, 1, 2, 3].map(row => (
                <div key={row} className="mds-cal-fw__month-row" role="row">
                  {[0, 1, 2].map(col => {
                    const m = row * 3 + col;
                    return (
                      <CalendarSelectCell
                        key={m}
                        label={MONTH_LABELS[m]}
                        isCurrent={m === today.getMonth() && displayYear === today.getFullYear()}
                        onClick={() => handleMonthClick(m)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {level === 'year' && (
            <div className="mds-cal-fw__year-grid" role="grid">
              {[0, 1, 2, 3, 4].map(row => (
                <div key={row} className="mds-cal-fw__year-row" role="row">
                  {[0, 1, 2, 3].map(col => {
                    const y = decadeStart + row * 4 + col;
                    return (
                      <CalendarSelectCell
                        key={y}
                        label={String(y)}
                        isCurrent={y === today.getFullYear()}
                        onClick={() => handleYearClick(y)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
