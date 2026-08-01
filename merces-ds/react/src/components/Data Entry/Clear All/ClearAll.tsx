import type { ButtonHTMLAttributes } from 'react';
import { Icon } from '../../Assets/Icon/Icon';
import { CrossBold16 } from '../../Assets/Icon/icons';
import './ClearAll.module.css';

export interface ClearAllProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Button label — defaults to "Clear all" */
  label?: string;
  /** Additional class name */
  className?: string;
}

export function ClearAll({
  label = 'Clear all',
  disabled,
  className,
  ...rest
}: ClearAllProps) {
  const classes = ['mds-clear-all', className].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      {...rest}
    >
      <span className="mds-clear-all__text">{label}</span>
      <span className="mds-clear-all__icon">
        <Icon size="mini">{CrossBold16}</Icon>
      </span>
    </button>
  );
}
