import { Icon } from '../../../Assets/Icon/Icon';
import {
  TickBold12,
  TickBold16,
  DashRegular12,
  DashRegular16,
} from '../../../Assets/Icon/icons';
import './CheckboxTable.module.css';

/* ==========================================================================
   Merces Design System — Checkbox Table
   Figma: Checkbox Table (563:9700) — 96 variants
   Hierarchy(Header/Entry) × Size(Base/Mini) × Type(Unchecked/Checked/Mixed)
   × State(Default/Hover/Pressed/Disabled) × Focus(True/False)

   Hierarchy is semantic only — Header and Entry are visually identical.

   Structure: Root > Box > Icon
   ========================================================================== */

export type CheckboxTableType = 'unchecked' | 'checked' | 'mixed';
export type CheckboxTableState = 'default' | 'hover' | 'pressed' | 'disabled';
export type CheckboxTableSize = 'mini' | 'base';
export type CheckboxTableHierarchy = 'header' | 'entry';

export interface CheckboxTableProps {
  /** Semantic hierarchy — visually identical, used for ARIA context */
  hierarchy?: CheckboxTableHierarchy;
  /** Current check type */
  type?: CheckboxTableType;
  /** Visual state (hover/pressed driven by CSS for interactive use) */
  state?: CheckboxTableState;
  /** Size variant */
  size?: CheckboxTableSize;
  /** Focus ring visibility */
  focus?: boolean;
  /** Called when checkbox is toggled */
  onChange?: (nextType: CheckboxTableType) => void;
  /** Extra className */
  className?: string;
}

/** Icon lookup: [size][type] → React SVG element */
const ICONS: Record<CheckboxTableSize, Record<'checked' | 'mixed', React.ReactElement>> = {
  base: { checked: TickBold16, mixed: DashRegular16 },
  mini: { checked: TickBold12, mixed: DashRegular12 },
};

/** Icon wrapper size: base → mini (16px), mini → tiny (12px) */
const ICON_SIZE: Record<CheckboxTableSize, 'mini' | 'tiny'> = {
  base: 'mini',
  mini: 'tiny',
};

export function CheckboxTable({
  hierarchy = 'entry',
  type = 'unchecked',
  state = 'default',
  size = 'base',
  focus = false,
  onChange,
  className,
}: CheckboxTableProps) {
  const isDisabled = state === 'disabled';

  const handleClick = () => {
    if (isDisabled || !onChange) return;
    /* Toggle: unchecked → checked, checked/mixed → unchecked */
    onChange(type === 'unchecked' ? 'checked' : 'unchecked');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  const rootClasses = [
    'mds-checkbox-tbl',
    size === 'mini' && 'mds-checkbox-tbl--mini',
    `mds-checkbox-tbl--${type}`,
    state === 'hover' && 'mds-checkbox-tbl--hover',
    state === 'pressed' && 'mds-checkbox-tbl--pressed',
    state === 'disabled' && 'mds-checkbox-tbl--disabled',
    focus && 'mds-checkbox-tbl--focus',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={rootClasses}
      role="checkbox"
      aria-checked={type === 'mixed' ? 'mixed' : type === 'checked'}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-hierarchy={hierarchy}
    >
      <span className="mds-checkbox-tbl__box">
        <span className="mds-checkbox-tbl__icon">
          <Icon size={ICON_SIZE[size]}>
            {type === 'mixed' ? ICONS[size].mixed : ICONS[size].checked}
          </Icon>
        </span>
      </span>
    </span>
  );
}
