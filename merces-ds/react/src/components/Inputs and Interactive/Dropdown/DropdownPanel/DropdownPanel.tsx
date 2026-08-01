import { useRef, useCallback, useEffect, useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import './DropdownPanel.module.css';

export interface DropdownPanelProps {
  /** Whether the panel is visible */
  open: boolean;
  /** Enables larger border-radius (16px) for panels with filter */
  hasFilter?: boolean;
  /** DropdownFilter element — rendered at the top of the panel */
  filter?: ReactNode;
  /** DropdownAction element — rendered at the bottom of the panel */
  action?: ReactNode;
  /** Called when the scrollable content area is clicked (used for close-on-select) */
  onContentClick?: () => void;
  /** Panel content (DropdownItem, DropdownSection, DropdownSeparator, DropdownMore) */
  children: ReactNode;
  /** Extra className */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
}

export function DropdownPanel({
  open,
  hasFilter = false,
  filter,
  action,
  onContentClick,
  children,
  className,
  style,
}: DropdownPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [needsScrollbar, setNeedsScrollbar] = useState(false);
  const dragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);

  /* Figma Scroller padding: 4px inset on all sides (--spacing-1xs).
     Track CSS uses top/bottom: var(--spacing-1xs), so track height =
     scroll-wrapper height minus 8px. Thumb maps within that track. */
  const TRACK_INSET = 4; /* px — matches --spacing-1xs */

  /* Calculate whether content overflows and update thumb size + position */
  const updateScrollbar = useCallback(() => {
    const el = contentRef.current;
    const thumb = thumbRef.current;
    if (!el || !thumb) return;

    const { scrollHeight, clientHeight, scrollTop } = el;
    const overflows = scrollHeight > clientHeight;
    setNeedsScrollbar(overflows);

    if (!overflows) return;

    /* Track height accounts for top + bottom inset */
    const trackHeight = clientHeight - TRACK_INSET * 2;

    /* Thumb height = proportion of visible area, scaled to track */
    const ratio = clientHeight / scrollHeight;
    const thumbHeight = Math.max(ratio * trackHeight, 24); /* 24px minimum */

    /* Thumb position = scroll progress mapped to available track space */
    const trackSpace = trackHeight - thumbHeight;
    const scrollRange = scrollHeight - clientHeight;
    const thumbTop = scrollRange > 0
      ? (scrollTop / scrollRange) * trackSpace
      : 0;

    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${thumbTop}px)`;
  }, []);

  /* Listen for scroll events on the content area */
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollbar, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollbar);
  }, [updateScrollbar]);

  /* Recalculate on open/close and content changes */
  useEffect(() => {
    if (open) {
      /* Small delay to let content render */
      requestAnimationFrame(updateScrollbar);
    }
  }, [open, children, updateScrollbar]);

  /* Also observe resize changes (e.g. filter toggling) */
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const ro = new ResizeObserver(updateScrollbar);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollbar]);

  /* Trap wheel events inside the panel when open.
     Prevents page scroll regardless of whether content overflows.
     For overflowing content, allows internal scrolling but blocks
     chaining at boundaries. For non-overflowing, swallows entirely. */
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !open) return;

    const handleWheel = (e: WheelEvent) => {
      const el = contentRef.current;
      if (!el) {
        e.preventDefault();
        return;
      }

      const { scrollHeight, clientHeight, scrollTop } = el;
      const hasOverflow = scrollHeight > clientHeight;

      if (!hasOverflow) {
        /* No overflow — swallow the wheel event entirely */
        e.preventDefault();
        return;
      }

      /* Has overflow — only prevent if at scroll boundary */
      const scrollingDown = e.deltaY > 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const atTop = scrollTop <= 0;

      if ((scrollingDown && atBottom) || (!scrollingDown && atTop)) {
        e.preventDefault();
      }
    };

    panel.addEventListener('wheel', handleWheel, { passive: false });
    return () => panel.removeEventListener('wheel', handleWheel);
  }, [open]);

  /* Track mousedown — handles both click-to-jump and drag-to-scroll.
     Clicking anywhere in the 12px track zone jumps scroll to that
     position, then allows dragging from there. */
  const trackRef = useRef<HTMLDivElement>(null);
  const handleTrackMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = contentRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const { scrollHeight, clientHeight } = el;
    const trackHeight = clientHeight - TRACK_INSET * 2;
    const ratio = clientHeight / scrollHeight;
    const thumbHeight = Math.max(ratio * trackHeight, 24);
    const trackSpace = trackHeight - thumbHeight;
    const scrollRange = scrollHeight - clientHeight;
    const trackRect = track.getBoundingClientRect();

    /* Jump: map click Y within track to scroll position */
    const clickY = e.clientY - trackRect.top;
    const clickRatio = trackSpace > 0
      ? Math.max(0, Math.min(1, (clickY - thumbHeight / 2) / trackSpace))
      : 0;
    el.scrollTop = clickRatio * scrollRange;

    /* Begin drag from this position */
    dragging.current = true;
    dragStartY.current = e.clientY;
    dragStartScroll.current = el.scrollTop;

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragging.current || !contentRef.current) return;
      const content = contentRef.current;
      const sh = content.scrollHeight;
      const ch = content.clientHeight;
      const th = ch - TRACK_INSET * 2;
      const r = ch / sh;
      const tHeight = Math.max(r * th, 24);
      const tSpace = th - tHeight;
      const sRange = sh - ch;

      const deltaY = ev.clientY - dragStartY.current;
      const scrollDelta = tSpace > 0
        ? (deltaY / tSpace) * sRange
        : 0;

      content.scrollTop = dragStartScroll.current + scrollDelta;
    };

    const handleMouseUp = () => {
      dragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const classes = [
    'mds-dropdown-panel',
    hasFilter && 'mds-dropdown-panel--has-filter',
    open && 'mds-dropdown-panel--open',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const trackClasses = [
    'mds-dropdown-panel__scrollbar-track',
    !needsScrollbar && 'mds-dropdown-panel__scrollbar-track--hidden',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={panelRef} className={classes} role="listbox" style={style}>
      {filter}
      <div className="mds-dropdown-panel__scroll-wrapper">
        <div
          ref={contentRef}
          className={`mds-dropdown-panel__content${needsScrollbar ? ' mds-dropdown-panel__content--has-scrollbar' : ''}`}
          onClick={onContentClick ? (e) => {
            /* Only close when a non-disabled DropdownItem is clicked */
            const item = (e.target as HTMLElement).closest('.mds-dropdown-item');
            if (item && !item.classList.contains('mds-dropdown-item--disabled')) {
              onContentClick();
            }
          } : undefined}
        >
          {children}
        </div>
        {/* Custom overlay scrollbar — full track is interactive */}
        <div
          ref={trackRef}
          className={trackClasses}
          onMouseDown={handleTrackMouseDown}
        >
          <div
            ref={thumbRef}
            className="mds-dropdown-panel__scrollbar-thumb"
          />
        </div>
      </div>
      {action}
    </div>
  );
}
