import { Icon } from '../../../Assets/Icon/Icon';
import { TickBold12 } from '../../../Assets/Icon/icons';
import './CheckboxDataviz.module.css';

/* ==========================================================================
   Merces Design System — Checkbox Dataviz
   Figma: Checkbox Dataviz (323:2925) — 128 variants
   Series(01–08) × Type(Unchecked/Checked)
   × State(Default/Hover/Pressed/Disabled) × Focus(True/False)
   ========================================================================== */

export type DatavizSeries = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08';
export type DatavizState = 'default' | 'hover' | 'pressed' | 'disabled';

export interface CheckboxDatavizProps {
  /** Series colour (01–08) */
  series?: DatavizSeries;
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Visual state override */
  state?: DatavizState;
  /** Focus ring visibility */
  focus?: boolean;
  /** Label text */
  label?: string;
  /** Called when toggled */
  onChange?: (nextChecked: boolean) => void;
  /** Extra className */
  className?: string;
}

export function CheckboxDataviz({
  series = '01',
  checked = false,
  state = 'default',
  focus = false,
  label = 'Series',
  onChange,
  className,
}: CheckboxDatavizProps) {
  const isDisabled = state === 'disabled';

  const handleClick = () => {
    if (isDisabled || !onChange) return;
    onChange(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  const rootClasses = [
    'mds-checkbox-dv',
    `mds-checkbox-dv--s${series}`,
    checked && 'mds-checkbox-dv--checked',
    state === 'hover' && 'mds-checkbox-dv--hover',
    state === 'pressed' && 'mds-checkbox-dv--pressed',
    state === 'disabled' && 'mds-checkbox-dv--disabled',
    focus && 'mds-checkbox-dv--focus',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={rootClasses}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className="mds-checkbox-dv__frame">
        <span className="mds-checkbox-dv__box">
          <span className="mds-checkbox-dv__icon">
            <Icon size="tiny">{TickBold12}</Icon>
          </span>
        </span>
      </span>
      {label != null && label.length > 0 && (
        <span className="mds-checkbox-dv__label">{label}</span>
      )}
    </span>
  );
}
