import { useState, useCallback } from 'react';
import { ModalField } from '../ModalField/ModalField';
import type { ModalFieldState } from '../ModalField/ModalField';
import { ModalFieldOverlay } from '../ModalFieldOverlay/ModalFieldOverlay';
import type { OverlayItem } from '../ModalFieldOverlay/ModalFieldOverlay';

/* ==========================================================================
   ModalFieldSelect — convenience wrapper
   Composes ModalField (trigger) + ModalFieldOverlay (selection panel) into a
   single controlled component.  All open/close/working-copy state is internal;
   the consumer just passes data in and reads selections out.
   ========================================================================== */

export interface ModalFieldSelectProps {
  /** Placeholder shown when nothing is selected */
  placeholder?: string;
  /** Title displayed in the overlay header */
  title: string;
  /** Full list of selectable items */
  items: OverlayItem[];
  /** Currently selected codes (controlled) */
  value: Set<string>;
  /** Called when selections change (Done or Clear) */
  onChange: (selected: Set<string>) => void;
  /** Visual state of the trigger field */
  state?: ModalFieldState;
  /** Focus ring on the trigger field */
  focus?: boolean;
  /** Extra className on the trigger field */
  className?: string;
}

export function ModalFieldSelect({
  placeholder = 'Select',
  title,
  items,
  value,
  onChange,
  state,
  focus,
  className,
}: ModalFieldSelectProps) {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => setOpen(true), []);
  const handleClear = useCallback(() => onChange(new Set()), [onChange]);
  const handleApply = useCallback(
    (selected: Set<string>) => {
      onChange(selected);
      setOpen(false);
    },
    [onChange],
  );
  const handleCancel = useCallback(() => setOpen(false), []);

  return (
    <>
      <ModalField
        placeholder={placeholder}
        selectedCount={value.size}
        totalCount={items.length}
        state={state}
        focus={focus}
        className={className}
        onClick={handleClick}
        onClear={handleClear}
      />
      <ModalFieldOverlay
        title={title}
        items={items}
        selectedCodes={value}
        open={open}
        onApply={handleApply}
        onCancel={handleCancel}
      />
    </>
  );
}
