import type { ReactNode } from 'react';
import './RangedTimePicker.module.css';

/* ==========================================================================
   Merces Design System — Ranged Time Picker
   Figma: Ranged Time Picker (781:11196)

   Wraps a label + two TimeField children (start/end) in a row with 8px gap.
   The two TimeFields are passed as children — consumer controls their props.
   ========================================================================== */

export interface RangedTimePickerProps {
  /** Label text */
  label: string;
  /** Layout direction */
  layout?: 'vertical' | 'horizontal';
  /** Two TimeField children (start + end) */
  children: ReactNode;
  /** Extra class on root */
  className?: string;
}

export function RangedTimePicker({
  label,
  layout = 'vertical',
  children,
  className,
}: RangedTimePickerProps) {
  const rootClasses = [
    'mds-ranged-time-picker',
    layout === 'horizontal' && 'mds-ranged-time-picker--horizontal',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses}>
      <div className="mds-ranged-time-picker__label">{label}</div>
      <div className="mds-ranged-time-picker__inputs">
        {children}
      </div>
    </div>
  );
}
