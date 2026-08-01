import type { ReactNode } from 'react';
import './DropdownAction.module.css';

export interface DropdownActionProps {
  /** Action button text */
  text: string;
  /** Icon element (pass raw SVG from icons.tsx) */
  icon: ReactNode;
  /** Visual state */
  state?: 'default' | 'hover' | 'pressed';
  /** Callback on click */
  onClick?: () => void;
  /** Extra className */
  className?: string;
}

export function DropdownAction({
  text,
  icon,
  state = 'default',
  onClick,
  className,
}: DropdownActionProps) {
  const classes = [
    'mds-dropdown-action',
    state === 'hover' && 'mds-dropdown-action--hover',
    state === 'pressed' && 'mds-dropdown-action--pressed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <button type="button" className="mds-dropdown-action__button" onClick={onClick}>
        <span className="mds-dropdown-action__text">{text}</span>
        <span className="mds-dropdown-action__icon">{icon}</span>
      </button>
    </div>
  );
}
