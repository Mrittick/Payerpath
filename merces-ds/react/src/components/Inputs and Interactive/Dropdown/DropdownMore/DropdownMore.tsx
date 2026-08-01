import { Icon } from '../../../Assets/Icon/Icon';
import { FixRegular16 } from '../../../Assets/Icon/icons';
import './DropdownMore.module.css';

export interface DropdownMoreProps {
  /** Display text */
  text?: string;
  /** Visual state */
  state?: 'default' | 'hover' | 'pressed' | 'disabled';
  /** Callback on click */
  onClick?: () => void;
  /** Extra className */
  className?: string;
}

export function DropdownMore({
  text = 'More...',
  state = 'default',
  onClick,
  className,
}: DropdownMoreProps) {
  const isDisabled = state === 'disabled';
  const classes = [
    'mds-dropdown-more',
    state === 'hover' && 'mds-dropdown-more--hover',
    state === 'pressed' && 'mds-dropdown-more--pressed',
    state === 'disabled' && 'mds-dropdown-more--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled || undefined}
    >
      <span className="mds-dropdown-more__label">{text}</span>
      <span className="mds-dropdown-more__icon">
        <Icon size="mini">{FixRegular16}</Icon>
      </span>
    </button>
  );
}
