import type { ReactNode } from 'react';
import './RangedDatePicker.module.css';

/* ==========================================================================
   Merces Design System — Ranged Date Picker
   Figma: Ranged Date Picker (741:6453)

   Wraps a label + two DateField children (start/end) in a row with 8px gap.
   The two DateFields are passed as children — consumer controls their props.
   ========================================================================== */

export interface RangedDatePickerProps {
  /** Label text */
  label: string;
  /** Layout direction */
  layout?: 'vertical' | 'horizontal';
  /** Two DateField children (start + end) */
  children: ReactNode;
  /** Extra class on root */
  className?: string;
}

export function RangedDatePicker({
  label,
  layout = 'vertical',
  children,
  className,
}: RangedDatePickerProps) {
  const rootClasses = [
    'mds-ranged-date-picker',
    layout === 'horizontal' && 'mds-ranged-date-picker--horizontal',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses}>
      <div className="mds-ranged-date-picker__label">{label}</div>
      <div className="mds-ranged-date-picker__inputs">
        {children}
      </div>
    </div>
  );
}
