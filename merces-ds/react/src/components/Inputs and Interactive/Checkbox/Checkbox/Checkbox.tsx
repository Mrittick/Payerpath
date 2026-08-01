import { Icon } from '../../../Assets/Icon/Icon';
import {
  TickBold12,
  TickBold16,
  DashRegular12,
  DashRegular16,
} from '../../../Assets/Icon/icons';
import './Checkbox.module.css';

/* ==========================================================================
   Merces Design System — Checkbox (Base)
   Figma: Checkbox (119:5296) — 144 variants
   Group(True/False) × Size(Mini/Base) × Orientation(Left/Right)
   × Type(Unchecked/Checked/Mixed) × State(Default/Hover/Pressed/Disabled)
   × Focus(True/False)

   Structure — Group=False (standalone):
     Root > Box > Icon

   Structure — Group=True (with label):
     Root > Box Frame > Box > Icon
          > Text Frame > Text
   ========================================================================== */

export type CheckboxType = 'unchecked' | 'checked' | 'mixed';
export type CheckboxState = 'default' | 'hover' | 'pressed' | 'disabled';
export type CheckboxSize = 'mini' | 'base';
export type CheckboxOrientation = 'left' | 'right';

export interface CheckboxProps {
  /** Current check type */
  type?: CheckboxType;
  /** Visual state (hover/pressed driven by CSS for interactive use) */
  state?: CheckboxState;
  /** Size variant */
  size?: CheckboxSize;
  /** Focus ring visibility */
  focus?: boolean;
  /** Label text — when provided, renders Group=True layout */
  label?: string;
  /** Label placement relative to checkbox */
  orientation?: CheckboxOrientation;
  /** Called when checkbox is toggled */
  onChange?: (nextType: CheckboxType) => void;
  /** Extra className */
  className?: string;
}

/** Icon lookup: [size][type] → React SVG element */
const ICONS: Record<CheckboxSize, Record<'checked' | 'mixed', React.ReactElement>> = {
  base: { checked: TickBold16, mixed: DashRegular16 },
  mini: { checked: TickBold12, mixed: DashRegular12 },
};

/** Icon wrapper size name: base → mini icon wrapper, mini → tiny icon wrapper */
const ICON_SIZE: Record<CheckboxSize, 'mini' | 'tiny'> = {
  base: 'mini',
  mini: 'tiny',
};

export function Checkbox({
  type = 'unchecked',
  state = 'default',
  size = 'base',
  focus = false,
  label,
  orientation = 'left',
  onChange,
  className,
}: CheckboxProps) {
  const isDisabled = state === 'disabled';
  const hasLabel = label != null && label.length > 0;

  const handleClick = () => {
    if (isDisabled || !onChange) return;
    /* Toggle: unchecked → checked, checked/mixed → unchecked */
    onChange(type === 'unchecked' ? 'checked' : 'unchecked');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  const rootClasses = [
    'mds-checkbox',
    `mds-checkbox--${size}`,
    `mds-checkbox--${type}`,
    state === 'hover' && 'mds-checkbox--hover',
    state === 'pressed' && 'mds-checkbox--pressed',
    state === 'disabled' && 'mds-checkbox--disabled',
    focus && 'mds-checkbox--focus',
    hasLabel && 'mds-checkbox--group',
    hasLabel && orientation === 'right' && 'mds-checkbox--right',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  /* The inner box (always rendered) */
  const box = (
    <span className="mds-checkbox__box">
      <span className="mds-checkbox__icon">
        <Icon size={ICON_SIZE[size]}>
          {type === 'mixed' ? ICONS[size].mixed : ICONS[size].checked}
        </Icon>
      </span>
    </span>
  );

  /* Group=True: box is wrapped in Box Frame; text is in Text Frame */
  if (hasLabel) {
    const boxFrame = (
      <span className="mds-checkbox__box-frame">{box}</span>
    );
    const textFrame = (
      <span className="mds-checkbox__text-frame">
        <span className="mds-checkbox__label">{label}</span>
      </span>
    );
    return (
      <span
        className={rootClasses}
        role="checkbox"
        aria-checked={type === 'mixed' ? 'mixed' : type === 'checked'}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {orientation === 'left' ? (
          <>
            {boxFrame}
            {textFrame}
          </>
        ) : (
          <>
            {textFrame}
            {boxFrame}
          </>
        )}
      </span>
    );
  }

  /* Group=False: box is a direct child — no Box Frame wrapper */
  return (
    <span
      className={rootClasses}
      role="checkbox"
      aria-checked={type === 'mixed' ? 'mixed' : type === 'checked'}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {box}
    </span>
  );
}
