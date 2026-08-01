import './CalendarSelectCell.module.css';

/* ==========================================================================
   Merces Design System — Calendar Select Cell
   Figma: Month Select (781:5996) + Year Select (781:6453)
   Combined — both share identical structure.
   4 variants: State(Default/Hover) × isCurrent(False/True)

   Structure: Root > Frame > Text + [Current Indicator dot]
   ========================================================================== */

export type CalendarSelectCellState = 'default' | 'hover';

export interface CalendarSelectCellProps {
  /** Display label (month name or year number) */
  label: string;
  /** Whether this cell represents the current month/year */
  isCurrent?: boolean;
  /** Visual state override */
  state?: CalendarSelectCellState;
  /** Click handler */
  onClick?: () => void;
  /** Extra className */
  className?: string;
}

export function CalendarSelectCell({
  label,
  isCurrent = false,
  state = 'default',
  onClick,
  className,
}: CalendarSelectCellProps) {
  const rootClasses = [
    'mds-cal-select',
    isCurrent && 'mds-cal-select--current',
    state === 'hover' && 'mds-cal-select--hover',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={rootClasses}
      role="gridcell"
      tabIndex={0}
      onClick={onClick}
    >
      <span className="mds-cal-select__frame">
        <span className="mds-cal-select__text">{label}</span>
        {isCurrent && <span className="mds-cal-select__dot" />}
      </span>
    </span>
  );
}
