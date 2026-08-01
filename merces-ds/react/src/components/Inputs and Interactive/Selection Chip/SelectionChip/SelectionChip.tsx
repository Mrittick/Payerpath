import type { ButtonHTMLAttributes } from 'react';
import { Icon } from '../../../Assets/Icon/Icon';
import { CrossFilled16 } from '../../../Assets/Icon/icons';
import './SelectionChip.module.css';

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */

export type SelectionChipState = 'default' | 'hover' | 'pressed';

export interface SelectionChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Chip label text */
  label: string;
  /** Whether text wraps (True) or truncates with ellipsis (False) */
  wrap?: boolean;
  /** Visual state (hover/pressed also work via CSS pseudo-classes; prop allows demo control) */
  state?: SelectionChipState;
  /** Callback when chip is clicked to deselect */
  onDeselect?: () => void;
  /** HTML button type attribute */
  htmlType?: 'button' | 'submit' | 'reset';
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export function SelectionChip({
  label,
  wrap = true,
  state = 'default',
  onDeselect,
  htmlType = 'button',
  className,
  ...rest
}: SelectionChipProps) {
  /* ---- BEM class assembly ---- */
  const classes = [
    'mds-selection-chip',
    wrap ? 'mds-selection-chip--wrap' : 'mds-selection-chip--nowrap',
    state === 'hover' && 'mds-selection-chip--hover',
    state === 'pressed' && 'mds-selection-chip--pressed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={htmlType}
      className={classes}
      onClick={onDeselect}
      data-tooltip={!wrap ? label : undefined}
      {...rest}
    >
      <span className="mds-selection-chip__label">{label}</span>
      <span className="mds-selection-chip__icon">
        <Icon size="mini">{CrossFilled16}</Icon>
      </span>
    </button>
  );
}
