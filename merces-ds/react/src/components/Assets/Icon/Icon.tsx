import type { CSSProperties, ReactNode } from 'react';
import './Icon.module.css';

export type IconSize = 'tiny' | 'mini' | 'base' | 'large' | 'huge';

export type IconColor =
  | 'default'
  | 'sub'
  | 'disabled'
  | 'error'
  | 'warning'
  | 'inverted'
  | 'brand'
  | 'accent';

export interface IconProps {
  /** Inline SVG content passed as children */
  children: ReactNode;
  /** Size variant — maps to mds-icon--{size} */
  size?: IconSize;
  /** Semantic color — maps to mds-icon--color-{color} */
  color?: IconColor;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Accessible label. When set, role="img" is used. When omitted, aria-hidden="true". */
  label?: string;
}

const SIZE_CLASS: Record<IconSize, string> = {
  tiny:  'mds-icon--tiny',
  mini:  'mds-icon--mini',
  base:  'mds-icon--base',
  large: 'mds-icon--large',
  huge:  'mds-icon--huge',
};

const COLOR_CLASS: Record<IconColor, string> = {
  default:  'mds-icon--color-default',
  sub:      'mds-icon--color-sub',
  disabled: 'mds-icon--color-disabled',
  error:    'mds-icon--color-error',
  warning:  'mds-icon--color-warning',
  inverted: 'mds-icon--color-inverted',
  brand:    'mds-icon--color-brand',
  accent:   'mds-icon--color-accent',
};

export function Icon({
  children,
  size = 'base',
  color,
  className,
  style,
  label,
}: IconProps) {
  const classes = [
    'mds-icon',
    SIZE_CLASS[size],
    color ? COLOR_CLASS[color] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      style={style}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {children}
    </span>
  );
}
