import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './Done.module.css';

export type DoneSize = 'base' | 'mini';
export type DoneLevel = 'primary' | 'secondary' | 'tertiary';

export interface DoneProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Icon content (inline SVG for tick-circle-16-filled) */
  children: ReactNode;
  /** Size variant: base (24px) or mini (20px) */
  size?: DoneSize;
  /** Visual level */
  level?: DoneLevel;
  /** Show "Done" text label alongside icon */
  label?: boolean;
  /** Custom label text (defaults to "Done") */
  labelText?: string;
  /** Hidden state — invisible but occupies space */
  hidden?: boolean;
}

export function Done({
  children,
  size = 'base',
  level = 'primary',
  label = false,
  labelText = 'Done',
  hidden = false,
  disabled,
  className,
  ...rest
}: DoneProps) {
  const classes = [
    'mds-done',
    `mds-done--${level}`,
    size === 'mini' ? 'mds-done--mini' : '',
    label ? 'mds-done--label' : '',
    hidden ? 'mds-done--hidden' : '',
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
      aria-label={label ? undefined : 'Done'}
      {...rest}
    >
      {children}
      {label && <span className="mds-done__label">{labelText}</span>}
    </button>
  );
}
