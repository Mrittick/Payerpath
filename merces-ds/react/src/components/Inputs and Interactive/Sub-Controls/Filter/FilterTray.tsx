/* FilterTray — slide-in sidebar modal for filter options
   Figma: node 3343:39586 (Filter Example → Overlay)

   An organism composed of existing design system organs:
   CTAButton (close, cancel, apply), Search, Icon.

   The tray is a layout shell — it owns the structural chrome
   (backdrop, panel, header, search, divider, footer) and delegates
   the options area to `children`. When no children are provided,
   an empty state is rendered.

   Rendered via React Portal to document.body for proper z-stacking.
*/

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { CTAButton } from '../../CTA Buttons/CTAButton/CTAButton';
import { Search } from '../Search/Search';
import { Icon } from '../../../Assets/Icon/Icon';
import { CrossFilled20, SearchRegular20 } from '../../../Assets/Icon/icons';
import filterOff48Raw from '../../../Assets/CustomIcons/filter-off-48.svg?raw';
import './FilterTray.module.css';

/* ---- Empty-state 48×48 icon ---- */
/* Figma node 3343:40357 — a "filter-off" vector (slash through funnel).
   48px exceeds the Icon component's max size (32px/Huge),
   so this is rendered as a standalone SVG element.
   Lives in Assets/CustomIcons/ — special-case icons outside the
   standard Icon size range. */
function EmptyIcon() {
  const viewBoxMatch = filterOff48Raw.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch?.[1] ?? '0 0 48 48';
  const innerMatch = filterOff48Raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  const innerHTML = innerMatch?.[1] ?? '';

  return (
    <span className="mds-filter-tray__empty-icon">
      <svg
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: innerHTML }}
      />
    </span>
  );
}

/* ---- Props ---- */

export interface FilterTrayProps {
  /** Whether the tray is open */
  open: boolean;
  /** Callback when requesting close (backdrop click, Cancel, Close, Escape) */
  onClose: () => void;
  /** Callback when Apply is clicked */
  onApply: () => void;
  /** Tray heading text */
  heading?: string;
  /** Content for the options area (between divider and footer).
      When absent, the empty state renders. */
  children?: ReactNode;
  /** Content for the selection row slot (above search). */
  selectionSlot?: ReactNode;
  /** Controlled search value */
  searchValue?: string;
  /** Search change handler */
  onSearchChange?: (value: string) => void;
  /** Search clear handler */
  onSearchClear?: () => void;
  /** Search placeholder text */
  searchPlaceholder?: string;
}

/* ---- Component ---- */

export function FilterTray({
  open,
  onClose,
  onApply,
  heading = 'Filter',
  children,
  selectionSlot,
  searchValue,
  onSearchChange,
  onSearchClear,
  searchPlaceholder = 'Search...',
}: FilterTrayProps) {
  /* ---- Focus restore ---- */
  const previousFocusRef = useRef<Element | null>(null);

  /* ---- Body scroll lock + focus management ---- */
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
        if (previousFocusRef.current instanceof HTMLElement) {
          previousFocusRef.current.focus();
        }
      };
    }
    return undefined;
  }, [open]);

  /* ---- Escape key handler ---- */
  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  /* ---- Search state (for uncontrolled usage) ---- */
  const isSearchControlled = searchValue !== undefined;
  const [internalSearch, setInternalSearch] = useState('');
  const currentSearch = isSearchControlled ? searchValue : internalSearch;

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (!isSearchControlled) setInternalSearch(val);
      onSearchChange?.(val);
    },
    [isSearchControlled, onSearchChange],
  );

  const handleSearchClear = useCallback(() => {
    if (!isSearchControlled) setInternalSearch('');
    onSearchClear?.();
  }, [isSearchControlled, onSearchClear]);

  /* ---- Stop propagation on tray panel click (prevent backdrop close) ---- */
  const handleTrayClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  /* ---- Stop pointerdown propagation on backdrop ---- */
  /* The Dropdown component listens for document-level pointerdown to
     detect outside clicks. The FilterTray portal lives outside the
     Dropdown DOM, so any pointerdown on the backdrop/tray would close
     the dropdown. Stopping propagation here isolates the tray. */
  const handleBackdropPointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);

  /* ---- Apply handler ---- */
  const handleApply = useCallback(() => {
    onApply();
  }, [onApply]);

  /* ---- Detect empty state ---- */
  const hasChildren =
    children !== undefined && children !== null && children !== false;

  /* ---- Class names ---- */
  const backdropClasses = [
    'mds-filter-tray__backdrop',
    open ? 'mds-filter-tray__backdrop--open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const trayClasses = [
    'mds-filter-tray',
    open ? 'mds-filter-tray--open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  /* ---- Render ---- */
  return createPortal(
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={backdropClasses} onClick={onClose} onPointerDown={handleBackdropPointerDown}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className={trayClasses} onClick={handleTrayClick}>
        <div className="mds-filter-tray__overlay">
          {/* ---- Header ---- */}
          <div className="mds-filter-tray__header">
            <h2 className="mds-filter-tray__heading">{heading}</h2>
            <CTAButton
              ctaType="tertiary"
              variant="iconOnly"
              colorTheme="brand"
              size="base"
              icon={CrossFilled20}
              onClick={onClose}
              aria-label="Close filter tray"
            />
          </div>

          {/* ---- Body ---- */}
          <div className="mds-filter-tray__body">
            {/* Selection row */}
            {selectionSlot && (
              <div className="mds-filter-tray__selection">
                {selectionSlot}
              </div>
            )}

            {/* Search */}
            <Search
              searchIcon={<Icon size="base">{SearchRegular20}</Icon>}
              size="base"
              value={currentSearch}
              onChange={handleSearchChange}
              onClear={handleSearchClear}
              placeholder={searchPlaceholder}
            />

            {/* Divider */}
            <div className="mds-filter-tray__divider">
              <div className="mds-filter-tray__divider-bar" />
            </div>

            {/* Options area */}
            <div className="mds-filter-tray__options">
              {hasChildren ? (
                children
              ) : (
                <div className="mds-filter-tray__empty">
                  <EmptyIcon />
                  <p className="mds-filter-tray__empty-text">
                    No filters available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ---- Footer ---- */}
          <div className="mds-filter-tray__footer">
            <CTAButton
              ctaType="secondary"
              colorTheme="brand"
              size="base"
              label="Cancel"
              onClick={onClose}
            />
            <CTAButton
              ctaType="primary"
              colorTheme="brand"
              size="base"
              label="Apply"
              onClick={handleApply}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
