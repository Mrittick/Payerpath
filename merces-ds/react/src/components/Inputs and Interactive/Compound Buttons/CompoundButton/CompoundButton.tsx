import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './CompoundButton.module.css';

export type CompoundColorTheme = 'brand' | 'danger' | 'caution' | 'neutral';
export type CompoundType = 'primary' | 'secondary' | 'tertiary' | 'quaternary';
export type CompoundSize = 'base' | 'mini';
export type CompoundChevronPosition = 'left' | 'right';

export interface CompoundButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> {
  /** Button label text (omit or set showLabel=false for icon-only layout) */
  label?: string;
  /** Whether to render the text label (default: true) */
  showLabel?: boolean;
  /** Action icon content (inline SVG) — always rendered */
  icon: ReactNode;
  /** Chevron / directional icon content (inline SVG) — always rendered */
  chevron: ReactNode;
  /** Colour theme */
  colorTheme?: CompoundColorTheme;
  /** Button type (visual hierarchy) */
  compoundType?: CompoundType;
  /** Size */
  size?: CompoundSize;
  /** Chevron position — controls DOM order and padding direction */
  chevronPosition?: CompoundChevronPosition;
  /** Toggle state (pressed on/off) */
  toggle?: boolean;
  /** Programmatic focus ring */
  focus?: boolean;
  /** HTML button type attribute */
  htmlType?: 'button' | 'submit' | 'reset';
}

export function CompoundButton({
  label = 'Button',
  showLabel = true,
  icon,
  chevron,
  colorTheme = 'brand',
  compoundType = 'primary',
  size = 'base',
  chevronPosition = 'right',
  toggle = false,
  focus = false,
  htmlType = 'button',
  disabled,
  className,
  ...rest
}: CompoundButtonProps) {
  const iconSize = size === 'mini' ? 'mds-icon mds-icon--mini' : 'mds-icon mds-icon--base';

  const classes = [
    'mds-btn',                           /* shared base */
    'mds-compound',                      /* Compound layout: stretching, 2 icons */
    `mds-btn--${colorTheme}`,            /* shared theme */
    `mds-btn--${compoundType}`,          /* shared type */
    `mds-compound--${size}`,             /* Compound size */
    showLabel ? 'mds-compound--text-label' : 'mds-compound--no-label',
    `mds-compound--chevron-${chevronPosition}`,
    toggle ? 'mds-btn--toggle' : '',
    disabled ? 'mds-btn--disabled' : '',
    focus ? 'mds-btn--focus' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  /* DOM order changes based on chevron position:
     ChevronRight: [Icon] [Label?] [Chevron]
     ChevronLeft:  [Chevron] [Label?] [Icon]  */
  const isChevronLeft = chevronPosition === 'left';

  const actionIconEl = <span className={iconSize}>{icon}</span>;
  const chevronEl = <span className={`mds-compound__chevron ${iconSize}`}>{chevron}</span>;
  const labelEl = showLabel ? <span className="mds-btn__label">{label}</span> : null;

  return (
    <button
      type={htmlType}
      className={classes}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-pressed={toggle || undefined}
      aria-label={!showLabel ? (rest['aria-label'] ?? label) : undefined}
      {...rest}
    >
      {isChevronLeft ? chevronEl : actionIconEl}
      {labelEl}
      {isChevronLeft ? actionIconEl : chevronEl}
    </button>
  );
}
