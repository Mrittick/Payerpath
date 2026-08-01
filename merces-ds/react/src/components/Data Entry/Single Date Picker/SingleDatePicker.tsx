import type { ReactNode } from 'react';
import './SingleDatePicker.module.css';

/* ==========================================================================
   Merces Design System — Single Date Picker
   Figma: Single Date Picker (741:6444)

   Wraps a label + DateField child. Supports vertical/horizontal layout.
   The DateField is passed as children so the consumer controls its props.
   ========================================================================== */

export interface SingleDatePickerProps {
  /** Label text */
  label: string;
  /** Layout direction */
  layout?: 'vertical' | 'horizontal';
  /** DateField child */
  children: ReactNode;
  /** Extra class on root */
  className?: string;
}

export function SingleDatePicker({
  label,
  layout = 'vertical',
  children,
  className,
}: SingleDatePickerProps) {
  const rootClasses = [
    'mds-single-date-picker',
    layout === 'horizontal' && 'mds-single-date-picker--horizontal',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses}>
      <div className="mds-single-date-picker__label">{label}</div>
      {children}
    </div>
  );
}
