import { useState, useRef, useCallback } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Icon } from '../../Assets/Icon/Icon';
import { CrossFilled16 } from '../../Assets/Icon/icons';
import { Clear } from '../../Inputs and Interactive/Sub-Controls/Clear/Clear';
import { Message } from '../Message/Message';
import type { MessageType } from '../Message/Message';
import './StringField.module.css';

/**
 * Global flag: was the most recent interaction a pointer (mouse/touch)?
 * Set on any mousedown/pointerdown anywhere in the document,
 * cleared on any keydown. Checked in handleFocus to decide
 * whether to show the keyboard-only focus ring.
 */
let hadRecentPointerDown = false;

if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', () => { hadRecentPointerDown = true; }, true);
  document.addEventListener('keydown', () => { hadRecentPointerDown = false; }, true);
}

export type StringFieldType = 'valid' | 'warning' | 'error';

export interface StringFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size' | 'value' | 'onChange'
  > {
  /** Current value (controlled) */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Validation type — determines border colour and message */
  type?: StringFieldType;
  /** Validation message (shown for warning/error) */
  message?: string;
  /** Whether the field is interactive (actionable=false → disabled, non-editable) */
  actionable?: boolean;
  /** Additional class name on the root */
  className?: string;
}

export function StringField({
  value = '',
  onChange,
  type = 'valid',
  message,
  actionable = true,
  placeholder = 'Text Field',
  disabled,
  className,
  ...inputProps
}: StringFieldProps) {
  /* actionable=false → field is non-editable (disabled) */
  const isDisabled = disabled || !actionable;

  const [focused, setFocused] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEmpty = value.length === 0;
  const kindClass = isEmpty ? 'mds-string-field--empty' : 'mds-string-field--filled';

  const rootClasses = [
    'mds-string-field',
    /* Non-actionable is always valid — no warning/error possible */
    `mds-string-field--${isDisabled ? 'valid' : type}`,
    kindClass,
    focused && !isDisabled && 'mds-string-field--active',
    keyboardFocus && !isDisabled && 'mds-string-field--focused',
    isDisabled && 'mds-string-field--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClear = useCallback(() => {
    onChange?.('');
    inputRef.current?.focus();
  }, [onChange]);

  const handleFocus = useCallback(() => {
    setFocused(true);
    if (!hadRecentPointerDown) {
      setKeyboardFocus(true);
    }
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
    setKeyboardFocus(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  /* Map validation type to message type */
  const messageType: MessageType | null =
    type === 'warning' ? 'warning' : type === 'error' ? 'error' : null;

  return (
    <div className={rootClasses}>
      {/* Frame — focus ring wrapper */}
      <div className="mds-string-field__frame">
        {/* Text Field — <label> so clicking anywhere inside focuses the input */}
        <label className="mds-string-field__input-row">
          {/* Content */}
          <div className="mds-string-field__content">
            <input
              ref={inputRef}
              className="mds-string-field__input"
              type="text"
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              disabled={isDisabled}
              {...inputProps}
            />
          </div>

          {/* Clear button — only for actionable (non-disabled) fields */}
          {actionable && !isDisabled && (
            <Clear
              size="mini"
              level={isEmpty ? 'secondary' : 'tertiary'}
              hidden={false}
              onClick={handleClear}
              onMouseDown={(e) => e.preventDefault()}
              tabIndex={-1}
            >
              <Icon size="mini">{CrossFilled16}</Icon>
            </Clear>
          )}
        </label>
      </div>

      {/* Validation message — only for warning/error types on editable fields */}
      {!isDisabled && messageType && message && (
        <Message type={messageType}>{message}</Message>
      )}
    </div>
  );
}
