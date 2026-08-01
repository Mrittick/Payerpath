import type { ReactNode } from 'react';
import { Icon } from '../../../Assets/Icon/Icon';
import { InformationCircleRegular16 } from '../../../Assets/Icon/icons';
import { MoreInfo } from '../../Sub-Controls/MoreInfo/MoreInfo';
import './DropdownGroup.module.css';

export interface DropdownGroupProps {
  /** Label text displayed above or beside the dropdown */
  label: string;
  /** Layout direction */
  layout?: 'vertical' | 'horizontal';
  /** Equal width split between label and dropdown (horizontal only) */
  span?: boolean;
  /** Show MoreInfo icon beside label */
  moreInfo?: boolean;
  /** Callback when MoreInfo icon is clicked */
  onMoreInfoClick?: () => void;
  /** Dropdown component */
  children: ReactNode;
  /** Extra className */
  className?: string;
}

export function DropdownGroup({
  label,
  layout = 'vertical',
  span = false,
  moreInfo = false,
  onMoreInfoClick,
  children,
  className,
}: DropdownGroupProps) {
  const classes = [
    'mds-dropdown-group',
    `mds-dropdown-group--${layout}`,
    span && 'mds-dropdown-group--span',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className="mds-dropdown-group__label">
        <span>{label}</span>
        {moreInfo && (
          <MoreInfo
            icon={<Icon size="mini">{InformationCircleRegular16}</Icon>}
            onClick={onMoreInfoClick}
          />
        )}
      </div>
      <div className="mds-dropdown-group__dropdown">
        {children}
      </div>
    </div>
  );
}
