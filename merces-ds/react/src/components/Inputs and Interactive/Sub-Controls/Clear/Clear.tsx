import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './Clear.module.css';

export type ClearSize = 'base' | 'mini';
export type ClearLevel = 'primary' | 'secondary' | 'tertiary';

export interface ClearProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Icon content (inline SVG for cross-16-filled) */
  children: ReactNode;
  /** Size variant: base (24px) or mini (20px) */
  size?: ClearSize;
  /** Visual level */
  level?: ClearLevel;
  /** Hidden state — invisible but occupies space */
  hidden?: boolean;
}

export function Clear({
  children,
  size = 'base',
  level = 'primary',
  hidden = false,
  disabled,
  className,
  ...rest
}: ClearProps) {
  const classes = [
    'mds-clear',
    `mds-clear--${level}`,
    size === 'mini' ? 'mds-clear--mini' : '',
    hidden ? 'mds-clear--hidden' : '',
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
      aria-label="Clear"
      {...rest}
    >
      {children}
    </button>
  );
}
