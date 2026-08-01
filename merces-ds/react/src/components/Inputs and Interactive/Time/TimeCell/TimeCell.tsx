import { Icon } from '../../../Assets/Icon/Icon';
import { TickBold12 } from '../../../Assets/Icon/icons';
import './TimeCell.module.css';

export type TimeCellFormat = '24hr' | '12hr';
export type TimeCellMeridian = 'am' | 'pm';
export type TimeCellState = 'default' | 'hover' | 'pressed' | 'disabled';

export interface TimeCellProps {
  /** Display time string, e.g. "14:30" or "2:30" */
  time: string;
  /** 24hr or 12hr format */
  format?: TimeCellFormat;
  /** Meridian — only relevant for 12hr format */
  meridian?: TimeCellMeridian;
  /** Whether this cell represents the currently selected time */
  isCurrent?: boolean;
  /** Visual state for demo purposes */
  state?: TimeCellState;
  /** Click handler */
  onClick?: () => void;
  /** Additional class name */
  className?: string;
}

export default function TimeCell({
  time,
  format = '24hr',
  meridian = 'am',
  isCurrent = false,
  state = 'default',
  onClick,
  className,
}: TimeCellProps) {
  const rootClasses = [
    'mds-time-cell',
    isCurrent && 'mds-time-cell--current',
    state === 'hover' && 'mds-time-cell--hover',
    state === 'pressed' && 'mds-time-cell--pressed',
    state === 'disabled' && 'mds-time-cell--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={rootClasses}
      onClick={onClick}
      disabled={state === 'disabled'}
    >
      {/* Tick icon — visible only when isCurrent */}
      <span className="mds-time-cell__icon">
        <Icon size="tiny">{TickBold12}</Icon>
      </span>

      {/* Time text */}
      <span className="mds-time-cell__time">
        <span className="mds-time-cell__value">{time}</span>
        {format === '12hr' && (
          <span className="mds-time-cell__meridian">{meridian}</span>
        )}
      </span>
    </button>
  );
}
