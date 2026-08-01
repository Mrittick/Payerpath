import type { ReactNode, ButtonHTMLAttributes } from 'react';
import './MoreInfo.module.css';

export interface MoreInfoProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Icon content (inline SVG for information-circle-16-regular) */
  icon: ReactNode;
  /** Display text (defaults to "More Info") */
  text?: string;
}

export function MoreInfo({
  icon,
  text = 'More Info',
  className,
  ...rest
}: MoreInfoProps) {
  const classes = ['mds-more-info', className ?? ''].filter(Boolean).join(' ');

  return (
    <button type="button" className={classes} {...rest}>
      <span>{text}</span>
      {icon}
    </button>
  );
}
