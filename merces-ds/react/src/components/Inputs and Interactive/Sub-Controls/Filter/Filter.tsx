import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { ActiveIndicator } from '../ActiveIndicator/ActiveIndicator';
import type { ActiveIndicatorState } from '../ActiveIndicator/ActiveIndicator';
import './Filter.module.css';

export type FilterMode = 'default' | 'invoked' | 'disabled' | 'hidden';

export interface FilterProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Icon content (inline SVG for filter-20-regular) */
  children: ReactNode;
  /** Visual mode */
  mode?: FilterMode;
  /** Programmatic focus ring (CSS :focus-visible handles keyboard focus) */
  focus?: boolean;
  /** Shows active state: inset border + ActiveIndicator dot */
  isActive?: boolean;
  /** ActiveIndicator stroke state (syncs with parent hover/invoked) */
  indicatorState?: ActiveIndicatorState;
}

export function Filter({
  children,
  mode = 'default',
  focus = false,
  isActive = false,
  indicatorState = 'default',
  className,
  ...rest
}: FilterProps) {
  const isDisabled = mode === 'disabled';

  const classes = [
    'mds-filter',
    `mds-filter--${mode}`,
    focus ? 'mds-filter--focus' : '',
    isActive ? 'mds-filter--active' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-label="Filter"
      aria-pressed={mode === 'invoked' || undefined}
      {...rest}
    >
      {children}
      {isActive && <ActiveIndicator state={indicatorState} />}
    </button>
  );
}
