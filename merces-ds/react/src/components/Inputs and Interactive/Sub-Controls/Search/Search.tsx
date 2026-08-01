import {
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type InputHTMLAttributes,
  type CSSProperties,
} from 'react';
import { Clear } from '../Clear/Clear';
import { Icon } from '../../../Assets/Icon/Icon';
import { CrossFilled16 } from '../../../Assets/Icon/icons';
import './Search.module.css';

export type SearchSize = 'base' | 'compact';
export type SearchMode = 'inactive' | 'active' | 'disabled';

export interface SearchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'children'> {
  /** Search icon content (inline SVG for search-{size}-regular) */
  searchIcon: ReactNode;
  /** Size variant: base (44px) or compact (40px) */
  size?: SearchSize;
  /** Mode — inactive (placeholder), active (query text + Clear), disabled */
  mode?: SearchMode;
  /** Programmatic focus ring */
  focus?: boolean;
  /** Callback fired when the Clear button is clicked */
  onClear?: () => void;
  /** Wrapper className */
  wrapperClassName?: string;
  /** Wrapper inline styles */
  wrapperStyle?: CSSProperties;
}

export function Search({
  searchIcon,
  size = 'base',
  mode = 'inactive',
  focus = false,
  onClear,
  wrapperClassName,
  wrapperStyle,
  className,
  disabled: disabledProp,
  value: controlledValue,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  ...inputProps
}: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const pointerDownRef = useRef(false);

  /* Internal value tracking for uncontrolled usage */
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(
    (defaultValue as string) ?? '',
  );
  const currentValue = isControlled
    ? String(controlledValue)
    : internalValue;

  const isDisabled = mode === 'disabled' || disabledProp;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    },
    [isControlled, onChange],
  );

  /* Track pointer down so we know if focus was mouse-triggered */
  const handlePointerDown = useCallback(() => {
    pointerDownRef.current = true;
  }, []);

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setEditing(true);
      /* Focus ring only for keyboard navigation (Tab/Shift+Tab) */
      if (!pointerDownRef.current) {
        setKeyboardFocused(true);
      }
      pointerDownRef.current = false;
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setEditing(false);
      setKeyboardFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  const handleClear = useCallback(() => {
    if (!isControlled) setInternalValue('');
    /* Reset the native input */
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
    onClear?.();
  }, [isControlled, onClear]);

  /* Clicking the frame (padding area around the input) should focus the input.
     Mark as pointer-initiated so handleFocus won't show the keyboard-only focus ring. */
  const handleFrameClick = useCallback(() => {
    pointerDownRef.current = true;
    inputRef.current?.focus();
  }, []);

  /* Figma: Clear is always present (Size=Base, Level=Tertiary).
     State=Hidden when no text (invisible but occupies space).
     State=Default when text exists (visible, clickable). */
  const clearHidden = currentValue.length === 0 || isDisabled;

  const outerClasses = [
    'mds-search',
    `mds-search--${size}`,
    currentValue.length > 0 ? 'mds-search--active' : '',
    mode === 'disabled' ? 'mds-search--disabled' : '',
    editing ? 'mds-search--editing' : '',
    focus || keyboardFocused ? 'mds-search--focus' : '',
    wrapperClassName ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const inputClasses = ['mds-search__input', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={outerClasses} style={wrapperStyle}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="mds-search__frame" onClick={handleFrameClick}>
        {searchIcon}
        <input
          ref={inputRef}
          type="search"
          className={inputClasses}
          disabled={isDisabled || undefined}
          aria-disabled={isDisabled || undefined}
          value={isControlled ? controlledValue : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
          onPointerDown={handlePointerDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...inputProps}
        />
        <Clear
          size="base"
          level="tertiary"
          hidden={clearHidden}
          onClick={handleClear}
        >
          <Icon size="mini">{CrossFilled16}</Icon>
        </Clear>
      </div>
    </div>
  );
}
