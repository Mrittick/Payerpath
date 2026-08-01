import { useState, useCallback, useRef, useEffect } from 'react';
import './CalendarUI.module.css';
import { CalendarFramework } from '../CalendarFramework/CalendarFramework';

/* ==========================================================================
   Merces Design System — Calendar UI
   Figma: Calendar UI (779:482) — 3 variants
   Ranged(False/True) × longRanged(False/True)

   This is the top-level "organism" — it wraps one or two Calendar
   Framework instances with a styled container and optional divider.

   Variants:
     Single:     One CalendarFramework
     Ranged:     Two CalendarFrameworks side-by-side (consecutive months)
     LongRanged: Two CalendarFrameworks side-by-side (independent months)
   ========================================================================== */

/** Add one month to (year, month) */
function addMonth(y: number, m: number): [number, number] {
  return m === 11 ? [y + 1, 0] : [y, m + 1];
}
/** Subtract one month from (year, month) */
function subMonth(y: number, m: number): [number, number] {
  return m === 0 ? [y - 1, 11] : [y, m - 1];
}

export interface CalendarUIProps {
  /** Enable ranged selection (two calendar panes) */
  ranged?: boolean;
  /** Long-ranged: two independent panes (otherwise consecutive months) */
  longRanged?: boolean;
  /** Selected date (single mode) */
  selectedDate?: Date | null;
  /** Selected range (ranged mode) */
  selectedRange?: { start: Date | null; end: Date | null };
  /** Called when a date is clicked */
  onDateClick?: (date: Date) => void;
  /** Called when selection range changes (ranged mode) */
  onRangeChange?: (range: { start: Date | null; end: Date | null }) => void;
  /** Today override */
  today?: Date;
  /** External view control — navigate the calendar to this month (0-indexed) */
  viewMonth?: number;
  /** External view control — navigate the calendar to this year */
  viewYear?: number;
  /** Extra className */
  className?: string;
}

export function CalendarUI({
  ranged = false,
  longRanged = false,
  selectedDate = null,
  selectedRange,
  onDateClick,
  onRangeChange,
  today = new Date(),
  viewMonth,
  viewYear,
  className,
}: CalendarUIProps) {
  const isRanged = ranged || longRanged;

  /* --- Determine initial months for left/right panes --- */
  const initDate = selectedDate
    ?? selectedRange?.start
    ?? today;

  /* If both range endpoints exist and are more than 1 month apart,
     show start's month (left) and end's month (right) so both are visible. */
  const initLeft = { y: initDate.getFullYear(), m: initDate.getMonth() };
  const initRight = (() => {
    if (isRanged && selectedRange?.start && selectedRange?.end) {
      const endY = selectedRange.end.getFullYear();
      const endM = selectedRange.end.getMonth();
      const startY = selectedRange.start.getFullYear();
      const startM = selectedRange.start.getMonth();
      /* Only use end's month if it's at least 2 months after start */
      const monthDiff = (endY - startY) * 12 + (endM - startM);
      if (monthDiff >= 2) return { y: endY, m: endM };
    }
    const [ry, rm] = addMonth(initLeft.y, initLeft.m);
    return { y: ry, m: rm };
  })();

  const [leftYear, setLeftYear] = useState(initLeft.y);
  const [leftMonth, setLeftMonth] = useState(initLeft.m);
  const [rightYear, setRightYear] = useState(initRight.y);
  const [rightMonth, setRightMonth] = useState(initRight.m);

  /* Refs to track latest values for use in callbacks */
  const leftRef = useRef({ y: leftYear, m: leftMonth });
  leftRef.current = { y: leftYear, m: leftMonth };
  const rightRef = useRef({ y: rightYear, m: rightMonth });
  rightRef.current = { y: rightYear, m: rightMonth };

  /* --- External view control: navigate when viewMonth/viewYear change --- */
  useEffect(() => {
    if (viewYear !== undefined && viewMonth !== undefined) {
      setLeftYear(viewYear);
      setLeftMonth(viewMonth);
      if (isRanged) {
        const [ry, rm] = addMonth(viewYear, viewMonth);
        setRightYear(ry);
        setRightMonth(rm);
      }
    }
  }, [viewMonth, viewYear, isRanged]);

  /* --- Navigation handlers ---
     Constraint: left pane must always be chronologically earlier than right.
     If left navigates to >= right, push right to left + 1 month.
     If right navigates to <= left, push left to right − 1 month. */
  const handleLeftNavigate = useCallback((y: number, m: number) => {
    setLeftYear(y);
    setLeftMonth(m);
    const r = rightRef.current;
    if (y > r.y || (y === r.y && m >= r.m)) {
      const [ry, rm] = addMonth(y, m);
      setRightYear(ry);
      setRightMonth(rm);
    }
  }, []);

  const handleRightNavigate = useCallback((y: number, m: number) => {
    setRightYear(y);
    setRightMonth(m);
    const l = leftRef.current;
    if (y < l.y || (y === l.y && m <= l.m)) {
      const [ly, lm] = subMonth(y, m);
      setLeftYear(ly);
      setLeftMonth(lm);
    }
  }, []);

  /* --- Range selection: extend / shrink model ---
     1. Nothing selected → click sets start.
     2. Start only → click sets end (auto-sorted so start < end).
     3. Both set → extend/shrink:
        - Click before start → becomes new start (end unchanged).
        - Click after end   → becomes new end (start unchanged).
        - Click between     → replace whichever endpoint is closer.
        - Click ON start or end → collapse to single point (other cleared). */

  const handleRangeDateClick = useCallback((date: Date) => {
    if (!selectedRange || !selectedRange.start) {
      onRangeChange?.({ start: date, end: null });
      return;
    }
    if (!selectedRange.end) {
      const a = selectedRange.start;
      if (date.getTime() < a.getTime()) {
        onRangeChange?.({ start: date, end: a });
      } else {
        onRangeChange?.({ start: a, end: date });
      }
      return;
    }
    /* Both endpoints exist — extend / shrink */
    const t = date.getTime();
    const s = selectedRange.start.getTime();
    const e = selectedRange.end.getTime();

    if (t < s) {
      /* Before start → new start */
      onRangeChange?.({ start: date, end: selectedRange.end });
    } else if (t > e) {
      /* After end → new end */
      onRangeChange?.({ start: selectedRange.start, end: date });
    } else if (t === s) {
      /* Clicked on start → collapse to just end as new start */
      onRangeChange?.({ start: selectedRange.end, end: null });
    } else if (t === e) {
      /* Clicked on end → collapse to just start */
      onRangeChange?.({ start: selectedRange.start, end: null });
    } else {
      /* Between start and end → replace closest endpoint */
      const distToStart = t - s;
      const distToEnd = e - t;
      if (distToStart <= distToEnd) {
        onRangeChange?.({ start: date, end: selectedRange.end });
      } else {
        onRangeChange?.({ start: selectedRange.start, end: date });
      }
    }
  }, [selectedRange, onRangeChange]);

  const rootClasses = [
    'mds-cal-ui',
    isRanged && 'mds-cal-ui--ranged',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses}>
      {/* Left (or only) pane */}
      <CalendarFramework
        ranged={isRanged}
        year={leftYear}
        month={leftMonth}
        today={today}
        selectedDate={isRanged ? undefined : selectedDate}
        selectedRange={isRanged ? selectedRange : undefined}
        onDateClick={isRanged ? handleRangeDateClick : onDateClick}
        onNavigate={handleLeftNavigate}
      />

      {/* Divider + Right pane (ranged only) */}
      {isRanged && (
        <>
          <div className="mds-cal-ui__divider">
            <div className="mds-cal-ui__divider-fill" />
          </div>
          <CalendarFramework
            ranged
            year={rightYear}
            month={rightMonth}
            today={today}
            selectedRange={selectedRange}
            onDateClick={handleRangeDateClick}
            onNavigate={handleRightNavigate}
          />
        </>
      )}
    </div>
  );
}
