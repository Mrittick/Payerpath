import { useState, useRef, useCallback, useEffect } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Icon } from '../../Assets/Icon/Icon';
import { DatePickerRegular20 } from '../../Assets/Icon/icons';
import { CalendarUI } from '../../Inputs and Interactive/Calendar/CalendarUI/CalendarUI';
import { Message } from '../Message/Message';
import type { MessageType } from '../Message/Message';
import './DateField.module.css';

/* ---- Global pointer detection for keyboard-only focus ring ---- */

let lastInputDevice: 'pointer' | 'keyboard' = 'pointer';

if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', () => { lastInputDevice = 'pointer'; }, true);
  document.addEventListener('keydown', (e) => {
    /* Only switch to keyboard for Tab key — actual navigation key */
    if (e.key === 'Tab') lastInputDevice = 'keyboard';
  }, true);
}

/* ---- Date formatting helpers ---- */

/** Format a Date as "dd / mm / yyyy" */
function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d} / ${m} / ${y}`;
}

/** Parse "dd / mm / yyyy" or "dd/mm/yyyy" into a Date (or null if invalid) */
function parseDate(str: string): Date | null {
  const cleaned = str.replace(/\s/g, '');
  const match = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  /* Verify the date didn't roll over (e.g. 31/02 → 03/03) */
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

/* ---- Input mask helpers ---- */

const MASK = 'dd / mm / yyyy';
const DIGIT_POSITIONS = [0, 1, 5, 6, 10, 11, 12, 13]; // indices of d, d, m, m, y, y, y, y in mask

/** Extract only digits from a string */
function extractDigits(str: string): string {
  return str.replace(/\D/g, '');
}

/** Apply digits to the mask template, always returning the full mask.
 *  ""        → "dd / mm / yyyy"  (full placeholder when focused)
 *  "3"       → "3d / mm / yyyy"
 *  "31"      → "31 / mm / yyyy"
 *  "3104"    → "31 / 04 / yyyy"
 *  "31042026" → "31 / 04 / 2026"
 */
function applyMask(digits: string): string {
  const chars = MASK.split('');
  let di = 0;
  for (const pos of DIGIT_POSITIONS) {
    if (di < digits.length) {
      chars[pos] = digits[di];
      di++;
    } else {
      break;
    }
  }
  return chars.join('');
}

/** Get the cursor position after applying the mask for a given digit count (entry point) */
function getCursorForDigitCount(count: number): number {
  if (count >= 8) return 14; // full mask length
  if (count === 0) return 0;
  return DIGIT_POSITIONS[count - 1] + 1;
}

/** Map a raw cursor (mask) position to a digit slot index.
 *  Returns the index of the digit just before or at the cursor.
 *  -1 means cursor is before any digit. digitsLength means past all digits. */
function cursorToSlot(maskPos: number, digitsLength: number): number {
  /* Find the last filled digit position that is <= maskPos */
  let slot = -1;
  for (let i = 0; i < digitsLength; i++) {
    if (DIGIT_POSITIONS[i] <= maskPos) slot = i;
    else break;
  }
  return slot;
}

/** Check if the entered digits so far contain an impossible date segment.
 *  Returns an error message if invalid, or null if OK so far.
 *
 *  Checks progressively as digits are entered:
 *    1  digit  → day starts with 4–9 (no month has 40+ days)
 *    2  digits → day 00 or > 31
 *    3  digits → month starts with 2–9 (no month 20+)
 *    4  digits → month 00 or > 12
 *    8  digits → full date doesn't exist (e.g. 31/02/2026)
 */
function getDigitsError(digits: string): string | null {
  if (digits.length >= 1) {
    const d1 = parseInt(digits[0], 10);
    if (d1 >= 4) return 'Invalid date.';
  }
  if (digits.length >= 2) {
    const day = parseInt(digits.substring(0, 2), 10);
    if (day === 0 || day > 31) return 'Invalid date.';
  }
  if (digits.length >= 3) {
    const m1 = parseInt(digits[2], 10);
    if (m1 >= 2) return 'Invalid date.';
  }
  if (digits.length >= 4) {
    const month = parseInt(digits.substring(2, 4), 10);
    if (month === 0 || month > 12) return 'Invalid date.';
  }
  if (digits.length === 8) {
    /* Full date — check it actually exists (e.g. no Feb 31) */
    const masked = applyMask(digits);
    if (!parseDate(masked)) return 'Invalid date.';
  }
  return null;
}

/* ---- Types ---- */

export type DateFieldType = 'valid' | 'warning' | 'error';

export interface DateFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size' | 'value' | 'onChange'
  > {
  /** Current date value */
  value?: Date | null;
  /** Raw text override — used by ranged picker to sync external changes */
  rawText?: string;
  /** Change handler — receives parsed Date or null */
  onChange?: (date: Date | null, raw: string) => void;
  /** Validation type */
  type?: DateFieldType;
  /** Validation message */
  message?: string;
  /** Whether the field is interactive (false = disabled) */
  actionable?: boolean;
  /** Show calendar dropdown */
  calendarOpen?: boolean;
  /** Called when calendar should open/close */
  onCalendarToggle?: (open: boolean) => void;
  /** Extra class on root */
  className?: string;
}

export function DateField({
  value = null,
  rawText,
  onChange,
  type = 'valid',
  message,
  actionable = true,
  placeholder = 'dd / mm / yyyy',
  disabled,
  calendarOpen = false,
  onCalendarToggle,
  className,
  ...inputProps
}: DateFieldProps) {
  const isDisabled = disabled || !actionable;

  const [focused, setFocused] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [digits, setDigits] = useState(''); // raw digit string (max 8 chars)
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipBlurParseRef = useRef(false);
  /** When handleKeyDown is managing cursor, constrainCursor should not interfere */
  const intendedCursorRef = useRef<number | null>(null);

  /* Sync digits from external value changes (e.g. calendar picks, ranged picker) */
  useEffect(() => {
    if (!focused && value) {
      const formatted = formatDate(value);
      setDigits(extractDigits(formatted));
    } else if (!focused && !value && digits.length > 0) {
      /* Don't clear digits on blur if user typed something incomplete */
    }
  }, [value, focused]);

  /* Sync from rawText prop (used by ranged date picker) */
  useEffect(() => {
    if (rawText !== undefined) {
      setDigits(extractDigits(rawText));
    }
  }, [rawText]);

  /* Compute display text:
     Focused → full mask with digits filled in (overlay handles dual-colour)
     Unfocused + valid date → formatted date
     Unfocused + incomplete digits → show partial entry so user sees what they left
     Unfocused + empty → empty (placeholder shows via CSS) */
  const displayText = focused
    ? applyMask(digits)
    : value
      ? formatDate(value)
      : digits.length > 0
        ? applyMask(digits)
        : '';

  const isEmpty = displayText.length === 0;
  const kindClass = isEmpty ? 'mds-date-field--empty' : 'mds-date-field--filled';
  /* Overlay is active when focused OR unfocused with incomplete partial entry */
  const hasOverlay = focused || (!value && digits.length > 0 && digits.length < 8);

  /* Internal validation: impossible date segments override parent validation */
  const internalError = digits.length > 0 ? getDigitsError(digits) : null;
  const effectiveType = internalError ? 'error' as DateFieldType : type;
  const effectiveMessage = internalError ?? message;

  /* Live calendar sync: preview date (selection highlight) + view target (month navigation) */
  const previewDate: Date | null = digits.length === 8
    ? parseDate(applyMask(digits))
    : null;

  /* Navigate calendar to typed month as soon as 4+ digits exist (DD/MM known).
     Use current year until all 8 digits provide the exact year. */
  const calendarViewMonth: number | undefined = (() => {
    if (digits.length < 4) return undefined;
    const month = parseInt(digits.substring(2, 4), 10);
    return (month >= 1 && month <= 12) ? month - 1 : undefined;
  })();
  const calendarViewYear: number | undefined = (() => {
    if (calendarViewMonth === undefined) return undefined;
    if (digits.length >= 8) {
      const year = parseInt(digits.substring(4, 8), 10);
      if (year >= 1) return year;
    }
    return new Date().getFullYear();
  })();

  const rootClasses = [
    'mds-date-field',
    `mds-date-field--${isDisabled ? 'valid' : effectiveType}`,
    kindClass,
    focused && !isDisabled && 'mds-date-field--active',
    keyboardFocus && !isDisabled && 'mds-date-field--focused',
    hasOverlay && 'mds-date-field--has-overlay',
    isDisabled && 'mds-date-field--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleFocus = useCallback(() => {
    /* Cancel any pending blur */
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setFocused(true);
    if (lastInputDevice === 'keyboard') setKeyboardFocus(true);
    /* Seed digits from current value */
    const currentDigits = value ? extractDigits(formatDate(value)) : digits;
    if (value) setDigits(currentDigits);
    /* Keyboard (Tab) → entry point. Mouse → constrainCursor handles it via onMouseUp. */
    if (lastInputDevice === 'keyboard') {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          const pos = getCursorForDigitCount(currentDigits.length);
          inputRef.current.setSelectionRange(pos, pos);
        }
      });
    }
  }, [value, digits]);

  const handleBlur = useCallback(() => {
    blurTimeoutRef.current = setTimeout(() => {
      if (rootRef.current?.contains(document.activeElement)) return;
      setFocused(false);
      setKeyboardFocus(false);

      /* If calendar picked a value, skip re-parsing */
      if (skipBlurParseRef.current) {
        skipBlurParseRef.current = false;
        return;
      }

      /* Try to parse the masked text */
      if (digits.length === 8) {
        const masked = applyMask(digits);
        const parsed = parseDate(masked);
        if (parsed) {
          onChange?.(parsed, formatDate(parsed));
        } else {
          onChange?.(null, masked);
        }
      } else if (digits.length === 0) {
        onChange?.(null, '');
      } else {
        /* Incomplete — report as invalid */
        onChange?.(null, applyMask(digits));
      }
    }, 150);
  }, [digits, onChange]);

  /** Place cursor at a mask position after React renders */
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

      /* Allow Tab, Escape, and arrow/home/end to pass through natively */
      if (e.key === 'Tab') return;
      if (e.key === 'Escape') { onCalendarToggle?.(false); return; }
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;

      const rawPos = input.selectionStart ?? 0;
      const slot = cursorToSlot(rawPos, digits.length);

      /* ---- Backspace → remove digit to the LEFT of cursor ---- */
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (slot >= 0) {
          /* slot is the digit at/before cursor — remove it */
          const newDigits = digits.substring(0, slot) + digits.substring(slot + 1);
          setDigits(newDigits);
          const masked = newDigits.length > 0 ? applyMask(newDigits) : '';
          const parsed = newDigits.length === 8 ? parseDate(masked) : null;
          onChange?.(parsed, masked);
          /* Place cursor where the removed digit was */
          const newPos = slot < newDigits.length
            ? DIGIT_POSITIONS[slot]
            : getCursorForDigitCount(newDigits.length);
          setCursorAfterRender(input, newPos);
        }
        return;
      }

      /* ---- Delete → remove digit to the RIGHT of cursor ---- */
      if (e.key === 'Delete') {
        e.preventDefault();
        const deleteSlot = slot + 1; // the digit after cursor
        if (deleteSlot < digits.length) {
          const newDigits = digits.substring(0, deleteSlot) + digits.substring(deleteSlot + 1);
          setDigits(newDigits);
          const masked = newDigits.length > 0 ? applyMask(newDigits) : '';
          const parsed = newDigits.length === 8 ? parseDate(masked) : null;
          onChange?.(parsed, masked);
          /* Cursor stays in the same place */
          const newPos = deleteSlot < newDigits.length
            ? DIGIT_POSITIONS[deleteSlot]
            : getCursorForDigitCount(newDigits.length);
          setCursorAfterRender(input, newPos);
        }
        return;
      }

      /* ---- Digit input ---- */
      if (/^\d$/.test(e.key)) {
        e.preventDefault();

        let newDigits: string;
        let nextMaskPos: number;

        /* Determine where this digit goes:
           - If cursor is on or just after a filled digit → replace the next digit
           - If cursor is past all filled digits → append */
        const typeSlot = slot + 1; // the digit position the cursor is "before"
        if (typeSlot < digits.length) {
          /* Replace digit at typeSlot, advance cursor */
          newDigits = digits.substring(0, typeSlot) + e.key + digits.substring(typeSlot + 1);
          const nextSlot = typeSlot + 1;
          nextMaskPos = nextSlot < newDigits.length
            ? DIGIT_POSITIONS[nextSlot]
            : getCursorForDigitCount(newDigits.length);
        } else {
          /* Append at entry point */
          if (digits.length >= 8) return;
          newDigits = digits + e.key;
          nextMaskPos = getCursorForDigitCount(newDigits.length);
        }

        setDigits(newDigits);
        const masked = applyMask(newDigits);
        const parsed = newDigits.length === 8 ? parseDate(masked) : null;
        onChange?.(parsed, masked);
        setCursorAfterRender(input, nextMaskPos);
        return;
      }

      /* Block everything else (letters, symbols, etc.) */
      e.preventDefault();
    },
    [digits, onChange, onCalendarToggle, setCursorAfterRender],
  );

  /* Prevent default onChange since we handle input via keyDown */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      /* For mobile / IME / paste — extract digits and apply mask */
      const newDigits = extractDigits(e.target.value).slice(0, 8);
      setDigits(newDigits);
      const masked = newDigits.length > 0 ? applyMask(newDigits) : '';
      const parsed = newDigits.length === 8 ? parseDate(masked) : null;
      onChange?.(parsed, masked);
    },
    [onChange],
  );

  const handleCalendarDateClick = useCallback(
    (date: Date) => {
      const formatted = formatDate(date);
      setDigits(extractDigits(formatted));
      skipBlurParseRef.current = true;
      onChange?.(date, formatted);
      onCalendarToggle?.(false);
      setFocused(false);
      setKeyboardFocus(false);
    },
    [onChange, onCalendarToggle],
  );

  const handleIconClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDisabled) return;
      if (calendarOpen) {
        onCalendarToggle?.(false);
        setFocused(false);
        setKeyboardFocus(false);
      } else {
        /* Open calendar immediately + activate field */
        setFocused(true);
        /* Don't set keyboard focus — this is a mouse click */
        if (value) {
          setDigits(extractDigits(formatDate(value)));
        }
        onCalendarToggle?.(true);
        inputRef.current?.focus();
      }
    },
    [isDisabled, calendarOpen, onCalendarToggle, value],
  );

  /* No cursor constraining — cursor can be placed anywhere in the mask */

  /* Also open calendar when clicking the input row area */
  const handleRowClick = useCallback(() => {
    if (isDisabled) return;
    if (!calendarOpen) {
      onCalendarToggle?.(true);
    }
  }, [isDisabled, calendarOpen, onCalendarToggle]);

  /* Close on outside click */
  useEffect(() => {
    if (!calendarOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onCalendarToggle?.(false);
        setFocused(false);
        setKeyboardFocus(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [calendarOpen, onCalendarToggle]);

  /* Cleanup timeout on unmount */
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  const messageType: MessageType | null =
    effectiveType === 'warning' ? 'warning' : effectiveType === 'error' ? 'error' : null;

  return (
    <div ref={rootRef} className={rootClasses} style={{ position: 'relative' }}>
      <div className="mds-date-field__frame">
        <label className="mds-date-field__input-row" onClick={handleRowClick}>
          <div className="mds-date-field__content">
            {/* Overlay: dual-colour mask — digits in text colour, remaining in placeholder colour.
                Renders when focused (always) or when unfocused with incomplete digits. */}
            {(focused || (!value && digits.length > 0 && digits.length < 8)) && (
              <span className="mds-date-field__mask-overlay" aria-hidden="true">
                <span className="mds-date-field__mask-filled">
                  {digits.length > 0
                    ? applyMask(digits).substring(0, getCursorForDigitCount(digits.length))
                    : ''}
                </span>
                <span className="mds-date-field__mask-placeholder">
                  {applyMask(digits).substring(getCursorForDigitCount(digits.length))}
                </span>
              </span>
            )}
            <input
              ref={inputRef}
              className="mds-date-field__input"
              type="text"
              value={displayText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
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
            className="mds-date-field__icon-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleIconClick}
            role="button"
            tabIndex={-1}
            aria-label="Open calendar"
          >
            <Icon size="base">{DatePickerRegular20}</Icon>
          </span>
        </label>
      </div>

      {/* Validation message */}
      {!isDisabled && messageType && effectiveMessage && (
        <Message type={messageType}>{effectiveMessage}</Message>
      )}

      {/* Calendar dropdown */}
      {calendarOpen && !isDisabled && (
        <div className="mds-date-field__calendar-dropdown">
          <CalendarUI
            selectedDate={previewDate ?? value}
            viewMonth={calendarViewMonth}
            viewYear={calendarViewYear}
            onDateClick={handleCalendarDateClick}
          />
        </div>
      )}
    </div>
  );
}
