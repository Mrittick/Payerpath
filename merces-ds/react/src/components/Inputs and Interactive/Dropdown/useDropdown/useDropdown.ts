/* useDropdown — production-ready state management hook
   Encapsulates selection, display text, filtering, keyboard navigation,
   and computed props for the Dropdown component system.

   Zero coupling — existing presentation components remain unchanged.
   Consumers opt-in by spreading the returned props.
*/

import { useState, useCallback, useMemo, useRef } from 'react';
import type {
  DropdownItemDef,
  UseDropdownOptions,
  UseDropdownReturn,
  ItemRenderProps,
  FilterRenderProps,
  KeyboardRenderProps,
  GroupedItems,
} from './types.ts';

/* ---- Helpers ---- */

/** Stable ID prefix for aria-activedescendant */
let idCounter = 0;

function defaultFilterFn<V extends string | number>(
  item: DropdownItemDef<V>,
  query: string,
): boolean {
  return item.label.toLowerCase().includes(query.toLowerCase());
}

function normaliseToSet<V extends string | number>(
  value: V | V[] | undefined,
): Set<V> {
  if (value === undefined) return new Set();
  if (Array.isArray(value)) return new Set(value);
  return new Set([value]);
}

/* ---- Hook ---- */

export function useDropdown<V extends string | number = string>(
  options: UseDropdownOptions<V>,
): UseDropdownReturn<V> {
  const {
    items,
    mode = 'single',
    orientation = 'left',
    selected: controlledSelected,
    defaultSelected,
    onSelectedChange,
    displayTextMode = 'auto',
    maxDisplayLabels = 3,
    allSelectedText = 'All selected',
    formatDisplayText,
    filterable = false,
    filterFn = defaultFilterFn,
    sections,
    keyboardNavigation = true,
  } = options;

  /* ---- Stable ID for this hook instance ---- */
  const idPrefixRef = useRef<string>('');
  if (idPrefixRef.current === '') {
    idCounter += 1;
    idPrefixRef.current = `mds-dd-${idCounter}`;
  }
  const idPrefix = idPrefixRef.current;

  /* ---- Item lookup map (O(1) by value) ---- */
  const itemMap = useMemo(() => {
    const map = new Map<V, DropdownItemDef<V>>();
    for (const item of items) {
      map.set(item.value, item);
    }
    return map;
  }, [items]);

  /* ---- Selectable items (non-disabled) ---- */
  const selectableItems = useMemo(
    () => items.filter((i) => !i.disabled),
    [items],
  );
  const selectableCount = selectableItems.length;

  /* ---- Selection state (controlled / uncontrolled) ---- */
  const isControlled = controlledSelected !== undefined;
  const [internalSelected, setInternalSelected] = useState<Set<V>>(
    () => normaliseToSet(defaultSelected),
  );

  const selectedSet: ReadonlySet<V> = isControlled
    ? normaliseToSet(controlledSelected)
    : internalSelected;

  const updateSelection = useCallback(
    (nextSet: Set<V>) => {
      if (!isControlled) {
        setInternalSelected(nextSet);
      }
      if (onSelectedChange) {
        if (mode === 'single') {
          const values = Array.from(nextSet);
          onSelectedChange(values[0] as V | V[]);
        } else {
          onSelectedChange(Array.from(nextSet));
        }
      }
    },
    [isControlled, onSelectedChange, mode],
  );

  /* ---- Open state ---- */
  const [isOpen, setIsOpenInternal] = useState(false);

  /* ---- Filter state ---- */
  const [filterQuery, setFilterQueryInternal] = useState('');

  /* ---- Highlighted index (keyboard nav) ---- */
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  /* ---- Filtered items ---- */
  const filteredItems = useMemo(() => {
    if (!filterable || filterQuery === '') return items;
    return items.filter((item) => filterFn(item, filterQuery));
  }, [items, filterable, filterQuery, filterFn]);

  /* ---- Navigable items (filtered + non-disabled, for keyboard nav) ---- */
  const navigableItems = useMemo(
    () => filteredItems.filter((i) => !i.disabled),
    [filteredItems],
  );

  /* ---- Grouped items (by section) ---- */
  const groupedItems: readonly GroupedItems<V>[] = useMemo(() => {
    if (!sections || sections.length === 0) {
      return [{ section: undefined, items: filteredItems }];
    }

    const groups: GroupedItems<V>[] = [];
    const sectionMap = new Map<string, DropdownItemDef<V>[]>();

    // Initialise groups in section order
    for (const sectionDef of sections) {
      const key = sectionDef.key ?? sectionDef.title;
      sectionMap.set(key, []);
      groups.push({ section: sectionDef, items: [] });
    }

    // Assign items to their sections
    const ungrouped: DropdownItemDef<V>[] = [];
    for (const item of filteredItems) {
      if (item.section && sectionMap.has(item.section)) {
        sectionMap.get(item.section)!.push(item);
      } else {
        ungrouped.push(item);
      }
    }

    // Populate group items
    for (const group of groups) {
      const key = group.section!.key ?? group.section!.title;
      const sectionItems = sectionMap.get(key);
      if (sectionItems) {
        (group as { items: readonly DropdownItemDef<V>[] }).items = sectionItems;
      }
    }

    // Filter out empty groups
    const nonEmpty = groups.filter((g) => g.items.length > 0);

    // Add ungrouped items at the start if any
    if (ungrouped.length > 0) {
      return [{ section: undefined, items: ungrouped }, ...nonEmpty];
    }

    return nonEmpty;
  }, [filteredItems, sections]);

  /* ---- Computed: selected values ---- */
  const selectedValues = useMemo(
    () => Array.from(selectedSet) as readonly V[],
    [selectedSet],
  );

  /* ---- Computed: isAllSelected ---- */
  const isAllSelected = useMemo(() => {
    if (selectableCount === 0) return false;
    return selectableItems.every((item) => selectedSet.has(item.value));
  }, [selectableItems, selectableCount, selectedSet]);

  /* ---- Computed: display text ---- */
  const displayText = useMemo(() => {
    if (selectedSet.size === 0) return undefined;

    // Custom formatter takes priority
    if (formatDisplayText) {
      const selectedItems = Array.from(selectedSet)
        .map((v) => itemMap.get(v))
        .filter((i): i is DropdownItemDef<V> => i !== undefined);
      const custom = formatDisplayText(selectedItems, Array.from(items));
      if (custom !== undefined) return custom;
    }

    // All selected shortcut
    if (isAllSelected && mode === 'multi') return allSelectedText;

    // Gather labels for selected items
    const labels = Array.from(selectedSet)
      .map((v) => itemMap.get(v)?.label)
      .filter((l): l is string => l !== undefined);

    if (labels.length === 0) return undefined;

    // Single mode: always show the label
    if (mode === 'single') return labels[0];

    // Multi mode: apply display text mode
    switch (displayTextMode) {
      case 'labels':
        return labels.join(', ');
      case 'count':
        return `${labels.length} selected`;
      case 'auto':
      default:
        if (labels.length <= maxDisplayLabels) {
          return labels.join(', ');
        }
        return `${labels.length} selected`;
    }
  }, [
    selectedSet,
    formatDisplayText,
    isAllSelected,
    mode,
    allSelectedText,
    itemMap,
    items,
    displayTextMode,
    maxDisplayLabels,
  ]);

  /* ---- Actions ---- */

  const select = useCallback(
    (value: V) => {
      if (mode === 'single') {
        updateSelection(new Set([value]));
      } else {
        const next = new Set(selectedSet);
        next.add(value);
        updateSelection(next);
      }
    },
    [mode, selectedSet, updateSelection],
  );

  const deselect = useCallback(
    (value: V) => {
      const next = new Set(selectedSet);
      next.delete(value);
      updateSelection(next);
    },
    [selectedSet, updateSelection],
  );

  const toggle = useCallback(
    (value: V) => {
      const item = itemMap.get(value);
      if (item?.disabled) return;

      if (mode === 'single') {
        // Single: clicking the already-selected item is a no-op
        if (!selectedSet.has(value)) {
          updateSelection(new Set([value]));
        }
      } else {
        const next = new Set(selectedSet);
        if (next.has(value)) {
          next.delete(value);
        } else {
          next.add(value);
        }
        updateSelection(next);
      }
    },
    [mode, selectedSet, itemMap, updateSelection],
  );

  const clearAll = useCallback(() => {
    updateSelection(new Set());
  }, [updateSelection]);

  const selectAll = useCallback(() => {
    const all = new Set<V>();
    for (const item of selectableItems) {
      all.add(item.value);
    }
    updateSelection(all);
  }, [selectableItems, updateSelection]);

  /* ---- Open/Close ---- */

  const setOpen = useCallback(
    (open: boolean) => {
      setIsOpenInternal(open);
      // Reset filter query on close (standard UX pattern)
      if (!open && filterable) {
        setFilterQueryInternal('');
        setHighlightedIndex(-1);
      }
    },
    [filterable],
  );

  /* ---- Filter ---- */

  const setFilterQuery = useCallback(
    (query: string) => {
      setFilterQueryInternal(query);
      // Reset highlight when filter changes
      setHighlightedIndex(-1);
    },
    [],
  );

  const filterProps: FilterRenderProps = useMemo(
    () => ({
      value: filterQuery,
      onChange: setFilterQuery,
      onClear: () => setFilterQuery(''),
    }),
    [filterQuery, setFilterQuery],
  );

  /* ---- Keyboard Navigation ---- */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!keyboardNavigation || !isOpen) return;
      if (navigableItems.length === 0) return;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev + 1;
            return next >= navigableItems.length ? 0 : next;
          });
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? navigableItems.length - 1 : next;
          });
          break;
        }
        case 'Home': {
          e.preventDefault();
          setHighlightedIndex(0);
          break;
        }
        case 'End': {
          e.preventDefault();
          setHighlightedIndex(navigableItems.length - 1);
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < navigableItems.length) {
            const item = navigableItems[highlightedIndex];
            toggle(item.value);
            // Single-select: close on select
            if (mode === 'single') {
              setOpen(false);
            }
          }
          break;
        }
        case 'Escape': {
          // Handled by Dropdown component's own Escape handler
          break;
        }
        default:
          break;
      }
    },
    [
      keyboardNavigation,
      isOpen,
      navigableItems,
      highlightedIndex,
      toggle,
      mode,
      setOpen,
    ],
  );

  /* The highlighted item's value (for aria-activedescendant) */
  const highlightedValue =
    highlightedIndex >= 0 && highlightedIndex < navigableItems.length
      ? navigableItems[highlightedIndex].value
      : undefined;

  const keyboardProps: KeyboardRenderProps = useMemo(
    () => ({
      onKeyDown: handleKeyDown,
      role: 'listbox' as const,
      'aria-activedescendant': highlightedValue !== undefined
        ? `${idPrefix}-${String(highlightedValue)}`
        : undefined,
    }),
    [handleKeyDown, highlightedValue, idPrefix],
  );

  /* ---- getItemProps (O(1) lookup) ---- */

  const getItemProps = useCallback(
    (value: V): ItemRenderProps => {
      const item = itemMap.get(value);
      if (!item) {
        // Fallback for unknown values — shouldn't happen in practice
        return {
          id: `${idPrefix}-${String(value)}`,
          label: String(value),
          mode,
          orientation,
          checked: false,
          state: 'default',
          highlighted: false,
          onSelect: () => toggle(value),
        };
      }

      const isHighlighted =
        highlightedValue !== undefined && highlightedValue === value;

      return {
        id: `${idPrefix}-${String(value)}`,
        label: item.label,
        mode,
        orientation,
        checked: selectedSet.has(value),
        state: item.disabled ? 'disabled' : 'default',
        highlighted: isHighlighted,
        onSelect: () => toggle(value),
      };
    },
    [
      itemMap,
      idPrefix,
      mode,
      orientation,
      selectedSet,
      highlightedValue,
      toggle,
    ],
  );

  /* ---- Dropdown spread props ---- */

  const dropdownProps = useMemo(
    () => ({
      value: displayText,
      closeOnSelect: mode === 'single',
      open: isOpen,
      onOpenChange: setOpen,
    }),
    [displayText, mode, isOpen, setOpen],
  );

  /* ---- Return ---- */

  return {
    // Spread props
    dropdownProps,
    getItemProps,
    filterProps,
    keyboardProps,

    // Computed
    displayText,
    selectedSet,
    selectedValues,
    filteredItems,
    groupedItems,
    isAllSelected,
    selectableCount,
    isOpen,
    filterQuery,
    highlightedIndex,

    // Actions
    select,
    deselect,
    toggle,
    clearAll,
    selectAll,
    setFilterQuery,
    setOpen,
  };
}
