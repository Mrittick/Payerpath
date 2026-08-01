import type { ReactNode } from 'react';
import { Icon } from '../../../Assets/Icon/Icon';
import { TickBold12, InformationCircleRegular16 } from '../../../Assets/Icon/icons';
import { MoreInfo } from '../../Sub-Controls/MoreInfo/MoreInfo';
import './DropdownItem.module.css';

export type DropdownItemMode = 'single' | 'multi';
export type DropdownItemOrientation = 'left' | 'right';
export type DropdownItemState = 'default' | 'hover' | 'pressed' | 'disabled';

export interface DropdownItemProps {
  /** Unique ID for aria-activedescendant (keyboard nav) */
  id?: string;
  /** Item label text */
  label: string;
  /** Selection mode */
  mode?: DropdownItemMode;
  /** Tick/checkbox icon placement */
  orientation?: DropdownItemOrientation;
  /** Whether the item is selected */
  checked?: boolean;
  /** Visual state (hover/pressed also via CSS pseudo-classes) */
  state?: DropdownItemState;
  /** Whether the item is keyboard-highlighted */
  highlighted?: boolean;
  /** Truncate label text with ellipsis */
  truncate?: boolean;
  /** Show MoreInfo icon button */
  moreInfo?: boolean;
  /** Callback when MoreInfo icon is clicked */
  onMoreInfoClick?: () => void;
  /** Callback when item is selected */
  onSelect?: () => void;
  /** Extra className */
  className?: string;
}

export function DropdownItem({
  id,
  label,
  mode = 'single',
  orientation = 'left',
  checked = false,
  state = 'default',
  highlighted = false,
  truncate = false,
  moreInfo = false,
  onMoreInfoClick,
  onSelect,
  className,
}: DropdownItemProps) {
  const classes = [
    'mds-dropdown-item',
    checked && 'mds-dropdown-item--checked',
    state === 'hover' && 'mds-dropdown-item--hover',
    state === 'pressed' && 'mds-dropdown-item--pressed',
    state === 'disabled' && 'mds-dropdown-item--disabled',
    highlighted && 'mds-dropdown-item--highlighted',
    truncate && 'mds-dropdown-item--truncate',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const isDisabled = state === 'disabled';

  /* Tick icon for SingleSelect */
  const tickIcon = (
    <span className="mds-dropdown-item__tick">
      <Icon size="tiny">{TickBold12}</Icon>
    </span>
  );

  /* Checkbox for MultiSelect */
  const checkbox = (
    <span className="mds-dropdown-item__checkbox">
      <span className="mds-dropdown-item__checkbox-box">
        <span className="mds-dropdown-item__checkbox-icon">
          <Icon size="tiny">{TickBold12}</Icon>
        </span>
      </span>
    </span>
  );

  /* Main content — label with optional tick (SingleSelect) */
  const labelEl = (
    <span className="mds-dropdown-item__label">{label}</span>
  );

  /* Build content based on mode and orientation */
  let content: ReactNode;

  if (mode === 'single') {
    if (orientation === 'left') {
      content = (
        <span className="mds-dropdown-item__content">
          {tickIcon}
          {labelEl}
        </span>
      );
    } else {
      /* Right: label first, then tick icon outside content */
      content = (
        <>
          <span className="mds-dropdown-item__content">
            {labelEl}
          </span>
          {tickIcon}
        </>
      );
    }
  } else {
    /* MultiSelect */
    if (orientation === 'left') {
      content = (
        <>
          {checkbox}
          <span className="mds-dropdown-item__content">
            {labelEl}
          </span>
        </>
      );
    } else {
      content = (
        <>
          <span className="mds-dropdown-item__content">
            {labelEl}
          </span>
          {checkbox}
        </>
      );
    }
  }

  return (
    <div
      id={id}
      className={classes}
      role="option"
      aria-selected={checked}
      aria-disabled={isDisabled || undefined}
      onClick={!isDisabled ? onSelect : undefined}
    >
      {content}
      {moreInfo && (
        <span className="mds-dropdown-item__more-info">
          <MoreInfo
            icon={
              <Icon size="mini">{InformationCircleRegular16}</Icon>
            }
            text=""
            onClick={(e) => {
              e.stopPropagation();
              onMoreInfoClick?.();
            }}
          />
        </span>
      )}
    </div>
  );
}
