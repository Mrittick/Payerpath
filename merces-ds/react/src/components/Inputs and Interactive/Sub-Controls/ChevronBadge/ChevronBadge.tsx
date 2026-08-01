import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './ChevronBadge.module.css';

export type ChevronBadgeSize = 'base' | 'large' | 'huge';
export type ChevronBadgeDirection = 'down' | 'up' | 'left' | 'right';

export interface ChevronBadgeProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Icon content (inline SVG for chevron-{direction}-16-bold) */
  children: ReactNode;
  /** Size variant */
  size?: ChevronBadgeSize;
  /** Chevron direction — used for aria-label, icon selection is caller's responsibility */
  direction?: ChevronBadgeDirection;
  /** Active state (selected/toggled) */
  active?: boolean;
  /** Hidden state — invisible but occupies space */
  hidden?: boolean;
}

export function ChevronBadge({
  children,
  size = 'large',
  direction = 'down',
  active = false,
  hidden = false,
  disabled,
  className,
  ...rest
}: ChevronBadgeProps) {
  const classes = [
    'mds-chevron-badge',
    `mds-chevron-badge--${size}`,
    active ? 'mds-chevron-badge--active' : '',
    hidden ? 'mds-chevron-badge--hidden' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-label={`Chevron ${direction}`}
      {...rest}
    >
      {children}
    </button>
  );
}
