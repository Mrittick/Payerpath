import './CalendarHeader.module.css';

/* ==========================================================================
   Merces Design System — Calendar Header
   Figma: Header (736:1381) — 6 variants
   State(Default/Hover) × Level(Date/Month/Year)

   Level determines text content:
     Date:  "October 2025"    → [month, year]
     Month: "Year 2025"       → ["Year" label, year]
     Year:  "2020 - 2029"     → [from, "–", to]
   ========================================================================== */

export type CalendarHeaderLevel = 'date' | 'month' | 'year';
export type CalendarHeaderState = 'default' | 'hover';

export interface CalendarHeaderProps {
  /** Current display level */
  level?: CalendarHeaderLevel;
  /** Month name (Date level) */
  month?: string;
  /** Year (Date + Month level) */
  year?: number;
  /** Year range start (Year level) */
  yearFrom?: number;
  /** Year range end (Year level) */
  yearTo?: number;
  /** Visual state override */
  state?: CalendarHeaderState;
  /** Click handler — typically navigates up a level */
  onClick?: () => void;
  /** Extra className */
  className?: string;
}

export function CalendarHeader({
  level = 'date',
  month = 'October',
  year = 2025,
  yearFrom = 2020,
  yearTo = 2029,
  state = 'default',
  onClick,
  className,
}: CalendarHeaderProps) {
  const rootClasses = [
    'mds-cal-header',
    state === 'hover' && 'mds-cal-header--hover',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={rootClasses} role="button" tabIndex={0} onClick={onClick}>
      <span className="mds-cal-header__frame">
        {level === 'date' && (
          <>
            <span className="mds-cal-header__text">{month}</span>
            <span className="mds-cal-header__text">{year}</span>
          </>
        )}
        {level === 'month' && (
          <>
            <span className="mds-cal-header__text">Year</span>
            <span className="mds-cal-header__text">{year}</span>
          </>
        )}
        {level === 'year' && (
          <>
            <span className="mds-cal-header__text">{yearFrom}</span>
            <span className="mds-cal-header__text">-</span>
            <span className="mds-cal-header__text">{yearTo}</span>
          </>
        )}
      </span>
    </span>
  );
}
