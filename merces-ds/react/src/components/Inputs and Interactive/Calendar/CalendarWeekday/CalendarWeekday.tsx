import './CalendarWeekday.module.css';

/* ==========================================================================
   Merces Design System — Calendar Weekday
   Figma: Weekday (779:5771) — 2 variants: isRanged(False/True)
   Structure: Root > Frame > Text
   ========================================================================== */

export interface CalendarWeekdayProps {
  /** Single-letter day abbreviation (S, M, T, W, T, F, S) */
  label: string;
  /** Ranged mode uses wider cells (34px vs 32px) */
  ranged?: boolean;
  /** Extra className */
  className?: string;
}

export function CalendarWeekday({
  label,
  ranged = false,
  className,
}: CalendarWeekdayProps) {
  const rootClasses = [
    'mds-cal-weekday',
    ranged && 'mds-cal-weekday--ranged',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={rootClasses} role="columnheader" aria-label={label}>
      <span className="mds-cal-weekday__frame">
        <span className="mds-cal-weekday__text">{label}</span>
      </span>
    </span>
  );
}
