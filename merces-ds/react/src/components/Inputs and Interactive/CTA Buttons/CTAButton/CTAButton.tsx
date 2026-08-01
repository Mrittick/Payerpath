import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './CTAButton.module.css';

export type CTAColorTheme = 'brand' | 'danger' | 'caution' | 'emphasis' | 'neutral';
export type CTAType = 'primary' | 'secondary' | 'tertiary' | 'quaternary';
export type CTASize = 'base' | 'mini';
export type CTAVariant = 'textOnly' | 'iconOnly' | 'iconLeft' | 'iconRight';

/** Kebab-case map for variant -> CTA layout CSS modifier */
const variantClass: Record<CTAVariant, string> = {
  textOnly: 'mds-cta--text-only',
  iconOnly: 'mds-cta--icon-only',
  iconLeft: 'mds-cta--icon-left',
  iconRight: 'mds-cta--icon-right',
};

export interface CTAButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> {
  /** Button label text (omit for iconOnly) */
  label?: string;
  /** Icon content (inline SVG) — required for iconOnly/iconLeft/iconRight */
  icon?: ReactNode;
  /** Colour theme */
  colorTheme?: CTAColorTheme;
  /** Button type (visual hierarchy) */
  ctaType?: CTAType;
  /** Size */
  size?: CTASize;
  /** Layout variant */
  variant?: CTAVariant;
  /** Toggle state (pressed on/off) */
  toggle?: boolean;
  /** Programmatic focus ring */
  focus?: boolean;
  /** HTML button type attribute */
  htmlType?: 'button' | 'submit' | 'reset';
}

export function CTAButton({
  label = 'Button',
  icon,
  colorTheme = 'brand',
  ctaType = 'primary',
  size = 'base',
  variant = 'textOnly',
  toggle = false,
  focus = false,
  htmlType = 'button',
  disabled,
  className,
  ...rest
}: CTAButtonProps) {
  const isIconOnly = variant === 'iconOnly';
  const iconSize = size === 'mini' ? 'mds-icon mds-icon--mini' : 'mds-icon mds-icon--base';

  const classes = [
    'mds-btn',                    /* shared base */
    'mds-cta',                    /* CTA layout: centered, self-sizing */
    `mds-btn--${colorTheme}`,     /* shared theme */
    `mds-btn--${ctaType}`,        /* shared type */
    `mds-cta--${size}`,           /* CTA size */
    variantClass[variant],        /* CTA variant */
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
