import type { ButtonHTMLAttributes } from 'react';
import './Tab.module.css';

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */

export type TabHierarchy = 'level01' | 'level02';
export type TabSize = 'base' | 'mini';
export type TabState = 'default' | 'hover' | 'pressed' | 'disabled';

export interface TabProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Hierarchy: level01 = pill, level02 = underline */
  hierarchy?: TabHierarchy;
  /** Size variant */
  size?: TabSize;
  /** Tab label text */
  label?: string;
  /** Visual state (hover/pressed also work via CSS pseudo-classes) */
  state?: TabState;
  /** Whether this tab is the currently active one */
  isCurrent?: boolean;
  /** Programmatic focus ring */
  focus?: boolean;
  /** HTML button type attribute */
  htmlType?: 'button' | 'submit' | 'reset';
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export function Tab({
  hierarchy = 'level01',
  size = 'base',
  label = 'Tab item',
  state = 'default',
  isCurrent = false,
  focus = false,
  htmlType = 'button',
  className,
  ...rest
}: TabProps) {
  const isDisabled = state === 'disabled';

  /* ---- BEM class assembly ---- */
  const classes = [
    'mds-tab',
    `mds-tab--${hierarchy}`,
    `mds-tab--${size}`,
    isCurrent && 'mds-tab--current',
    state === 'hover' && 'mds-tab--hover',
    state === 'pressed' && 'mds-tab--pressed',
    isDisabled && 'mds-tab--disabled',
    focus && 'mds-tab--focus',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={htmlType}
      className={classes}
      disabled={isDisabled}
      aria-current={isCurrent ? 'page' : undefined}
      {...rest}
    >
      <span className="mds-tab__inner">
        <span className="mds-tab__content">
          <span className="mds-tab__label">{label}</span>
        </span>
      </span>
    </button>
  );
}
