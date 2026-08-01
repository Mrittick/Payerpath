import './CalendarDateCell.module.css';

/* ==========================================================================
   Merces Design System — Calendar Date Cell
   Figma: Date - Single (736:425) + Date - Ranged (741:1617)
   Combined component handling both single and ranged date cells.

   Structure:
     Root > Frame > Number text + [Today dot]
   ========================================================================== */

export type CalendarDateCellState = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled';
export type CalendarDateCellPositioning = 'default' | 'start' | 'middle' | 'end' | 'solo';

export interface CalendarDateCellProps {
  /** Day number to display */
  date: number;
  /** Whether this date belongs to the currently displayed month */
  currentMonth?: boolean;
  /** Whether this date is today */
  isToday?: boolean;
  /** Visual state override */
  state?: CalendarDateCellState;
  /** Whether in ranged selection mode */
  ranged?: boolean;
  /** Whether this cell is part of the selected range */
  isSelected?: boolean;
  /** Position within range (only when isSelected) */
  positioning?: CalendarDateCellPositioning;
  /** Click handler */
  onClick?: () => void;
  /** Extra className */
  className?: string;
}

export function CalendarDateCell({
  date,
  currentMonth = true,
  isToday = false,
  state = 'default',
  ranged = false,
  isSelected = false,
  positioning = 'default',
  onClick,
  className,
}: CalendarDateCellProps) {
  const isDisabled = state === 'disabled';

  /* Today dot: visible whenever isToday=true, all states */
  const showTodayDot = isToday;

  const rootClasses = [
    'mds-cal-date',
    currentMonth && 'mds-cal-date--current',
    ranged && 'mds-cal-date--ranged',
    isSelected && 'mds-cal-date--selected',
    isSelected && positioning !== 'default' && `mds-cal-date--pos-${positioning}`,
    state === 'hover' && 'mds-cal-date--hover',
    state === 'pressed' && 'mds-cal-date--pressed',
    state === 'focus' && 'mds-cal-date--focus',
    state === 'disabled' && 'mds-cal-date--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={rootClasses}
      role="gridcell"
      aria-disabled={isDisabled || undefined}
      aria-selected={isSelected || undefined}
      tabIndex={isDisabled ? -1 : 0}
      onClick={isDisabled ? undefined : onClick}
    >
      <span className="mds-cal-date__frame">
        <span className="mds-cal-date__number">{date}</span>
        {showTodayDot && <span className="mds-cal-date__today-dot" />}
      </span>
    </span>
  );
}
