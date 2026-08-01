import type { CSSProperties } from 'react';
import './ActiveIndicator.module.css';

export type ActiveIndicatorState = 'default' | 'hover' | 'invoked';

export interface ActiveIndicatorProps {
  /** Visual state controlling the outer stroke colour */
  state?: ActiveIndicatorState;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
}

const STATE_CLASS: Record<ActiveIndicatorState, string> = {
  default: '',
  hover:   'mds-active-indicator--hover',
  invoked: 'mds-active-indicator--invoked',
};

export function ActiveIndicator({
  state = 'default',
  className,
  style,
}: ActiveIndicatorProps) {
  const classes = [
    'mds-active-indicator',
    STATE_CLASS[state],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes} style={style} aria-hidden="true" />;
}
