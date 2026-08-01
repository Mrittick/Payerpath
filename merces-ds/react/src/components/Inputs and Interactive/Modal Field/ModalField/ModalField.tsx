import { Icon } from '../../../Assets/Icon/Icon';
import {
  ChevronRightRegular16,
  ChevronRightRegular20,
  CrossFilled16,
} from '../../../Assets/Icon/icons';
import { Clear } from '../../Sub-Controls/Clear/Clear';
import './ModalField.module.css';

export type ModalFieldState = 'default' | 'hover' | 'disabled';

export interface ModalFieldProps {
  /** Placeholder text when nothing selected */
  placeholder?: string;
  /** Number of selected items (0 = unselected) */
  selectedCount?: number;
  /** Total number of selectable items (for "All selected" text) */
  totalCount?: number;
  /** Custom display text override (e.g. "3 selected") */
  displayText?: string;
  /** Visual state */
  state?: ModalFieldState;
  /** Focus ring visibility */
  focus?: boolean;
  /** Called when the field is clicked (to open modal) */
  onClick?: () => void;
  /** Called when clear button is clicked (selected state only) */
  onClear?: () => void;
  /** Extra className */
  className?: string;
}

export function ModalField({
  placeholder = 'Select',
  selectedCount = 0,
  totalCount,
  displayText,
  state = 'default',
  focus = false,
  onClick,
  onClear,
  className,
}: ModalFieldProps) {
  const isSelected = selectedCount > 0;
  const isDisabled = state === 'disabled';

  /* Resolve display text: custom override → "All selected" → "N selected" → placeholder */
  const text = isSelected
    ? displayText ??
      (totalCount != null && selectedCount >= totalCount
        ? 'All selected'
        : `${selectedCount} selected`)
    : placeholder;

  const classes = [
    'mds-modal-field',
    isSelected && 'mds-modal-field--selected',
    state === 'hover' && 'mds-modal-field--hover',
    state === 'disabled' && 'mds-modal-field--disabled',
    focus && 'mds-modal-field--focus',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled || undefined}
      onClick={!isDisabled ? onClick : undefined}
    >
      <div className="mds-modal-field__trigger">
        {/* Block: text + indicator chevron */}
        <span className="mds-modal-field__block">
          <span className="mds-modal-field__text">{text}</span>
          <span className="mds-modal-field__indicator">
            <Icon size="mini">{ChevronRightRegular16}</Icon>
          </span>
        </span>

        {/* Action area — stacked layers, crossfade between chevron and clear.
            Both always in the DOM so CSS transitions work. */}
        <span className="mds-modal-field__action-stack">
          {/* Unselected: chevron right */}
          <span className="mds-modal-field__action mds-modal-field__action--chevron">
            <Icon size="base">{ChevronRightRegular20}</Icon>
          </span>
          {/* Selected: clear button */}
          <span className="mds-modal-field__action mds-modal-field__action--clear">
            <Clear
              size="mini"
              level="tertiary"
              disabled={isDisabled}
              onClick={(e) => {
                e.stopPropagation();
                onClear?.();
              }}
            >
              <Icon size="mini">{CrossFilled16}</Icon>
            </Clear>
          </span>
        </span>
      </div>
    </div>
  );
}
