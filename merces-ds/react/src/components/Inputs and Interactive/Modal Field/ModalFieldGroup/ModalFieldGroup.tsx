import type { ReactNode } from 'react';
import './ModalFieldGroup.module.css';

export type ModalFieldGroupLayout = 'vertical' | 'horizontal';
export type ModalFieldGroupPadding = 'default' | 'span';

export interface ModalFieldGroupProps {
  /** Label text */
  label: string;
  /** Layout direction */
  layout?: ModalFieldGroupLayout;
  /** Width distribution — horizontal only (default: label HUG, span: 50/50) */
  padding?: ModalFieldGroupPadding;
  /** Single <ModalField> child */
  children: ReactNode;
  /** Extra className */
  className?: string;
}

export function ModalFieldGroup({
  label,
  layout = 'vertical',
  padding = 'default',
  children,
  className,
}: ModalFieldGroupProps) {
  const classes = [
    'mds-modal-field-group',
    `mds-modal-field-group--${layout}`,
    layout === 'horizontal' && padding === 'span' && 'mds-modal-field-group--span',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <span className="mds-modal-field-group__label">{label}</span>
      <div className="mds-modal-field-group__field">{children}</div>
    </div>
  );
}
