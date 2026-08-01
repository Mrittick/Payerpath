import { useState, useRef, useCallback, useEffect } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Icon } from '../../Assets/Icon/Icon';
import { TimePickerRegular20 } from '../../Assets/Icon/icons';
import TimeDropdown from '../../Inputs and Interactive/Time/TimeDropdown/TimeDropdown';
import { Message } from '../Message/Message';
import type { MessageType } from '../Message/Message';
import './TimeField.module.css';

/* ---- Global pointer detection for keyboard-only focus ring ---- */

let lastInputDevice: 'pointer' | 'keyboard' = 'pointer';

if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', () => { lastInputDevice = 'pointer'; }, true);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') lastInputDevice = 'keyboard';
  }, true);
}

/* ---- Time format types ---- */

export type TimeFormat = '12hr' | '24hr';
export type TimeFieldType = 'valid' | 'warning' | 'error';

/* ---- Mask helpers ---- */

// 12hr mask: "hh : mm tt"   → digits at [0,1,5,6], meridian at [8,9]
// 24hr mask: "HH : MM"      → digits at [0,1,5,6]
const MASK_12 = 'hh : mm tt';
const MASK_24 = 'HH : MM';
const DIGIT_POSITIONS = [0, 1, 5, 6]; // same for both formats

function getMask(format: TimeFormat): string {
  return format === '12hr' ? MASK_12 : MASK_24;
}

/** Apply digits to the mask, optionally with meridian for 12hr.
 *  meridianSet=false keeps "tt" as placeholder until user explicitly chooses. */
function applyMask(digits: string, format: TimeFormat, meridian: string, meridianSet = true): string {
  const mask = getMask(format);
  const chars = mask.split('');
  let di = 0;
  for (const pos of DIGIT_POSITIONS) {
    if (di < digits.length) {
      chars[pos] = digits[di];
      di++;
    } else {
      break;
    }
  }
  // Replace "tt" with meridian for 12hr — only when explicitly set by user
  if (format === '12hr' && meridianSet) {
    chars[8] = meridian[0] || 't';
    chars[9] = meridian[1] || 't';
  }
  return chars.join('');
}

/** Get cursor position after applying mask for a given digit count */
function getCursorForDigitCount(count: number, format: TimeFormat): number {
  if (count >= 4) {
    // All digits filled — position after last digit
    return format === '12hr' ? 7 : 7; // just past "mm" part, before meridian space
  }
  if (count === 0) return 0;
  return DIGIT_POSITIONS[count - 1] + 1;
}

/** Map cursor position to digit slot index */
function cursorToSlot(maskPos: number, digitsLength: number): number {
  let slot = -1;
  for (let i = 0; i < digitsLength; i++) {
    if (DIGIT_POSITIONS[i] <= maskPos) slot = i;
    else break;
  }
  return slot;
}

/** Validate time digits progressively.
 *  12hr: hh = 01-12, mm = 00-59
 *  24hr: HH = 00-23, MM = 00-59 */
function getDigitsError(digits: string, format: TimeFormat): string | null {
  if (digits.length >= 1) {
    const d1 = parseInt(digits[0], 10);
    if (format === '24hr' && d1 >= 3) return 'Invalid time.';
    if (format === '12hr' && d1 >= 2) return 'Invalid time.';
  }
  if (digits.length >= 2) {
    const hour = parseInt(digits.substring(0, 2), 10);
    if (format === '24hr' && hour > 23) return 'Invalid time.';
    if (format === '12hr' && (hour === 0 || hour > 12)) return 'Invalid time.';
  }
  if (digits.length >= 3) {
    const m1 = parseInt(digits[2], 10);
    if (m1 >= 6) return 'Invalid time.';
  }
  if (digits.length >= 4) {
    const minute = parseInt(digits.substring(2, 4), 10);
    if (minute > 59) return 'Invalid time.';
  }
  return null;
}

/** Format a time string for display: "12 : 00 pm" or "14 : 30" */
function formatTimeValue(value: string, format: TimeFormat): string {
  // value is stored as "H:MM am" (12hr) or "HH:MM" (24hr)
  // Parse and reformat to masked display
  if (format === '12hr') {
    const match = value.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
    if (!match) return value;
    const h = match[1].padStart(2, '0');
    const m = match[2];
    const mer = match[3].toLowerCase();
    return `${h} : ${m} ${mer}`;
  }
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return value;
  const h = match[1].padStart(2, '0');
  const m = match[2];
  return `${h} : ${m}`;
}

/** Extract digits from a formatted time value.
 *  Handles both "6:00 pm" (single-digit hour) and "14:30" formats.
 *  Always returns exactly 4 digit chars for a complete time (zero-padded hour). */
function extractDigitsFromValue(value: string): string {
  // Try 12hr: "H:MM am" or "HH:MM am"
  const match12 = value.match(/^(\d{1,2}):(\d{2})\s*(am|pm)/i);
  if (match12) {
    const h = match12[1].padStart(2, '0');
    const m = match12[2];
    return (h + m).slice(0, 4);
  }
  // Try 24hr: "H:MM" or "HH:MM"
  const match24 = value.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const h = match24[1].padStart(2, '0');
    const m = match24[2];
    return (h + m).slice(0, 4);
  }
  // Fallback: strip non-digits
  return value.replace(/\D/g, '').slice(0, 4);
}

/** Extract meridian from a formatted time value */
function extractMeridian(value: string): string {
  const match = value.match(/(am|pm)/i);
  return match ? match[1].toLowerCase() : 'am';
}

/** Build the dropdown key from digits + meridian (matches TimeDropdown slot.key format) */
function buildDropdownKey(digits: string, format: TimeFormat, meridian: string): string | null {
  if (digits.length < 4) return null;
  const h = parseInt(digits.substring(0, 2), 10);
  const m = parseInt(digits.substring(2, 4), 10);
  if (format === '24hr') {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  // 12hr: "H:MM am"
  return `${h}:${String(m).padStart(2, '0')} ${meridian}`;
}

/* ---- Component ---- */

export interface TimeFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size' | 'value' | 'onChange'
  > {
  /** Time format */
  format?: TimeFormat;
  /** Current time value (e.g. "2:30 pm" or "14:30") */
  value?: string | null;
  /** Change handler — receives formatted time string or null */
  onChange?: (time: string | null) => void;
  /** Validation type */
  type?: TimeFieldType;
  /** Validation message */
  message?: string;
  /** Whether the field is interactive */
  actionable?: boolean;
  /** Controlled dropdown state */
  dropdownOpen?: boolean;
  /** Dropdown toggle callback */
  onDropdownToggle?: (open: boolean) => void;
  /** Extra class on root */
  className?: string;
}

export function TimeField({
  format = '12hr',
  value = null,
  onChange,
  type = 'valid',
  message,
  actionable = true,
  placeholder,
  disabled,
  dropdownOpen = false,
  onDropdownToggle,
  className,
  ...inputProps
}: TimeFieldProps) {
  const isDisabled = disabled || !actionable;

  const [focused, setFocused] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [digits, setDigits] = useState('');
  const [meridian, setMeridian] = useState('am');
  const [meridianSet, setMeridianSet] = useState(false);
  const [incompleteWarning, setIncompleteWarning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipBlurParseRef = useRef(false);
  const intendedCursorRef = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const valueOnFocusRef = useRef<string | null>(null);

  const defaultPlaceholder = format === '12hr' ? 'hh : mm tt' : 'HH : MM';
  const resolvedPlaceholder = placeholder ?? defaultPlaceholder;

  /* Sync digits from external value */
  useEffect(() => {
    if (!focused && value) {
      setDigits(extractDigitsFromValue(value));
      if (format === '12hr') {
        setMeridian(extractMeridian(value));
        setMeridianSet(true);
      }
    }
  }, [value, focused, format]);

  /* Display text */
  const displayText = focused
    ? applyMask(digits, format, meridian, meridianSet)
    : value
      ? formatTimeValue(value, format)
      : digits.length > 0
        ? applyMask(digits, format, meridian, meridianSet)
        : '';

  const isEmpty = displayText.length === 0;
  const kindClass = isEmpty ? 'mds-time-field--empty' : 'mds-time-field--filled';
  const hasOverlay = focused || (!value && digits.length > 0 && digits.length < 4);

  /* Internal validation */
  const internalError = digits.length > 0 ? getDigitsError(digits, format) : null;
  const effectiveType = internalError
    ? 'error' as TimeFieldType
    : incompleteWarning
      ? 'warning' as TimeFieldType
      : type;
  const effectiveMessage = internalError
    ?? (incompleteWarning ? 'Invalid time.' : null)
    ?? message;

  /* Dropdown current time key (for auto-scroll + tick mark) */
  const currentDropdownKey = value
    ? buildDropdownKey(extractDigitsFromValue(value), format, format === '12hr' ? extractMeridian(value) : 'am')
    : buildDropdownKey(digits, format, meridian);

  const rootClasses = [
    'mds-time-field',
    `mds-time-field--${isDisabled ? 'valid' : effectiveType}`,
    kindClass,
    focused && !isDisabled && 'mds-time-field--active',
    keyboardFocus && !isDisabled && 'mds-time-field--focused',
    hasOverlay && 'mds-time-field--has-overlay',
    isDisabled && 'mds-time-field--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleFocus = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    valueOnFocusRef.current = value ?? null;
    setFocused(true);
    if (lastInputDevice === 'keyboard') setKeyboardFocus(true);
    const currentDigits = value ? extractDigitsFromValue(value) : digits;
    if (value) {
      setDigits(currentDigits);
      if (format === '12hr') {
        setMeridian(extractMeridian(value));
        setMeridianSet(true);
      }
    }
    /* Always position cursor at the next digit insertion point */
    requestAnimationFrame(() => {
      if (inputRef.current) {
        const pos = getCursorForDigitCount(currentDigits.length, format);
        inputRef.current.setSelectionRange(pos, pos);
      }
    });
  }, [value, digits, format]);

  const handleBlur = useCallback(() => {
    blurTimeoutRef.current = setTimeout(() => {
      if (rootRef.current?.contains(document.activeElement)) return;
      setFocused(false);
      setKeyboardFocus(false);

      if (skipBlurParseRef.current) {
        skipBlurParseRef.current = false;
        return;
      }

      if (digits.length === 4) {
        const error = getDigitsError(digits, format);
        if (!error) {
          const h = parseInt(digits.substring(0, 2), 10);
          const m = parseInt(digits.substring(2, 4), 10);
          if (format === '24hr') {
            onChange?.(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
          } else {
            onChange?.(`${h}:${String(m).padStart(2, '0')} ${meridian}`);
          }
        } else {
          onChange?.(null);
        }
      } else if (digits.length === 0) {
        onChange?.(null);
      } else {
        onChange?.(null);
      }
    }, 150);
  }, [digits, meridian, format, onChange]);

  const setCursorAfterRender = useCallback((input: HTMLInputElement, pos: number) => {
    intendedCursorRef.current = pos;
    requestAnimationFrame(() => {
      input.setSelectionRange(pos, pos);
      intendedCursorRef.current = null;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = inputRef.current;
      if (!input) return;

      if (e.key === 'Tab') return;

      /* Escape: revert to value at focus time, close and blur */
      if (e.key === 'Escape') {
        e.preventDefault();
        const original = valueOnFocusRef.current;
        onChange?.(original);
        if (original) {
          setDigits(extractDigitsFromValue(original));
          if (format === '12hr') {
            setMeridian(extractMeridian(original));
            setMeridianSet(true);
          }
        } else {
          setDigits('');
          setMeridianSet(false);
        }
        skipBlurParseRef.current = true;
        onDropdownToggle?.(false);
        input.blur();
        return;
      }

      /* Enter: commit current time and blur */
      if (e.key === 'Enter') {
        e.preventDefault();
        if (digits.length === 4) {
          const error = getDigitsError(digits, format);
          if (!error) {
            const h = parseInt(digits.substring(0, 2), 10);
            const m = parseInt(digits.substring(2, 4), 10);
            const mer = format === '12hr' && meridianSet ? meridian : 'am';
            if (format === '24hr') {
              onChange?.(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
            } else {
              onChange?.(`${h}:${String(m).padStart(2, '0')} ${mer}`);
            }
          }
        }
        skipBlurParseRef.current = true;
        onDropdownToggle?.(false);
        input.blur();
        return;
      }

      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;

      /* ArrowUp/Down: toggle meridian for 12hr */
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && format === '12hr') {
        e.preventDefault();
        setMeridian((prev) => prev === 'am' ? 'pm' : 'am');
        setMeridianSet(true);
        return;
      }

      /* 'a' or 'p' key: set meridian for 12hr */
      if (format === '12hr' && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setMeridian('am');
        setMeridianSet(true);
        return;
      }
      if (format === '12hr' && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setMeridian('pm');
        setMeridianSet(true);
        return;
      }

      const rawPos = input.selectionStart ?? 0;
      const slot = cursorToSlot(rawPos, digits.length);

      /* Backspace */
      if (e.key === 'Backspace') {
        e.preventDefault();
        /* 12hr: if meridian is set, first backspace clears it back to "tt" */
        if (format === '12hr' && meridianSet) {
          setMeridianSet(false);
          /* Keep cursor at the digit insertion point */
          const pos = getCursorForDigitCount(digits.length, format);
          setCursorAfterRender(input, pos);
          return;
        }
        /* If cursor is beyond all digits (e.g. in the meridian zone), delete last digit */
        const effectiveSlot = slot >= 0 ? slot : digits.length - 1;
        if (effectiveSlot >= 0) {
          const newDigits = digits.substring(0, effectiveSlot) + digits.substring(effectiveSlot + 1);
          setDigits(newDigits);
          onChange?.(null);
          const newPos = effectiveSlot < newDigits.length
            ? DIGIT_POSITIONS[effectiveSlot]
            : getCursorForDigitCount(newDigits.length, format);
          setCursorAfterRender(input, newPos);
        }
        return;
      }

      /* Delete */
      if (e.key === 'Delete') {
        e.preventDefault();
        const deleteSlot = slot + 1;
        if (deleteSlot < digits.length) {
          const newDigits = digits.substring(0, deleteSlot) + digits.substring(deleteSlot + 1);
          setDigits(newDigits);
          onChange?.(null);
          const newPos = deleteSlot < newDigits.length
            ? DIGIT_POSITIONS[deleteSlot]
            : getCursorForDigitCount(newDigits.length, format);
          setCursorAfterRender(input, newPos);
        }
        return;
      }

      /* Digit input */
      if (/^\d$/.test(e.key)) {
        e.preventDefault();

        let newDigits: string;
        let nextMaskPos: number;

        const typeSlot = slot + 1;
        if (typeSlot < digits.length) {
          newDigits = digits.substring(0, typeSlot) + e.key + digits.substring(typeSlot + 1);
          const nextSlot = typeSlot + 1;
          nextMaskPos = nextSlot < newDigits.length
            ? DIGIT_POSITIONS[nextSlot]
            : getCursorForDigitCount(newDigits.length, format);
        } else {
          if (digits.length >= 4) return;
          newDigits = digits + e.key;
          nextMaskPos = getCursorForDigitCount(newDigits.length, format);
        }

        /* 12hr auto-pad: first hour digit 2-9 can only mean 02-09 */
        if (format === '12hr' && newDigits.length === 1 && parseInt(newDigits, 10) >= 2) {
          newDigits = '0' + newDigits;
          nextMaskPos = getCursorForDigitCount(2, format);
        }

        setDigits(newDigits);

        /* Auto-commit on 4 digits */
        if (newDigits.length === 4) {
          const error = getDigitsError(newDigits, format);
          if (!error) {
            const h = parseInt(newDigits.substring(0, 2), 10);
            const m = parseInt(newDigits.substring(2, 4), 10);
            if (format === '24hr') {
              onChange?.(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
            } else {
              onChange?.(`${h}:${String(m).padStart(2, '0')} ${meridian}`);
            }
          } else {
            onChange?.(null);
          }
        } else {
          onChange?.(null);
        }
        setCursorAfterRender(input, nextMaskPos);
        return;
      }

      e.preventDefault();
    },
    [digits, meridian, meridianSet, format, onChange, onDropdownToggle, setCursorAfterRender],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDigits = e.target.value.replace(/\D/g, '').slice(0, 4);
      setDigits(newDigits);
      onChange?.(null);
    },
    [onChange],
  );

  const handleDropdownSelect = useCallback(
    (timeKey: string) => {
      skipBlurParseRef.current = true;
      setDigits(extractDigitsFromValue(timeKey));
      if (format === '12hr') {
        setMeridian(extractMeridian(timeKey));
        setMeridianSet(true);
      }
      onChange?.(timeKey);
      onDropdownToggle?.(false);
      setFocused(false);
      setKeyboardFocus(false);
    },
    [format, onChange, onDropdownToggle],
  );

  const handleIconClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDisabled) return;
      if (dropdownOpen) {
        onDropdownToggle?.(false);
        setFocused(false);
        setKeyboardFocus(false);
      } else {
        setFocused(true);
        if (value) {
          setDigits(extractDigitsFromValue(value));
          if (format === '12hr') {
            setMeridian(extractMeridian(value));
            setMeridianSet(true);
          }
        }
        onDropdownToggle?.(true);
        inputRef.current?.focus();
      }
    },
    [isDisabled, dropdownOpen, onDropdownToggle, value, format],
  );

  const handleRowClick = useCallback(() => {
    if (isDisabled) return;
    if (!dropdownOpen) {
      onDropdownToggle?.(true);
    }
  }, [isDisabled, dropdownOpen, onDropdownToggle]);

  /* Close on outside click */
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onDropdownToggle?.(false);
        setFocused(false);
        setKeyboardFocus(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dropdownOpen, onDropdownToggle]);

  /* Auto-scroll dropdown to selected time when opening */
  useEffect(() => {
    if (!dropdownOpen || !dropdownRef.current) return;
    requestAnimationFrame(() => {
      const container = dropdownRef.current?.querySelector('.mds-time-dropdown__content');
      const currentItem = dropdownRef.current?.querySelector('.mds-time-cell--current');
      if (container && currentItem) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = currentItem.getBoundingClientRect();
        const scrollTop = container.scrollTop + (itemRect.top - containerRect.top) - containerRect.height / 2 + itemRect.height / 2;
        container.scrollTop = Math.max(0, scrollTop);
      }
    });
  }, [dropdownOpen]);

  /* Cleanup */
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  const messageType: MessageType | null =
    effectiveType === 'warning' ? 'warning' : effectiveType === 'error' ? 'error' : null;

  /* Mask overlay split point — for colouring, not cursor.
     When all 4 digits are filled, the entire mask (including meridian) is "filled". */
  const filledEnd = digits.length >= 4
    ? getMask(format).length
    : getCursorForDigitCount(digits.length, format);

  return (
    <div ref={rootRef} className={rootClasses} style={{ position: 'relative' }}>
      <div className="mds-time-field__frame">
        <label className="mds-time-field__input-row" onClick={handleRowClick}>
          <div className="mds-time-field__content">
            {(focused || (!value && digits.length > 0 && digits.length < 4)) && (
              <span className="mds-time-field__mask-overlay" aria-hidden="true">
                <span className="mds-time-field__mask-filled">
                  {digits.length > 0
                    ? applyMask(digits, format, meridian, meridianSet).substring(0, filledEnd)
                    : ''}
                </span>
                <span className="mds-time-field__mask-placeholder">
                  {applyMask(digits, format, meridian, meridianSet).substring(filledEnd)}
                </span>
              </span>
            )}
            <input
              ref={inputRef}
              className="mds-time-field__input"
              type="text"
              value={displayText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={resolvedPlaceholder}
              disabled={isDisabled}
              inputMode="numeric"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-form-type="other"
              data-lpignore="true"
              {...inputProps}
            />
          </div>
          <span
            className="mds-time-field__icon-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleIconClick}
            role="button"
            tabIndex={-1}
            aria-label="Open time picker"
          >
            <Icon size="base">{TimePickerRegular20}</Icon>
          </span>
        </label>
      </div>

      {!isDisabled && messageType && effectiveMessage && (
        <Message type={messageType}>{effectiveMessage}</Message>
      )}

      {dropdownOpen && !isDisabled && (
        <div
          ref={dropdownRef}
          className="mds-time-field__dropdown"
          onMouseDown={(e) => e.preventDefault()}
        >
          <TimeDropdown
            format={format}
            currentTime={currentDropdownKey}
            onSelect={handleDropdownSelect}
          />
        </div>
      )}
    </div>
  );
}
