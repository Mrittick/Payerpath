import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './SpanButton.module.css';

export type SpanColorTheme = 'brand' | 'danger' | 'caution' | 'neutral';
export type SpanType = 'primary' | 'secondary' | 'tertiary' | 'quaternary';
export type SpanSize = 'base' | 'mini';
export type SpanVariant = 'textOnly' | 'iconOnly' | 'iconLeft' | 'iconRight';

/** Kebab-case map for variant -> Span layout CSS modifier */
const variantClass: Record<SpanVariant, string> = {
  textOnly: 'mds-span--text-only',
  iconOnly: 'mds-span--icon-only',
  iconLeft: 'mds-span--icon-left',
  iconRight: 'mds-span--icon-right',
};

export interface SpanButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> {
  /** Button label text (omit for iconOnly) */
  label?: string;
  /** Icon content (inline SVG) — required for iconOnly/iconLeft/iconRight */
  icon?: ReactNode;
  /** Colour theme (no emphasis for Span) */
  colorTheme?: SpanColorTheme;
  /** Button type (visual hierarchy) */
  spanType?: SpanType;
  /** Size */
  size?: SpanSize;
  /** Layout variant */
  variant?: SpanVariant;
  /** Toggle state (pressed on/off) */
  toggle?: boolean;
  /** Programmatic focus ring */
  focus?: boolean;
  /** HTML button type attribute */
  htmlType?: 'button' | 'submit' | 'reset';
}

export function SpanButton({
  label = 'Button',
  icon,
  colorTheme = 'brand',
  spanType = 'primary',
  size = 'base',
  variant = 'textOnly',
  toggle = false,
  focus = false,
  htmlType = 'button',
  disabled,
  className,
  ...rest
}: SpanButtonProps) {
  const isIconOnly = variant === 'iconOnly';
  const iconSize = size === 'mini' ? 'mds-icon mds-icon--mini' : 'mds-icon mds-icon--base';

  const classes = [
    'mds-btn',                    /* shared base */
    'mds-span',                   /* Span layout: stretching, full-width */
    `mds-btn--${colorTheme}`,     /* shared theme */
    `mds-btn--${spanType}`,       /* shared type */
    `mds-span--${size}`,          /* Span size */
    variantClass[variant],        /* Span variant */
    toggle ? 'mds-btn--toggle' : '',
    disabled ? 'mds-btn--disabled' : '',
    focus ? 'mds-btn--focus' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={htmlType}
      className={classes}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-pressed={toggle || undefined}
      aria-label={isIconOnly ? (rest['aria-label'] ?? label) : undefined}
      {...rest}
    >
      {(variant === 'iconLeft' || variant === 'iconOnly') && icon && (
        <span className={iconSize}>{icon}</span>
      )}
      {!isIconOnly && <span className="mds-btn__label">{label}</span>}
      {variant === 'iconRight' && icon && (
        <span className={iconSize}>{icon}</span>
      )}
    </button>
  );
}
