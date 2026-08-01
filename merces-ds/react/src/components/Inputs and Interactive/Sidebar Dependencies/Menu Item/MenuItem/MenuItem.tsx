import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './MenuItem.module.css';

export type MenuItemType = 'h01' | 'h00';
export type MenuItemSize = 'base' | 'mini';
export type MenuItemState =
  | 'default'
  | 'hover'
  | 'pressed'
  | 'current-default'
  | 'current-strong'
  | 'disabled';

export interface MenuItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> {
  /** Menu item type: h01 = standard, h00 = category header */
  menuType?: MenuItemType;
  /** Size */
  size?: MenuItemSize;
  /** Label text */
  label?: string;
  /** Leading icon (inline SVG from icons.tsx) */
  icon?: ReactNode;
  /** Whether to show text (default: true) */
  showText?: boolean;
  /** Whether to show icon (default: false) */
  showIcon?: boolean;
  /** Visual state */
  state?: MenuItemState;
  /** Programmatic focus ring */
  focus?: boolean;
  /** HTML button type attribute */
  htmlType?: 'button' | 'submit' | 'reset';
}

export function MenuItem({
  menuType = 'h01',
  size = 'base',
  label = 'Label Text',
  icon,
  showText = true,
  showIcon = false,
  state = 'default',
  focus = false,
  htmlType = 'button',
  disabled,
  className,
  ...rest
}: MenuItemProps) {
  /* h00 is always mini, text-only, non-interactive */
  const effectiveSize = menuType === 'h00' ? 'mini' : size;
  const effectiveShowIcon = menuType === 'h00' ? false : showIcon;
  const effectiveShowText = menuType === 'h00' ? true : showText;

  /* Determine content variant */
  const hasText = effectiveShowText;
  const hasIcon = effectiveShowIcon && icon;
  let contentVariant: string;
  if (hasText && hasIcon) {
    contentVariant = 'text-icon';
  } else if (hasIcon) {
    contentVariant = 'icon-only';
  } else {
    contentVariant = 'text-only';
  }

  const isDisabled = disabled || state === 'disabled';

  /* Icon size class: Base icons = 20px (base), Mini icons = 16px (mini) */
  const iconSizeClass = effectiveSize === 'mini' ? 'mds-icon mds-icon--mini' : 'mds-icon mds-icon--base';

  const classes = [
    'mds-menu-item',
    `mds-menu-item--${menuType}`,
    `mds-menu-item--${effectiveSize}`,
    `mds-menu-item--${contentVariant}`,
    `mds-menu-item--${state}`,
    focus ? 'mds-menu-item--focus' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  /* h00 renders as a non-interactive label element */
  if (menuType === 'h00') {
    return (
      <div className={classes} role="heading" aria-level={2}>
        <div className="mds-menu-item__inner">
          <span className="mds-menu-item__label">{label}</span>
        </div>
      </div>
    );
  }

  return (
    <button
      type={htmlType}
      className={classes}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-current={
        state === 'current-default' || state === 'current-strong'
          ? 'page'
          : undefined
      }
      aria-label={contentVariant === 'icon-only' ? (rest['aria-label'] ?? label) : undefined}
      {...rest}
    >
      <div className="mds-menu-item__inner">
        {hasIcon && <span className={iconSizeClass}>{icon}</span>}
        {hasText && <span className="mds-menu-item__label">{label}</span>}
      </div>
    </button>
  );
}
