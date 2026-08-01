/* useDropdown — type definitions
   Production-ready state management hook for the Dropdown component system.
   Generic V parameter defaults to string, supports number for database IDs.
*/

import type { DropdownItemMode, DropdownItemOrientation } from '../DropdownItem/DropdownItem.ts';

/* ---- Item Definition ---- */

export interface DropdownItemDef<V extends string | number = string> {
  /** Unique identifier for the item (maps to backend ID) */
  value: V;
  /** Display label text */
  label: string;
  /** Whether the item is disabled (excluded from selection + keyboard nav) */
  disabled?: boolean;
  /** Optional section key — groups items under DropdownSection headers */
  section?: string;
}

/* ---- Section Definition ---- */

export interface DropdownSectionDef {
  /** Section title displayed as a DropdownSection header */
  title: string;
  /** Optional key for matching items (defaults to title) */
  key?: string;
  /** Whether to render a DropdownSeparator before this section */
  separatorBefore?: boolean;
}

/* ---- Display Text Mode ---- */

export type DisplayTextMode = 'labels' | 'count' | 'auto';

/* ---- Hook Options ---- */

export interface UseDropdownOptions<V extends string | number = string> {
  /** Item definitions — source of truth for values, labels, and disabled state */
  items: readonly DropdownItemDef<V>[];
  /** Selection mode (default: 'single') */
  mode?: DropdownItemMode;
  /** Tick/checkbox icon placement (default: 'left') */
  orientation?: DropdownItemOrientation;

  /* ---- Selection (controlled / uncontrolled) ---- */

  /** Controlled selected value(s) — single V for single mode, V[] for multi */
  selected?: V | V[];
  /** Default selected value(s) — used when uncontrolled */
  defaultSelected?: V | V[];
  /** Callback when selection changes — receives single V or V[] based on mode */
  onSelectedChange?: (selected: V | V[]) => void;

  /* ---- Display Text ---- */

  /**
   * How to derive the trigger display text:
   * - 'labels': Always shows comma-joined labels
   * - 'count': Always shows "N selected"
   * - 'auto': Labels for <=maxDisplayLabels, "N selected" for more
   * Default: 'auto'
   */
  displayTextMode?: DisplayTextMode;
  /** Max items to show as labels before switching to "N selected" (default: 3) */
  maxDisplayLabels?: number;
  /** Text shown when all selectable items are checked (default: 'All selected') */
  allSelectedText?: string;
  /** Custom display text formatter — return undefined to fall back to default logic */
  formatDisplayText?: (
    selectedItems: readonly DropdownItemDef<V>[],
    allItems: readonly DropdownItemDef<V>[],
  ) => string | undefined;

  /* ---- Filter ---- */

  /** Enable built-in search filter (default: false) */
  filterable?: boolean;
  /** Custom filter function — default is case-insensitive substring match on label */
  filterFn?: (item: DropdownItemDef<V>, query: string) => boolean;

  /* ---- Sections ---- */

  /** Section definitions for grouping items */
  sections?: readonly DropdownSectionDef[];

  /* ---- Keyboard Navigation ---- */

  /** Enable keyboard navigation — Arrow keys, Enter, Home/End (default: true) */
  keyboardNavigation?: boolean;
}

/* ---- Item Render Props (returned by getItemProps) ---- */

export interface ItemRenderProps {
  /** Unique ID for aria-activedescendant (keyboard nav) */
  id: string;
  /** Item label text */
  label: string;
  /** Selection mode */
  mode: DropdownItemMode;
  /** Tick/checkbox orientation */
  orientation: DropdownItemOrientation;
  /** Whether the item is currently selected */
  checked: boolean;
  /** Visual state */
  state: 'default' | 'disabled';
  /** Whether the item is keyboard-highlighted */
  highlighted: boolean;
  /** Click handler — toggles selection */
  onSelect: () => void;
}

/* ---- Grouped Items (for section rendering) ---- */

export interface GroupedItems<V extends string | number = string> {
  /** Section definition (undefined for ungrouped items) */
  section?: DropdownSectionDef;
  /** Items in this group */
  items: readonly DropdownItemDef<V>[];
}

/* ---- Filter Props (spread onto DropdownFilter) ---- */

export interface FilterRenderProps {
  /** Current filter query value */
  value: string;
  /** Update the filter query */
  onChange: (value: string) => void;
  /** Clear the filter query */
  onClear: () => void;
}

/* ---- Keyboard Props (spread onto the panel wrapper) ---- */

export interface KeyboardRenderProps {
  /** Keyboard event handler */
  onKeyDown: (e: React.KeyboardEvent) => void;
  /** ARIA role for the listbox container */
  role: 'listbox';
  /** ID of the currently highlighted item (for aria-activedescendant) */
  'aria-activedescendant'?: string;
}

/* ---- Hook Return ---- */

export interface UseDropdownReturn<V extends string | number = string> {
  /* ---- Spread Props ---- */

  /** Props to spread onto <Dropdown> */
  dropdownProps: {
    value: string | undefined;
    closeOnSelect: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
  /** Get props for a specific item by value — O(1) lookup */
  getItemProps: (value: V) => ItemRenderProps;
  /** Props to spread onto <DropdownFilter> (only useful when filterable=true) */
  filterProps: FilterRenderProps;
  /** Props for keyboard navigation on the panel container */
  keyboardProps: KeyboardRenderProps;

  /* ---- Computed State ---- */

  /** Derived display text for the trigger (undefined = show placeholder) */
  displayText: string | undefined;
  /** Set of currently selected values (readonly) */
  selectedSet: ReadonlySet<V>;
  /** Array of currently selected values (readonly) */
  selectedValues: readonly V[];
  /** Items after filter is applied */
  filteredItems: readonly DropdownItemDef<V>[];
  /** Items grouped by section (for rendering sections) */
  groupedItems: readonly GroupedItems<V>[];
  /** Whether all selectable items are selected */
  isAllSelected: boolean;
  /** Count of selectable (non-disabled) items */
  selectableCount: number;
  /** Whether the dropdown is currently open */
  isOpen: boolean;
  /** Current filter query string */
  filterQuery: string;
  /** Index of the keyboard-highlighted item (-1 = none) */
  highlightedIndex: number;

  /* ---- Actions ---- */

  /** Select a specific value */
  select: (value: V) => void;
  /** Deselect a specific value */
  deselect: (value: V) => void;
  /** Toggle a specific value */
  toggle: (value: V) => void;
  /** Clear all selections */
  clearAll: () => void;
  /** Select all selectable (non-disabled) items */
  selectAll: () => void;
  /** Set the filter query */
  setFilterQuery: (query: string) => void;
  /** Set the open state */
  setOpen: (open: boolean) => void;
}
