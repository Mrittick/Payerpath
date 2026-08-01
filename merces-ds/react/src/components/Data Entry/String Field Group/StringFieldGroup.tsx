import type { ReactNode } from 'react';
import './StringFieldGroup.module.css';

export type StringFieldGroupLayout = 'vertical' | 'horizontal';
export type StringFieldGroupPadding = 'default' | 'span';

export interface StringFieldGroupProps {
  /** Label text */
  label: string;
  /** Layout direction */
  layout?: StringFieldGroupLayout;
  /** Label padding variant */
  padding?: StringFieldGroupPadding;
  /** String Field (or any field input) passed as children */
  children: ReactNode;
  /** Additional class name */
  className?: string;
}

export function StringFieldGroup({
  label,
  layout = 'vertical',
  padding = 'default',
  children,
  className,
}: StringFieldGroupProps) {
  const rootClasses = [
    'mds-string-field-group',
    `mds-string-field-group--${layout}`,
    padding === 'span' && 'mds-string-field-group--span',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses}>
      <label className="mds-string-field-group__label">{label}</label>
      <div className="mds-string-field-group__field">{children}</div>
    </div>
  );
}
