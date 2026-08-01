import { useCallback } from 'react';
import { Search } from '../../Sub-Controls/Search/Search';
import { Filter } from '../../Sub-Controls/Filter/Filter';
import { Icon } from '../../../Assets/Icon/Icon';
import { SearchRegular20, FilterRegular20 } from '../../../Assets/Icon/icons';
import './DropdownFilter.module.css';

export interface DropdownFilterProps {
  /** Controlled search value */
  value?: string;
  /** Change callback — receives the new value string */
  onChange?: (value: string) => void;
  /** Callback when Clear button is clicked */
  onClear?: () => void;
  /** Input placeholder text */
  placeholder?: string;
  /** Show the Filter sub-control button beside the search bar
   *  (Figma: hasFilter=True variant) */
  hasFilter?: boolean;
  /** Callback when the Filter button is clicked */
  onFilterClick?: () => void;
  /** Whether the filter is currently active (shows indicator dot) */
  filterActive?: boolean;
  /** Extra className */
  className?: string;
}

export function DropdownFilter({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  hasFilter = false,
  onFilterClick,
  filterActive = false,
  className,
}: DropdownFilterProps) {
  const classes = [
    'mds-dropdown-filter',
    hasFilter && 'mds-dropdown-filter--has-filter',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  return (
    <div className={classes}>
      <Search
        searchIcon={<Icon size="base">{SearchRegular20}</Icon>}
        size="base"
        value={value}
        onChange={handleChange}
        onClear={onClear}
        placeholder={placeholder}
      />
      {hasFilter && (
        <Filter
          mode="default"
          isActive={filterActive}
          onClick={onFilterClick}
        >
          <Icon size="base">{FilterRegular20}</Icon>
        </Filter>
      )}
    </div>
  );
}
