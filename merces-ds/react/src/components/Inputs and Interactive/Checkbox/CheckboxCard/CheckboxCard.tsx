import { Checkbox } from '../Checkbox/Checkbox';
import type { CheckboxSize, CheckboxType } from '../Checkbox/Checkbox';
import './CheckboxCard.module.css';

/* ==========================================================================
   Merces Design System — Checkbox Card
   Figma: Checkbox Card (608:8661) — 16 variants
   Size(Base/Mini) × Selected(True/False) × State(Default/Hover/Pressed/Disabled)

   Structure:
     Root (card) > Checkbox (Group=False instance) + Text Frame > Text

   Layout:
     Root: HORIZONTAL, MIN×MIN, FIXED(200)×HUG, radius 12px, 1px INSIDE stroke
     Base: padding 12px, gap 10px | Mini: padding 8px, gap 8px
     Text Frame: FILL×HUG, padding base 4/4/0/0 mini 0, text wraps (HEIGHT)
   ========================================================================== */

export type CheckboxCardState = 'default' | 'hover' | 'pressed' | 'disabled';

export interface CheckboxCardProps {
  /** Label text displayed beside the checkbox */
  label?: string;
  /** Whether the card is selected (checked) */
  selected?: boolean;
  /** Visual state override (hover/pressed driven by CSS for interactive use) */
  state?: CheckboxCardState;
  /** Size variant */
  size?: CheckboxSize;
  /** Called when the card is toggled */
  onChange?: (nextSelected: boolean) => void;
  /** Extra className */
  className?: string;
}

export function CheckboxCard({
  label = 'Checkbox Card',
  selected = false,
  state = 'default',
  size = 'base',
  onChange,
  className,
}: CheckboxCardProps) {
  const isDisabled = state === 'disabled';

  const handleClick = () => {
    if (isDisabled || !onChange) return;
    onChange(!selected);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  /* Map card selected → inner checkbox type */
  const checkboxType: CheckboxType = selected ? 'checked' : 'unchecked';

  const rootClasses = [
    'mds-checkbox-card',
    size === 'mini' && 'mds-checkbox-card--mini',
    selected && 'mds-checkbox-card--selected',
    state === 'hover' && 'mds-checkbox-card--hover',
    state === 'pressed' && 'mds-checkbox-card--pressed',
    state === 'disabled' && 'mds-checkbox-card--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={rootClasses}
      role="checkbox"
      aria-checked={selected}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Checkbox
        type={checkboxType}
        size={size}
        state={state}
      />
      <span className="mds-checkbox-card__text-frame">
        <span className="mds-checkbox-card__label">{label}</span>
      </span>
    </span>
  );
}
