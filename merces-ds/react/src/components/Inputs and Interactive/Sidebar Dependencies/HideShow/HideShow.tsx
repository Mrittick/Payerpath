import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './HideShow.module.css';

export type HideShowProduct = 'payerpath' | 'echart-coder';

export interface HideShowProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Whether the sidebar is collapsed */
  isCollapsed?: boolean;
  /** Product/theme variant */
  product?: HideShowProduct;
  /** Icon for expanded state (Sidebar-Collapse) — pass raw SVG from icons.tsx */
  expandedIcon?: ReactNode;
  /** Icon for collapsed state (Sidebar-Expand) — pass raw SVG from icons.tsx */
  collapsedIcon?: ReactNode;
}

export function HideShow({
  isCollapsed = false,
  product = 'payerpath',
  expandedIcon,
  collapsedIcon,
  className,
  ...rest
}: HideShowProps) {
  const currentIcon = isCollapsed ? collapsedIcon : expandedIcon;

  const classes = [
    'mds-hide-show',
    `mds-hide-show--${product}`,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-expanded={!isCollapsed}
      {...rest}
    >
      {currentIcon && (
        <span className="mds-icon mds-icon--large">{currentIcon}</span>
      )}
    </button>
  );
}
