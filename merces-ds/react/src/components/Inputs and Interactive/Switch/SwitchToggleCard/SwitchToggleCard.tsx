import './SwitchToggleCard.module.css';

/* ==========================================================================
   Merces Design System — Switch Toggle Card
   Figma: Switch Toggle Card (1056:9547) — 16 variants
   Mode(True/False) × State(Default/Hover/Pressed/Disabled)
   × Orientation(Span/Stack)

   Structure:
     Root > Frame (card bg) > Text Frame + Switch Frame > Track > Knob
     Span: [Text Frame, Switch Frame]
     Stack: [Switch Frame, Text Frame]  (via flex-direction: row-reverse)
   ========================================================================== */

export type SwitchToggleCardState = 'default' | 'hover' | 'pressed' | 'disabled';
export type SwitchToggleCardOrientation = 'span' | 'stack';

export interface SwitchToggleCardProps {
  /** Label text */
  label?: string;
  /** Whether switch is ON */
  on?: boolean;
  /** Visual state override */
  state?: SwitchToggleCardState;
  /** Layout orientation: span = text first, stack = switch first */
  orientation?: SwitchToggleCardOrientation;
  /** Called when toggled */
  onChange?: (nextOn: boolean) => void;
  /** Extra className */
  className?: string;
}

export function SwitchToggleCard({
  label = 'Switch Toggle Card',
  on = false,
  state = 'default',
  orientation = 'span',
  onChange,
  className,
}: SwitchToggleCardProps) {
  const isDisabled = state === 'disabled';

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
    'mds-switch-card',
    on && 'mds-switch-card--on',
    orientation === 'stack' && 'mds-switch-card--stack',
    state === 'hover' && 'mds-switch-card--hover',
    state === 'pressed' && 'mds-switch-card--pressed',
    state === 'disabled' && 'mds-switch-card--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

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
      <span className="mds-switch-card__frame">
        <span className="mds-switch-card__text-frame">
          <span className="mds-switch-card__label">{label}</span>
        </span>
        <span className="mds-switch-card__switch">
          <span className="mds-switch-card__track">
            <span className="mds-switch-card__knob" />
          </span>
        </span>
      </span>
    </span>
  );
}
