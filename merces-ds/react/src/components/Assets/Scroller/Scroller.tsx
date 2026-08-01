import type { ReactNode, CSSProperties } from 'react';
import './Scroller.module.css';

export interface ScrollerProps {
  /** Scroll direction */
  direction?: 'vertical' | 'horizontal';
  /** Scrollbar size: mini (12px track, 4px bar) or base (16px track, 8px bar) */
  size?: 'mini' | 'base';
  /** Max height for vertical scroll (e.g. '280px', '100%') */
  maxHeight?: string | number;
  /** Max width for horizontal scroll */
  maxWidth?: string | number;
  /** Content to render inside the scrollable area */
  children: ReactNode;
  /** Extra className */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
}

export function Scroller({
  direction = 'vertical',
  size = 'mini',
  maxHeight,
  maxWidth,
  children,
  className,
  style,
}: ScrollerProps) {
  const isHorizontal = direction === 'horizontal';

  const scrollerClass = isHorizontal
    ? `mds-scroller--${size}-horizontal`
    : `mds-scroller--${size}`;

  const classes = ['mds-scroller', scrollerClass, className]
    .filter(Boolean)
    .join(' ');

  const scrollStyle: CSSProperties = {
    ...(direction === 'vertical'
      ? { overflowY: 'auto', overflowX: 'hidden' }
      : { overflowX: 'auto', overflowY: 'hidden' }),
    ...(maxHeight != null ? { maxHeight } : {}),
    ...(maxWidth != null ? { maxWidth } : {}),
    ...style,
  };

  return (
    <div className={classes} style={scrollStyle}>
      {children}
    </div>
  );
}
