import './SwitchToggle.module.css';

/* ==========================================================================
   Merces Design System — Switch Toggle
   Figma: Switch Toggle (201:3771) — 96 variants
   Size(Base/Mini) × Group(False/True) × Orientation(Left/Right)
   × Mode(False/True) × State(Default/Hover/Pressed/Disabled)
   × Focus(False/True)

   Structure — Group=False (standalone):
     Root > Track > Knob

   Structure — Group=True (with label):
     Root > Track + Text Frame > Text
     Left: [Track, Text Frame] | Right: [Text Frame, Track]
   ========================================================================== */

export type SwitchToggleSize = 'base' | 'mini';
export type SwitchToggleState = 'default' | 'hover' | 'pressed' | 'disabled';
export type SwitchToggleOrientation = 'left' | 'right';

export interface SwitchToggleProps {
  /** Label text — when provided, renders Group=True layout */
  label?: string;
  /** Whether switch is ON (Mode=True) */
  on?: boolean;
  /** Visual state override */
  state?: SwitchToggleState;
  /** Size variant */
  size?: SwitchToggleSize;
  /** Label position relative to switch (Group=True only) */
  orientation?: SwitchToggleOrientation;
  /** Focus ring visibility */
  focus?: boolean;
  /** Called when switch is toggled */
  onChange?: (nextOn: boolean) => void;
  /** Extra className */
  className?: string;
}

export function SwitchToggle({
  label,
  on = false,
  state = 'default',
  size = 'base',
  orientation = 'left',
  focus = false,
  onChange,
  className,
}: SwitchToggleProps) {
  const isDisabled = state === 'disabled';
  const isGroup = label !== undefined;

  const handleClick = () => {
    if (isDisabled || !onChange) return;
    onChange(!on);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  const rootClasses = [
    'mds-switch',
    size === 'mini' && 'mds-switch--mini',
    isGroup && 'mds-switch--group',
    isGroup && orientation === 'right' && 'mds-switch--right',
    on && 'mds-switch--on',
    state === 'hover' && 'mds-switch--hover',
    state === 'pressed' && 'mds-switch--pressed',
    state === 'disabled' && 'mds-switch--disabled',
    focus && 'mds-switch--focus',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const switchTrack = (
    <span className="mds-switch__track">
      <span className="mds-switch__knob" />
    </span>
  );

  /* Group=False: just the track */
  if (!isGroup) {
    return (
      <span
        className={rootClasses}
        role="switch"
        aria-checked={on}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {switchTrack}
      </span>
    );
  }

  /* Group=True: track + text frame
     flex-direction: row-reverse handles Right orientation via CSS */
  return (
    <span
      className={rootClasses}
      role="switch"
      aria-checked={on}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {switchTrack}
      <span className="mds-switch__text-frame">
        <span className="mds-switch__label">{label}</span>
      </span>
    </span>
  );
}
