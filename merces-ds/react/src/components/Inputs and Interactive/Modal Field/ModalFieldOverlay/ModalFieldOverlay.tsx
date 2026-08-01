import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { Search } from '../../Sub-Controls/Search/Search';
import { CTAButton } from '../../CTA Buttons/CTAButton/CTAButton';
import { SelectionChip } from '../../Selection Chip/SelectionChip/SelectionChip';
import { DropdownItem } from '../../Dropdown/DropdownItem/DropdownItem';
import { Icon } from '../../../Assets/Icon/Icon';
import {
  SearchRegular20,
  TrashRegular20,
  CrossBold20,
  TickRegular20,
  SelectAllRegular20,
} from '../../../Assets/Icon/icons';
import NoResultsIcon from '../../../Assets/CustomIcons/no-results-48.svg?raw';
import '../../../Assets/Scroller/Scroller.module.css';
import './ModalFieldOverlay.module.css';

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */

export interface OverlayItem {
  /** Unique identifier (e.g. CARC code) */
  code: string;
  /** Display label */
  label: string;
}

export interface ModalFieldOverlayProps {
  /** Overlay title shown in header */
  title: string;
  /** Full list of selectable items */
  items: OverlayItem[];
  /** Currently committed selections (from parent) */
  selectedCodes: Set<string>;
  /** Whether the overlay is visible */
  open: boolean;
  /** Callback when user clicks "Done" — commits working selections */
  onApply: (selected: Set<string>) => void;
  /** Callback when user clicks "Cancel" — discards changes */
  onCancel: () => void;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export function ModalFieldOverlay({
  title,
  items,
  selectedCodes,
  open,
  onApply,
  onCancel,
}: ModalFieldOverlayProps) {
  /* ---- Working copy of selections (cloned on open) ---- */
  const [working, setWorking] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState('');
  const [chipsOverflow, setChipsOverflow] = useState(false);
  const [settled, setSettled] = useState(false);
  const [hoveredChip, setHoveredChip] = useState<{ code: string; label: string } | null>(null);
  const [pressedChip, setPressedChip] = useState<string | null>(null);
  const [exitingChips, setExitingChips] = useState<Set<string>>(() => new Set());
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const chipsWrapRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const entriesRef = useRef<HTMLDivElement>(null);

  /* Clone committed selections into working state whenever the overlay opens */
  useEffect(() => {
    if (open) {
      setWorking(new Set(selectedCodes));
      setQuery('');
      /* Reset scroll positions so the user always starts at the top */
      if (entriesRef.current) entriesRef.current.scrollTop = 0;
      if (chipsRef.current) chipsRef.current.scrollLeft = 0;
    }
  }, [open, selectedCodes]);

  /* After open animation completes, allow overflow: visible so tooltip
     ::after can render above the panel (not clipped by overflow: hidden). */
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setSettled(true), 300); /* matches --overlay-duration */
      return () => clearTimeout(timer);
    }
    setSettled(false);
    return undefined;
  }, [open]);

  /* ---- Filtered items ---- */
  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q),
    );
  }, [items, query]);

  /* ---- Selection helpers ---- */

  /** Animate a chip out (300ms fade + collapse), then remove from working set. */
  const animateOut = useCallback((code: string) => {
    setHoveredChip((prev) => (prev?.code === code ? null : prev));
    setExitingChips((prev) => new Set(prev).add(code));
    setTimeout(() => {
      setExitingChips((prev) => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
      setWorking((prev) => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
    }, 300); /* matches chipFadeOut keyframe duration */
  }, []);

  const toggleItem = useCallback((code: string) => {
    setWorking((prev) => {
      if (prev.has(code)) {
        /* Deselecting via list — animate out the chip */
        animateOut(code);
        return prev; /* don't modify yet; animateOut handles removal after delay */
      }
      const next = new Set(prev);
      next.add(code);
      return next;
    });
  }, [animateOut]);

  const deselectItem = useCallback((code: string) => {
    animateOut(code);
  }, [animateOut]);

  const clearAll = useCallback(() => {
    setHoveredChip(null);
    /* Mark all as exiting, then remove after fade */
    setExitingChips(new Set(working));
    setTimeout(() => {
      setExitingChips(new Set());
      setWorking(new Set());
    }, 300);
  }, [working]);

  /** Select all currently visible (filtered) items. */
  const selectAll = useCallback(() => {
    setWorking((prev) => {
      const next = new Set(prev);
      for (const item of filtered) next.add(item.code);
      return next;
    });
  }, [filtered]);

  /* ---- Actions ---- */
  const handleDone = useCallback(() => {
    onApply(working);
  }, [onApply, working]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  /* ---- Close on backdrop click (not panel click) ---- */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) {
        onCancel();
      }
    },
    [onCancel],
  );

  /* ---- Close on Escape key ---- */
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  /* ---- Prevent body scroll when open ---- */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  /* ---- Selected items for chips (preserve order from items array) ---- */
  const selectedItems = useMemo(
    () => items.filter((item) => working.has(item.code)),
    [items, working],
  );

  /* ---- Detect chips horizontal overflow ---- */
  useEffect(() => {
    const wrap = chipsWrapRef.current;
    const inner = chipsRef.current;
    if (!wrap || !inner) { setChipsOverflow(false); return; }

    const check = () => {
      /* Measure actual rendered chip content width (scrollWidth of the
         inner flex row) against the wrapper's clientWidth.  This works
         for variable-width chips (content-hugging up to 160px max).
         We compare against WRAPPER width (not inner's clientWidth)
         because the scrollable modifier adds negative margins + padding
         to bleed edge-to-edge, which inflates inner's clientWidth. */
      const count = selectedItems.length;
      if (count === 0) { setChipsOverflow(false); return; }
      setChipsOverflow(inner.scrollWidth > wrap.clientWidth);
    };

    check();
    const ro = new ResizeObserver(check);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [selectedItems]);

  /* ---- Auto-scroll chips to end when overflowing ----
     Standard UX: most recently added chip should always be in view.
     Wait for the chipFadeIn animation to finish (300ms) so scrollWidth
     reflects the chip's final 160px width, then scroll all the way right. */
  useEffect(() => {
    const el = chipsRef.current;
    if (!el || !chipsOverflow) return;
    const timer = setTimeout(() => {
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    }, 310);
    return () => clearTimeout(timer);
  }, [chipsOverflow, selectedItems.length]);

  /* ---- Vertical wheel → horizontal scroll on chips ---- */
  useEffect(() => {
    const el = chipsRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [selectedItems]);

  /* ---- Grab-to-scroll on chips (pointer drag) ---- */
  useEffect(() => {
    const el = chipsRef.current;
    if (!el || !chipsOverflow) return;

    let isPointerDown = false;
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let pointerId = -1;
    const DRAG_THRESHOLD = 4; /* px — movement below this is a click, above is a drag */

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      isDragging = false;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      pointerId = e.pointerId;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;
      const dx = e.clientX - startX;

      /* Start actual drag only after threshold — this preserves chip clicks */
      if (!isDragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        isDragging = true;
        el.setPointerCapture(pointerId);
        el.style.cursor = 'grabbing';
        el.style.userSelect = 'none';
      }

      el.scrollLeft = startScrollLeft - dx;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isDragging) {
        el.releasePointerCapture(e.pointerId);
        el.style.cursor = '';
        el.style.userSelect = '';
      }
      isPointerDown = false;
      isDragging = false;
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
    };
  }, [chipsOverflow]);

  /* ---- Chip tooltip position (for scrollable mode) ----
     Uses position:fixed with viewport coordinates so the tooltip
     escapes ALL overflow clipping (including panel overflow-x:clip).
     useLayoutEffect ensures coordinates are set BEFORE paint,
     preventing any wrong-position flash. */
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [tooltipReady, setTooltipReady] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updateTooltipPosition = useCallback(() => {
    if (!hoveredChip || !chipsOverflow) {
      setTooltipStyle({});
      setTooltipReady(false);
      return;
    }
    const scroll = chipsRef.current;
    if (!scroll) return;

    const chipEl = scroll.querySelector(
      `[data-tooltip="${CSS.escape(hoveredChip.label)}"]`,
    ) as HTMLElement | null;
    if (!chipEl) return;

    const chipRect = chipEl.getBoundingClientRect();
    const tooltipEl = tooltipRef.current;
    const tooltipHeight = tooltipEl ? tooltipEl.offsetHeight : 0;

    setTooltipStyle({
      left: chipRect.left,
      top: chipRect.top - tooltipHeight - 4, /* 4px gap above chip */
    });
  }, [hoveredChip, chipsOverflow]);

  /* Position BEFORE paint (no flash), then reveal AFTER one frame
     so the browser paints opacity:0 first, enabling the CSS transition. */
  useLayoutEffect(() => {
    updateTooltipPosition();
    if (hoveredChip && chipsOverflow) {
      const raf = requestAnimationFrame(() => setTooltipReady(true));
      return () => { cancelAnimationFrame(raf); setTooltipReady(false); };
    }
  }, [updateTooltipPosition, hoveredChip, chipsOverflow]);

  /* Also recalculate while scrolling so the tooltip follows the chip */
  useEffect(() => {
    const scroll = chipsRef.current;
    if (!scroll || !chipsOverflow || !hoveredChip) return;

    const onScroll = () => updateTooltipPosition();
    scroll.addEventListener('scroll', onScroll, { passive: true });
    return () => scroll.removeEventListener('scroll', onScroll);
  }, [chipsOverflow, hoveredChip, updateTooltipPosition]);

  const hasSelections = working.size > 0;
  const noResults = query.trim().length > 0 && filtered.length === 0;
  const allFilteredSelected = filtered.length > 0 && filtered.every((item) => working.has(item.code));

  /* ---- Render ---- */
  return (
    <div
      ref={backdropRef}
      className={`mds-overlay-backdrop${open ? ' mds-overlay-backdrop--open' : ''}`}
      onClick={handleBackdropClick}
      aria-hidden={!open}
    >
      <div
        ref={panelRef}
        className={`mds-overlay-panel${settled ? ' mds-overlay-panel--settled' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* ---- Header ---- */}
        <div className="mds-overlay-header">
          <h2 className="mds-overlay-title">{title}</h2>
          <Search
            searchIcon={<Icon size="base">{SearchRegular20}</Icon>}
            size="base"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
          />
        </div>

        {/* ---- Divider ---- */}
        <hr className="mds-overlay-divider" />

        {/* ---- Body ---- */}
        <div className="mds-overlay-body">
          {/* Selection chips — always in DOM, animated via max-height */}
          <div
            ref={chipsWrapRef}
            className={[
              'mds-overlay-chips-wrap',
              hasSelections && 'mds-overlay-chips-wrap--visible',
            ].filter(Boolean).join(' ')}
          >
            <div
              ref={chipsRef}
              className={[
                'mds-overlay-chips',
                chipsOverflow && 'mds-overlay-chips--scrollable',
              ].filter(Boolean).join(' ')}
            >
              {selectedItems.map((item) => (
                <SelectionChip
                  key={item.code}
                  label={item.label}
                  wrap={false}
                  className={exitingChips.has(item.code) ? 'mds-selection-chip--exiting' : undefined}
                  onDeselect={() => deselectItem(item.code)}
                  onMouseEnter={chipsOverflow ? () => setHoveredChip(item) : undefined}
                  onMouseLeave={chipsOverflow ? () => { setHoveredChip(null); setPressedChip(null); } : undefined}
                  onMouseDown={chipsOverflow ? () => setPressedChip(item.code) : undefined}
                  onMouseUp={chipsOverflow ? () => setPressedChip(null) : undefined}
                />
              ))}
            </div>
          </div>

          {/* Entries list or No Results */}
          {noResults ? (
            <div className="mds-overlay-no-results">
              <span
                className="mds-overlay-no-results__icon"
                dangerouslySetInnerHTML={{ __html: NoResultsIcon }}
              />
              <span className="mds-overlay-no-results__text">
                No results.
                <br />
                Try other search terms, or re-check your query.
              </span>
            </div>
          ) : (
            <div ref={entriesRef} className="mds-overlay-entries mds-scroller--mini">
              {filtered.map((item) => (
                <DropdownItem
                  key={item.code}
                  label={item.label}
                  mode="multi"
                  orientation="left"
                  checked={working.has(item.code)}
                  onSelect={() => toggleItem(item.code)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ---- Divider ---- */}
        <hr className="mds-overlay-divider" />

        {/* ---- Footer ---- */}
        <div className="mds-overlay-footer">
          <div className="mds-overlay-footer__selection">
            <CTAButton
              label="Clear all"
              icon={TrashRegular20}
              colorTheme="danger"
              ctaType="tertiary"
              size="base"
              variant="iconRight"
              disabled={!hasSelections}
              onClick={clearAll}
            />
            <CTAButton
              label="Select all"
              icon={SelectAllRegular20}
              colorTheme="brand"
              ctaType="secondary"
              size="base"
              variant="iconRight"
              disabled={filtered.length === 0 || allFilteredSelected}
              onClick={selectAll}
            />
          </div>
          <div className="mds-overlay-footer__actions">
            <CTAButton
              label="Cancel"
              icon={CrossBold20}
              colorTheme="brand"
              ctaType="tertiary"
              size="base"
              variant="iconRight"
              onClick={handleCancel}
            />
            <CTAButton
              label="Done"
              icon={TickRegular20}
              colorTheme="brand"
              ctaType="primary"
              size="base"
              variant="iconRight"
              onClick={handleDone}
            />
          </div>
        </div>
      </div>

      {/* JS-driven chip tooltip — rendered at BACKDROP level (outside the
          panel) so position:fixed works correctly. The panel has
          transform: translateY(0) which creates a containing block that
          breaks position:fixed for descendants. At backdrop level there
          is no transform ancestor, so fixed = viewport. */}
      {chipsOverflow && hoveredChip && (
        <div
          ref={tooltipRef}
          className={[
            'mds-overlay-chip-tooltip',
            tooltipReady && 'mds-overlay-chip-tooltip--visible',
            pressedChip === hoveredChip.code && 'mds-overlay-chip-tooltip--pressed',
          ].filter(Boolean).join(' ')}
          style={tooltipStyle}
        >
          {hoveredChip.label}
        </div>
      )}
    </div>
  );
}
