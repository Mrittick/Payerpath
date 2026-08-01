import './RadioPicker.module.css';

/* ==========================================================================
   Merces Design System — Radio Picker
   Figma: Radio Picker (211:1781) — 96 variants
   Size(Base/Mini) × Group(False/True) × Orientation(Left/Right)
   × Mode(False/True) × State(Default/Hover/Pressed/Disabled)
   × Focus(False/True)

   Structure — Group=False (standalone):
     Root > Button (focus wrapper) > Circle

   Structure — Group=True (with label):
     Root > Button > Circle + Text Frame > Text
     Left: [Button, Text Frame] | Right: [Text Frame, Button]
   ========================================================================== */

export type RadioPickerSize = 'base' | 'mini';
export type RadioPickerState = 'default' | 'hover' | 'pressed' | 'disabled';
export type RadioPickerOrientation = 'left' | 'right';

export interface RadioPickerProps {
  /** Label text — when provided, renders Group=True layout */
  label?: string;
  /** Whether this radio is selected (Mode=True) */
  selected?: boolean;
  /** Visual state override (hover/pressed driven by CSS for interactive use) */
  state?: RadioPickerState;
  /** Size variant */
  size?: RadioPickerSize;
  /** Label position relative to radio dot (Group=True only) */
  orientation?: RadioPickerOrientation;
  /** Focus ring visibility */
  focus?: boolean;
  /** Called when radio is selected */
  onSelect?: () => void;
  /** Extra className */
  className?: string;
}

export function RadioPicker({
  label,
  selected = false,
  state = 'default',
  size = 'base',
  orientation = 'left',
  focus = false,
  onSelect,
  className,
}: RadioPickerProps) {
  const isDisabled = state === 'disabled';
  const isGroup = label !== undefined;

  const handleClick = () => {
    if (isDisabled || !onSelect) return;
    onSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  const rootClasses = [
    'mds-radio',
    size === 'mini' && 'mds-radio--mini',
    isGroup && 'mds-radio--group',
    isGroup && orientation === 'right' && 'mds-radio--right',
    selected && 'mds-radio--selected',
    state === 'hover' && 'mds-radio--hover',
    state === 'pressed' && 'mds-radio--pressed',
    state === 'disabled' && 'mds-radio--disabled',
    focus && 'mds-radio--focus',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const radioButton = (
    <span className="mds-radio__button">
      <span className="mds-radio__circle" />
    </span>
  );

  /* Group=False: just the radio button */
  if (!isGroup) {
    return (
      <span
        className={rootClasses}
        role="radio"
        aria-checked={selected}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {radioButton}
      </span>
    );
  }

  /* Group=True: radio button + text frame
     flex-direction: row-reverse handles Right orientation via CSS */
  return (
    <span
      className={rootClasses}
      role="radio"
      aria-checked={selected}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {radioButton}
      <span className="mds-radio__text-frame">
        <span className="mds-radio__label">{label}</span>
      </span>
    </span>
  );
}
