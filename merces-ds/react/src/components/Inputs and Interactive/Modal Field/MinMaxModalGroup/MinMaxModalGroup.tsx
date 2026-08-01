import type { ReactNode } from 'react';
import './MinMaxModalGroup.module.css';

export type MinMaxModalGroupLayout = 'vertical' | 'horizontal';

export interface MinMaxModalGroupProps {
  /** Label text */
  label: string;
  /** Layout direction */
  layout?: MinMaxModalGroupLayout;
  /** Two <ModalField> children (min + max) */
  children: ReactNode;
  /** Extra className */
  className?: string;
}

export function MinMaxModalGroup({
  label,
  layout = 'vertical',
  children,
  className,
}: MinMaxModalGroupProps) {
  const classes = [
    'mds-minmax-modal-group',
    `mds-minmax-modal-group--${layout}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <span className="mds-minmax-modal-group__label">{label}</span>
      <div className="mds-minmax-modal-group__inputs">{children}</div>
    </div>
  );
}
