import type { ReactNode } from 'react';
import './MinMaxValuesStringGroup.module.css';

export type MinMaxLayout = 'vertical' | 'horizontal';

export interface MinMaxValuesStringGroupProps {
  /** Label text */
  label: string;
  /** Layout direction */
  layout?: MinMaxLayout;
  /** Two StringField children (min and max) */
  children: ReactNode;
  /** Additional class name */
  className?: string;
}

export function MinMaxValuesStringGroup({
  label,
  layout = 'vertical',
  children,
  className,
}: MinMaxValuesStringGroupProps) {
  const rootClasses = [
    'mds-minmax-group',
    `mds-minmax-group--${layout}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses}>
      <label className="mds-minmax-group__label">{label}</label>
      <div className="mds-minmax-group__inputs">{children}</div>
    </div>
  );
}
