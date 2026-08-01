import type { ReactNode } from 'react';
import './SingleTimePicker.module.css';

/* ==========================================================================
   Merces Design System — Single Time Picker
   Figma: Single Time Picker (781:11196)

   Wraps a label + TimeField child. Supports vertical/horizontal layout.
   The TimeField is passed as children so the consumer controls its props.
   ========================================================================== */

export interface SingleTimePickerProps {
  /** Label text */
  label: string;
  /** Layout direction */
  layout?: 'vertical' | 'horizontal';
  /** TimeField child */
  children: ReactNode;
  /** Extra class on root */
  className?: string;
}

export function SingleTimePicker({
  label,
  layout = 'vertical',
  children,
  className,
}: SingleTimePickerProps) {
  const rootClasses = [
    'mds-single-time-picker',
    layout === 'horizontal' && 'mds-single-time-picker--horizontal',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses}>
      <div className="mds-single-time-picker__label">{label}</div>
      {children}
    </div>
  );
}
