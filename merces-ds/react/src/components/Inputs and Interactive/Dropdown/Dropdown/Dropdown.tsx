import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { Icon } from '../../../Assets/Icon/Icon';
import { ChevronDownRegular20 } from '../../../Assets/Icon/icons';
import { DropdownPanel } from '../DropdownPanel/DropdownPanel';
import './Dropdown.module.css';

export interface DropdownProps {
  /** Placeholder text shown when no value is selected */
  placeholder?: string;
  /** Display text for the selected value (string for single, joined for multi) */
  value?: string;
  /** Controlled open state */
  open?: boolean;
  /** Uncontrolled initial open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the dropdown is disabled */
  disabled?: boolean;
  /** Programmatic focus ring */
  focus?: boolean;
  /** Prop-driven state for demo */
  state?: 'default' | 'hover' | 'disabled';
  /** Automatically close the panel when an item inside is clicked (default true for single-select UX) */
  closeOnSelect?: boolean;
  /** Panel contents — DropdownItem, DropdownSection, DropdownSeparator, DropdownMore */
  children: ReactNode;
  /** DropdownFilter element for the panel */
  filter?: ReactNode;
  /** DropdownAction element for the panel */
  action?: ReactNode;
  /** Extra className */
  className?: string;
  /** Inline styles on the wrapper */
  style?: CSSProperties;
}

export function Dropdown({
  placeholder = 'Select',
  value,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  focus = false,
  state = 'default',
  closeOnSelect = true,
  children,
  filter,
  action,
  className,
  style,
}: DropdownProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const handleToggle = useCallback(() => {
    if (disabled || state === 'disabled') return;
    setOpen(!isOpen);
  }, [disabled, state, isOpen, setOpen]);

  /* Close on click outside */
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, setOpen]);

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  const isDisabled = disabled || state === 'disabled';
  const hasValue = value !== undefined && value.length > 0;

  const wrapperClasses = [
    'mds-dropdown',
    hasValue && 'mds-dropdown--selected',
    isOpen && 'mds-dropdown--open',
    state === 'hover' && 'mds-dropdown--hover',
    isDisabled && 'mds-dropdown--disabled',
    focus && 'mds-dropdown--focus',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={wrapperRef} className={wrapperClasses} style={style}>
      <button
        type="button"
        className="mds-dropdown__trigger"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={isDisabled || undefined}
        onClick={handleToggle}
      >
        <span className="mds-dropdown__text">
          {hasValue ? value : placeholder}
        </span>
        <span className="mds-dropdown__chevron">
          <Icon size="base">{ChevronDownRegular20}</Icon>
        </span>
      </button>

      <DropdownPanel
        open={isOpen}
        hasFilter={!!filter}
        filter={filter}
        action={action}
        onContentClick={closeOnSelect ? () => setOpen(false) : undefined}
      >
        {children}
      </DropdownPanel>
    </div>
  );
}
