import { useState, useCallback, createContext, useContext } from 'react';
import { Dropdown } from './Dropdown/Dropdown';
import { DropdownGroup } from './DropdownGroup/DropdownGroup';
import { DropdownItem } from './DropdownItem/DropdownItem';
import { DropdownSeparator } from './DropdownSeparator/DropdownSeparator';
import { DropdownSection } from './DropdownSection/DropdownSection';
import { DropdownAction } from './DropdownAction/DropdownAction';
import { DropdownMore } from './DropdownMore/DropdownMore';
import { DropdownFilter } from './DropdownFilter/DropdownFilter';
import { FilterTray } from '../Sub-Controls/Filter/FilterTray';
import { CTAButton } from '../CTA Buttons/CTAButton/CTAButton';
import { useDropdown } from './useDropdown/index.ts';
import type { DropdownItemDef } from './useDropdown/index.ts';
import { Icon } from '../../Assets/Icon/Icon';
import { TickBold16, FixRegular16 } from '../../Assets/Icon/icons';
import { LONG_LABELS } from '../../../Data/Mock Data/dropdownData.ts';

/* ---- Text Length Context ---- */

type TextLength = 'short' | 'long';
const TextLengthContext = createContext<TextLength>('short');

/** Returns the appropriate label based on the active text-length mode.
    When "long", looks up the label in LONG_LABELS; falls back to the short label. */
function useLabel(): (shortLabel: string) => string {
  const mode = useContext(TextLengthContext);
  return useCallback(
    (shortLabel: string) => mode === 'long' ? (LONG_LABELS[shortLabel] ?? shortLabel) : shortLabel,
    [mode],
  );
}

/* ---- Layout helpers ---- */

const sectionStyle: React.CSSProperties = {
  marginBottom: 48,
};

const heading: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 12,
  color: 'var(--colour-text-default-base)',
};

const subheading: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  marginBottom: 12,
  color: 'var(--colour-text-default-low-emphasis)',
};

const row: React.CSSProperties = {
  display: 'flex',
  gap: 24,
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  marginBottom: 24,
};

const col: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

/* ================================================================
   Scenario Registry
   ================================================================ */

const SCENARIOS: DropdownItemDef[] = [
  { value: 'all', label: 'All' },
  { value: 'single-basic', label: 'Single Select (Basic)' },
  { value: 'single-sections', label: 'Single Select + Sections' },
  { value: 'single-filter', label: 'Single Select + Search Filter' },
  { value: 'single-search-filter', label: 'Single Select + Search + Filter Button' },
  { value: 'multi-basic', label: 'Multi Select (Basic + Disabled)' },
  { value: 'multi-all', label: 'Multi Select (All Selectable)' },
  { value: 'multi-search', label: 'Multi Select + Search' },
  { value: 'multi-sections', label: 'Multi Select + Sections + Search' },
  { value: 'right-single-search', label: 'Single Select Right (Search)' },
  { value: 'right-multi-search', label: 'Multi Select Right (Search)' },
  { value: 'right-single-search-cat', label: 'Single Select Right (Search + Categorised)' },
  { value: 'right-multi-search-cat', label: 'Multi Select Right (Search + Categorised)' },
  { value: 'right-single-search-filter', label: 'Single Select Right (Search & Filter)' },
  { value: 'right-multi-search-filter', label: 'Multi Select Right (Search & Filter)' },
  { value: 'right-single-cat-search-filter', label: 'Single Select Right (Cat, Search & Filter)' },
  { value: 'right-multi-cat-search-filter', label: 'Multi Select Right (Cat, Search & Filter)' },
  { value: 'group-variants', label: 'Dropdown Group Variants' },
  { value: 'sub-components', label: 'Sub-components (Standalone)' },
  { value: 'trigger-states', label: 'Trigger States' },
  { value: 'hook-single', label: 'Hook: Single Select' },
  { value: 'hook-multi', label: 'Hook: Multi Select' },
  { value: 'hook-multi-search', label: 'Hook: Multi Select + Search' },
  { value: 'hook-multi-sections', label: 'Hook: Multi Select + Sections' },
  { value: 'hook-controlled', label: 'Hook: Controlled Selection' },
];

/* ================================================================
   1. Single Select — Basic
   ================================================================ */

function SingleSelectBasic() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const items = [
    { label: 'Denial Analysis', disabled: false },
    { label: 'Payment Trends', disabled: false },
    { label: 'Aging Report', disabled: false },
    { label: 'Compliance Audit', disabled: true },
  ];

  return (
    <div style={sectionStyle}>
      <div style={heading}>Single Select (Basic)</div>
      <div style={subheading}>Standard dropdown with 4 items, one checked, one disabled</div>
      <div style={{ width: 240 }}>
        <Dropdown
          placeholder="Select report"
          value={selected ? lbl(selected) : undefined}
          style={{ width: '100%' }}
        >
          {items.map((item, i) => (
            <span key={item.label}>
              <DropdownItem
                label={lbl(item.label)}
                mode="single"
                orientation="left"
                checked={selected === item.label}
                state={item.disabled ? 'disabled' : 'default'}
                onSelect={() => setSelected(item.label)}
              />
              {i === 1 && <DropdownSeparator mode="single" orientation="left" />}
            </span>
          ))}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   2. Single Select with Sections + Separator
   ================================================================ */

function SingleSelectSections() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<string | undefined>('Denial Analysis');

  return (
    <div style={sectionStyle}>
      <div style={heading}>Single Select + Sections</div>
      <div style={subheading}>Items grouped by section headers with divider lines</div>
      <div style={{ width: 260 }}>
        <Dropdown
          placeholder="Select report type"
          value={selected ? lbl(selected) : undefined}
          style={{ width: '100%' }}
        >
          <DropdownSection text="Financial" mode="single" orientation="left" />
          <DropdownItem label={lbl('Denial Analysis')} checked={selected === 'Denial Analysis'} onSelect={() => setSelected('Denial Analysis')} />
          <DropdownItem label={lbl('Payment Trends')} checked={selected === 'Payment Trends'} onSelect={() => setSelected('Payment Trends')} />
          <DropdownItem label={lbl('Revenue Cycle')} checked={selected === 'Revenue Cycle'} onSelect={() => setSelected('Revenue Cycle')} />
          <DropdownSeparator mode="single" orientation="left" />
          <DropdownSection text="Operations" mode="single" orientation="left" />
          <DropdownItem label={lbl('Aging Report')} checked={selected === 'Aging Report'} onSelect={() => setSelected('Aging Report')} />
          <DropdownItem label={lbl('Compliance Audit')} checked={selected === 'Compliance Audit'} onSelect={() => setSelected('Compliance Audit')} />
          <DropdownItem label={lbl('Staff Productivity')} state="disabled" checked={false} />
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   3. Single Select Right with Filter + Sections
   ================================================================ */

function SingleSelectRightWithFilter() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<string | undefined>('Rabies');
  const [filterValue, setFilterValue] = useState('');

  const sections = [
    {
      title: 'Communicable',
      items: [
        { label: 'Cholera', disabled: false },
        { label: 'Rabies', disabled: false },
        { label: 'COVID-19', disabled: false },
        { label: 'Measles', disabled: true },
      ],
    },
    {
      title: 'Non - Communicable',
      items: [
        { label: 'Angina', disabled: false },
        { label: 'Melanoma', disabled: false },
        { label: 'Lymphoma', disabled: true },
      ],
    },
  ];

  const filteredSections = sections
    .map((s) => ({
      ...s,
      items: filterValue
        ? s.items.filter((i) => lbl(i.label).toLowerCase().includes(filterValue.toLowerCase()))
        : s.items,
    }))
    .filter((s) => s.items.length > 0);

  return (
    <div style={sectionStyle}>
      <div style={heading}>Single Select + Search Filter</div>
      <div style={subheading}>SingleSelect, Right orientation, with search filter and section headers</div>
      <div style={{ width: 240 }}>
        <Dropdown
          placeholder="Select disease"
          value={selected ? lbl(selected) : undefined}
          style={{ width: '100%' }}
          filter={
            <DropdownFilter
              value={filterValue}
              onChange={setFilterValue}
              onClear={() => setFilterValue('')}
              placeholder="Search..."
            />
          }
        >
          {filteredSections.map((section, si) => (
            <span key={section.title}>
              {si > 0 && <DropdownSeparator mode="single" orientation="right" />}
              <DropdownSection text={section.title} mode="single" orientation="right" />
              {section.items.map((item) => (
                <DropdownItem
                  key={item.label}
                  label={lbl(item.label)}
                  mode="single"
                  orientation="right"
                  checked={selected === item.label}
                  state={item.disabled ? 'disabled' : 'default'}
                  onSelect={() => setSelected(item.label)}
                />
              ))}
            </span>
          ))}
          {filteredSections.length === 0 && (
            <DropdownItem label="No results" mode="single" state="disabled" />
          )}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   3b. Single Select Right with Search + Filter + Sections
   ================================================================ */

function SingleSelectWithSearchFilter() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<string | undefined>('Amoxicillin');
  const [filterValue, setFilterValue] = useState('');
  const [trayOpen, setTrayOpen] = useState(false);

  const sections = [
    {
      title: 'Antibiotics',
      items: [
        { label: 'Amoxicillin', disabled: false },
        { label: 'Azithromycin', disabled: false },
        { label: 'Ciprofloxacin', disabled: true },
      ],
    },
    {
      title: 'Antivirals',
      items: [
        { label: 'Oseltamivir', disabled: false },
        { label: 'Remdesivir', disabled: false },
        { label: 'Acyclovir', disabled: false },
      ],
    },
  ];

  const filteredSections = sections
    .map((s) => ({
      ...s,
      items: filterValue
        ? s.items.filter((i) => lbl(i.label).toLowerCase().includes(filterValue.toLowerCase()))
        : s.items,
    }))
    .filter((s) => s.items.length > 0);

  const handleTrayClose = useCallback(() => setTrayOpen(false), []);
  const handleTrayApply = useCallback(() => setTrayOpen(false), []);

  return (
    <div style={sectionStyle}>
      <div style={heading}>Single Select + Search + Filter Button</div>
      <div style={subheading}>hasFilter=True variant: Search bar + Filter button opens FilterTray sidebar</div>
      <div style={{ width: 260 }}>
        <Dropdown
          placeholder="Select medication"
          value={selected ? lbl(selected) : undefined}
          style={{ width: '100%' }}
          filter={
            <DropdownFilter
              value={filterValue}
              onChange={setFilterValue}
              onClear={() => setFilterValue('')}
              placeholder="Search..."
              hasFilter
              filterActive={false}
              onFilterClick={() => setTrayOpen(true)}
            />
          }
        >
          {filteredSections.map((section, si) => (
            <span key={section.title}>
              {si > 0 && <DropdownSeparator mode="single" orientation="right" />}
              <DropdownSection text={section.title} mode="single" orientation="right" />
              {section.items.map((item) => (
                <DropdownItem
                  key={item.label}
                  label={lbl(item.label)}
                  mode="single"
                  orientation="right"
                  checked={selected === item.label}
                  state={item.disabled ? 'disabled' : 'default'}
                  onSelect={() => setSelected(item.label)}
                />
              ))}
            </span>
          ))}
          {filteredSections.length === 0 && (
            <DropdownItem label="No results" mode="single" state="disabled" />
          )}
        </Dropdown>
      </div>

      {/* FilterTray — slide-in sidebar (empty state) */}
      <FilterTray
        open={trayOpen}
        onClose={handleTrayClose}
        onApply={handleTrayApply}
        selectionSlot={
          <>
            <CTAButton ctaType="tertiary" colorTheme="brand" size="base" label="Select all" />
            <CTAButton ctaType="tertiary" colorTheme="brand" size="base" label="Deselect all" />
          </>
        }
      />
    </div>
  );
}

/* ================================================================
   4. Multi Select (Basic)
   ================================================================ */

function MultiSelectBasic() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<Set<string>>(new Set(['Cardiology', 'Oncology']));
  const [open, setOpen] = useState(false);

  const toggle = useCallback((label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const items = [
    { label: 'Cardiology', disabled: false },
    { label: 'Oncology', disabled: false },
    { label: 'Neurology', disabled: false },
    { label: 'Pediatrics', disabled: true },
    { label: 'Radiology', disabled: false },
  ];
  const selectableCount = items.filter((i) => !i.disabled).length;
  const displayText = selected.size === 0
    ? undefined
    : selected.size >= selectableCount
      ? 'All selected'
      : Array.from(selected).map(lbl).join(', ');

  return (
    <div style={sectionStyle}>
      <div style={heading}>Multi Select (Basic + Disabled)</div>
      <div style={subheading}>MultiSelect mode with checkbox items + disabled item + "Done" action</div>
      <div style={{ width: 260 }}>
        <Dropdown
          placeholder="Select departments"
          value={displayText}
          open={open}
          onOpenChange={setOpen}
          closeOnSelect={false}
          style={{ width: '100%' }}
          action={
            <DropdownAction
              text="Done"
              icon={<Icon size="mini">{TickBold16}</Icon>}
              onClick={() => setOpen(false)}
            />
          }
        >
          {items.map((item) => (
            <DropdownItem
              key={item.label}
              label={lbl(item.label)}
              mode="multi"
              orientation="left"
              checked={selected.has(item.label)}
              state={item.disabled ? 'disabled' : 'default'}
              onSelect={() => toggle(item.label)}
            />
          ))}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   4b. Multi Select (All Selectable)
   ================================================================ */

function MultiSelectAllSelectable() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<Set<string>>(new Set(['Inpatient', 'Emergency']));
  const [open, setOpen] = useState(false);

  const toggle = useCallback((label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const items = ['Inpatient', 'Outpatient', 'Emergency', 'Surgical', 'Diagnostic'];
  const displayText = selected.size === 0
    ? undefined
    : selected.size >= items.length
      ? 'All selected'
      : Array.from(selected).map(lbl).join(', ');

  return (
    <div style={sectionStyle}>
      <div style={heading}>Multi Select (All Selectable)</div>
      <div style={subheading}>MultiSelect mode — all items enabled, no disabled states</div>
      <div style={{ width: 260 }}>
        <Dropdown
          placeholder="Select services"
          value={displayText}
          open={open}
          onOpenChange={setOpen}
          closeOnSelect={false}
          style={{ width: '100%' }}
          action={
            <DropdownAction
              text="Done"
              icon={<Icon size="mini">{TickBold16}</Icon>}
              onClick={() => setOpen(false)}
            />
          }
        >
          {items.map((item) => (
            <DropdownItem
              key={item}
              label={lbl(item)}
              mode="multi"
              orientation="left"
              checked={selected.has(item)}
              onSelect={() => toggle(item)}
            />
          ))}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   5. Multi Select with Search
   ================================================================ */

function MultiSelectWithSearch() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<Set<string>>(new Set(['ICD-10']));
  const [filterValue, setFilterValue] = useState('');
  const [open, setOpen] = useState(false);

  const toggle = useCallback((label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const allItems = ['ICD-10', 'ICD-11', 'CPT', 'HCPCS', 'DRG', 'NDC', 'SNOMED CT'];
  const filtered = filterValue
    ? allItems.filter((i) => lbl(i).toLowerCase().includes(filterValue.toLowerCase()))
    : allItems;

  const displayText = selected.size === 0
    ? undefined
    : selected.size >= allItems.length
      ? 'All selected'
      : Array.from(selected).map(lbl).join(', ');

  return (
    <div style={sectionStyle}>
      <div style={heading}>Multi Select + Search</div>
      <div style={subheading}>MultiSelect with DropdownFilter + "Done" action</div>
      <div style={{ width: 280 }}>
        <Dropdown
          placeholder="Select code systems"
          value={displayText}
          open={open}
          onOpenChange={setOpen}
          closeOnSelect={false}
          style={{ width: '100%' }}
          filter={
            <DropdownFilter
              value={filterValue}
              onChange={setFilterValue}
              onClear={() => setFilterValue('')}
              placeholder="Search codes..."
            />
          }
          action={
            <DropdownAction
              text="Done"
              icon={<Icon size="mini">{TickBold16}</Icon>}
              onClick={() => setOpen(false)}
            />
          }
        >
          {filtered.map((item) => (
            <DropdownItem
              key={item}
              label={lbl(item)}
              mode="multi"
              orientation="left"
              checked={selected.has(item)}
              onSelect={() => toggle(item)}
            />
          ))}
          {filtered.length === 0 && (
            <DropdownItem label="No results" mode="single" state="disabled" />
          )}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   6. Multi Select with Sections + Search + Action
   ================================================================ */

function MultiSelectFull() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<Set<string>>(new Set(['Claim Submission', 'Eligibility Check']));
  const [filterValue, setFilterValue] = useState('');
  const [open, setOpen] = useState(false);

  const toggle = useCallback((label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const allItems = [
    'Claim Submission',
    'Eligibility Check',
    'Prior Authorization',
    'Payment Posting',
    'Denial Management',
    'Appeal Filing',
    'Patient Billing',
  ];
  const filtered = filterValue
    ? allItems.filter((i) => lbl(i).toLowerCase().includes(filterValue.toLowerCase()))
    : allItems;

  const displayText = selected.size === 0
    ? undefined
    : selected.size >= allItems.length
      ? 'All selected'
      : Array.from(selected).map(lbl).join(', ');

  return (
    <div style={sectionStyle}>
      <div style={heading}>Multi Select + Sections + Search</div>
      <div style={subheading}>Full-featured — Filter + sections + checkbox items + "Done" action button</div>
      <div style={{ width: 300 }}>
        <Dropdown
          placeholder="Select workflows"
          value={displayText}
          open={open}
          onOpenChange={setOpen}
          closeOnSelect={false}
          style={{ width: '100%' }}
          filter={
            <DropdownFilter
              value={filterValue}
              onChange={setFilterValue}
              onClear={() => setFilterValue('')}
              placeholder="Search workflows..."
            />
          }
          action={
            <DropdownAction
              text="Done"
              icon={<Icon size="mini">{TickBold16}</Icon>}
              onClick={() => setOpen(false)}
            />
          }
        >
          <DropdownSection text="Primary" mode="multi" orientation="left" />
          {filtered.slice(0, 4).map((item) => (
            <DropdownItem
              key={item}
              label={lbl(item)}
              mode="multi"
              orientation="left"
              checked={selected.has(item)}
              onSelect={() => toggle(item)}
            />
          ))}
          <DropdownSeparator mode="multi" orientation="left" />
          <DropdownSection text="Secondary" mode="multi" orientation="left" />
          {filtered.slice(4).map((item) => (
            <DropdownItem
              key={item}
              label={lbl(item)}
              mode="multi"
              orientation="left"
              checked={selected.has(item)}
              onSelect={() => toggle(item)}
            />
          ))}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   7. Single Select Right (Search)
   ================================================================ */

function SingleSelectRightSearch() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<string | undefined>('Orange');
  const [filterValue, setFilterValue] = useState('');

  const allItems = [
    { label: 'Apple', disabled: false },
    { label: 'Orange', disabled: false },
    { label: 'Lemon', disabled: false },
    { label: 'Kiwi', disabled: true },
  ];

  const filtered = filterValue
    ? allItems.filter((i) => lbl(i.label).toLowerCase().includes(filterValue.toLowerCase()))
    : allItems;

  return (
    <div style={sectionStyle}>
      <div style={heading}>Single Select Right (Search)</div>
      <div style={subheading}>SingleSelect, Right orientation, with search filter</div>
      <div style={{ width: 240 }}>
        <Dropdown
          placeholder="Select fruit"
          value={selected ? lbl(selected) : undefined}
          style={{ width: '100%' }}
          filter={
            <DropdownFilter
              value={filterValue}
              onChange={setFilterValue}
              onClear={() => setFilterValue('')}
              placeholder="Search..."
            />
          }
        >
          {filtered.map((item) => (
            <DropdownItem
              key={item.label}
              label={lbl(item.label)}
              mode="single"
              orientation="right"
              checked={selected === item.label}
              state={item.disabled ? 'disabled' : 'default'}
              onSelect={() => setSelected(item.label)}
            />
          ))}
          {filtered.length === 0 && (
            <DropdownItem label="No results" mode="single" state="disabled" />
          )}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   8. Multi Select Right (Search)
   ================================================================ */

function MultiSelectRightSearch() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<Set<string>>(new Set(['Paracetamol']));
  const [filterValue, setFilterValue] = useState('');
  const [open, setOpen] = useState(false);

  const toggle = useCallback((label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const allItems = [
    { label: 'Paracetamol', disabled: false },
    { label: 'Ibuprofen', disabled: false },
    { label: 'Aspirin', disabled: false },
    { label: 'Codeine', disabled: true },
  ];

  const filtered = filterValue
    ? allItems.filter((i) => lbl(i.label).toLowerCase().includes(filterValue.toLowerCase()))
    : allItems;

  const displayText = selected.size === 0
    ? undefined
    : Array.from(selected).map(lbl).join(', ');

  return (
    <div style={sectionStyle}>
      <div style={heading}>Multi Select Right (Search)</div>
      <div style={subheading}>MultiSelect, Right orientation, with search filter + Done action</div>
      <div style={{ width: 260 }}>
        <Dropdown
          placeholder="Select medications"
          value={displayText}
          open={open}
          onOpenChange={setOpen}
          closeOnSelect={false}
          style={{ width: '100%' }}
          filter={
            <DropdownFilter
              value={filterValue}
              onChange={setFilterValue}
              onClear={() => setFilterValue('')}
              placeholder="Search..."
            />
          }
          action={
            <DropdownAction
              text="Done"
              icon={<Icon size="mini">{TickBold16}</Icon>}
              onClick={() => setOpen(false)}
            />
          }
        >
          {filtered.map((item) => (
            <DropdownItem
              key={item.label}
              label={lbl(item.label)}
              mode="multi"
              orientation="right"
              checked={selected.has(item.label)}
              state={item.disabled ? 'disabled' : 'default'}
              onSelect={() => toggle(item.label)}
            />
          ))}
          {filtered.length === 0 && (
            <DropdownItem label="No results" mode="single" state="disabled" />
          )}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   9. Single Select Right (Search + Categorised)
   ================================================================ */

function SingleSelectRightSearchCategorised() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<string | undefined>('Rabies');
  const [filterValue, setFilterValue] = useState('');

  const sections = [
    {
      title: 'Communicable',
      items: [
        { label: 'Cholera', disabled: false },
        { label: 'Rabies', disabled: false },
        { label: 'COVID-19', disabled: false },
        { label: 'Measles', disabled: true },
      ],
    },
    {
      title: 'Non - Communicable',
      items: [
        { label: 'Angina', disabled: false },
        { label: 'Melanoma', disabled: false },
        { label: 'Lymphoma', disabled: true },
      ],
    },
  ];

  const filteredSections = sections
    .map((s) => ({
      ...s,
      items: filterValue
        ? s.items.filter((i) => lbl(i.label).toLowerCase().includes(filterValue.toLowerCase()))
        : s.items,
    }))
    .filter((s) => s.items.length > 0);

  return (
    <div style={sectionStyle}>
      <div style={heading}>Single Select Right (Search + Categorised)</div>
      <div style={subheading}>SingleSelect, Right orientation, search + section headers</div>
      <div style={{ width: 240 }}>
        <Dropdown
          placeholder="Select disease"
          value={selected ? lbl(selected) : undefined}
          style={{ width: '100%' }}
          filter={
            <DropdownFilter
              value={filterValue}
              onChange={setFilterValue}
              onClear={() => setFilterValue('')}
              placeholder="Search..."
            />
          }
        >
          {filteredSections.map((section, si) => (
            <span key={section.title}>
              {si > 0 && <DropdownSeparator mode="single" orientation="right" />}
              <DropdownSection text={section.title} mode="single" orientation="right" />
              {section.items.map((item) => (
                <DropdownItem
                  key={item.label}
                  label={lbl(item.label)}
                  mode="single"
                  orientation="right"
                  checked={selected === item.label}
                  state={item.disabled ? 'disabled' : 'default'}
                  onSelect={() => setSelected(item.label)}
                />
              ))}
            </span>
          ))}
          {filteredSections.length === 0 && (
            <DropdownItem label="No results" mode="single" state="disabled" />
          )}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   10. Multi Select Right (Search + Categorised)
   ================================================================ */

function MultiSelectRightSearchCategorised() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<Set<string>>(new Set(['Rabies']));
  const [filterValue, setFilterValue] = useState('');
  const [open, setOpen] = useState(false);

  const toggle = useCallback((label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const sections = [
    {
      title: 'Communicable',
      items: [
        { label: 'Cholera', disabled: false },
        { label: 'Rabies', disabled: false },
        { label: 'COVID-19', disabled: false },
        { label: 'Measles', disabled: true },
      ],
    },
    {
      title: 'Non - Communicable',
      items: [
        { label: 'Angina', disabled: false },
        { label: 'Melanoma', disabled: false },
        { label: 'Lymphoma', disabled: true },
      ],
    },
  ];

  const filteredSections = sections
    .map((s) => ({
      ...s,
      items: filterValue
        ? s.items.filter((i) => lbl(i.label).toLowerCase().includes(filterValue.toLowerCase()))
        : s.items,
    }))
    .filter((s) => s.items.length > 0);

  const displayText = selected.size === 0
    ? undefined
    : Array.from(selected).map(lbl).join(', ');

  return (
    <div style={sectionStyle}>
      <div style={heading}>Multi Select Right (Search + Categorised)</div>
      <div style={subheading}>MultiSelect, Right orientation, search + section headers + Done action</div>
      <div style={{ width: 260 }}>
        <Dropdown
          placeholder="Select diseases"
          value={displayText}
          open={open}
          onOpenChange={setOpen}
          closeOnSelect={false}
          style={{ width: '100%' }}
          filter={
            <DropdownFilter
              value={filterValue}
              onChange={setFilterValue}
              onClear={() => setFilterValue('')}
              placeholder="Search..."
            />
          }
          action={
            <DropdownAction
              text="Done"
              icon={<Icon size="mini">{TickBold16}</Icon>}
              onClick={() => setOpen(false)}
            />
          }
        >
          {filteredSections.map((section, si) => (
            <span key={section.title}>
              {si > 0 && <DropdownSeparator mode="multi" orientation="right" />}
              <DropdownSection text={section.title} mode="multi" orientation="right" />
              {section.items.map((item) => (
                <DropdownItem
                  key={item.label}
                  label={lbl(item.label)}
                  mode="multi"
                  orientation="right"
                  checked={selected.has(item.label)}
                  state={item.disabled ? 'disabled' : 'default'}
                  onSelect={() => toggle(item.label)}
                />
              ))}
            </span>
          ))}
          {filteredSections.length === 0 && (
            <DropdownItem label="No results" mode="single" state="disabled" />
          )}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   11. Single Select Right (Search & Filter)
   ================================================================ */

function SingleSelectRightSearchAndFilter() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<string | undefined>('Orange');
  const [filterValue, setFilterValue] = useState('');
  const [trayOpen, setTrayOpen] = useState(false);

  const allItems = [
    { label: 'Apple', disabled: false },
    { label: 'Orange', disabled: false },
    { label: 'Lemon', disabled: false },
    { label: 'Kiwi', disabled: true },
  ];

  const filtered = filterValue
    ? allItems.filter((i) => lbl(i.label).toLowerCase().includes(filterValue.toLowerCase()))
    : allItems;

  const handleTrayClose = useCallback(() => setTrayOpen(false), []);
  const handleTrayApply = useCallback(() => setTrayOpen(false), []);

  return (
    <div style={sectionStyle}>
      <div style={heading}>Single Select Right (Search &amp; Filter)</div>
      <div style={subheading}>SingleSelect, Right orientation, search + filter button + FilterTray</div>
      <div style={{ width: 240 }}>
        <Dropdown
          placeholder="Select fruit"
          value={selected ? lbl(selected) : undefined}
          style={{ width: '100%' }}
          filter={
            <DropdownFilter
              value={filterValue}
              onChange={setFilterValue}
              onClear={() => setFilterValue('')}
              placeholder="Search..."
              hasFilter
              filterActive={false}
              onFilterClick={() => setTrayOpen(true)}
            />
          }
        >
          {filtered.map((item) => (
            <DropdownItem
              key={item.label}
              label={lbl(item.label)}
              mode="single"
              orientation="right"
              checked={selected === item.label}
              state={item.disabled ? 'disabled' : 'default'}
              onSelect={() => setSelected(item.label)}
            />
          ))}
          {filtered.length === 0 && (
            <DropdownItem label="No results" mode="single" state="disabled" />
          )}
        </Dropdown>
      </div>
      <FilterTray
        open={trayOpen}
        onClose={handleTrayClose}
        onApply={handleTrayApply}
        selectionSlot={
          <>
            <CTAButton ctaType="tertiary" colorTheme="brand" size="base" label="Select all" />
            <CTAButton ctaType="tertiary" colorTheme="brand" size="base" label="Deselect all" />
          </>
        }
      />
    </div>
  );
}

/* ================================================================
   12. Multi Select Right (Search & Filter)
   ================================================================ */

function MultiSelectRightSearchAndFilter() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<Set<string>>(new Set(['Paracetamol']));
  const [filterValue, setFilterValue] = useState('');
  const [open, setOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);

  const toggle = useCallback((label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const allItems = [
    { label: 'Paracetamol', disabled: false },
    { label: 'Ibuprofen', disabled: false },
    { label: 'Aspirin', disabled: false },
    { label: 'Codeine', disabled: true },
  ];

  const filtered = filterValue
    ? allItems.filter((i) => lbl(i.label).toLowerCase().includes(filterValue.toLowerCase()))
    : allItems;

  const displayText = selected.size === 0
    ? undefined
    : Array.from(selected).map(lbl).join(', ');

  const handleTrayClose = useCallback(() => setTrayOpen(false), []);
  const handleTrayApply = useCallback(() => setTrayOpen(false), []);

  return (
    <div style={sectionStyle}>
      <div style={heading}>Multi Select Right (Search &amp; Filter)</div>
      <div style={subheading}>MultiSelect, Right orientation, search + filter button + Done action</div>
      <div style={{ width: 260 }}>
        <Dropdown
          placeholder="Select medications"
          value={displayText}
          open={open}
          onOpenChange={setOpen}
          closeOnSelect={false}
          style={{ width: '100%' }}
          filter={
            <DropdownFilter
              value={filterValue}
              onChange={setFilterValue}
              onClear={() => setFilterValue('')}
              placeholder="Search..."
              hasFilter
              filterActive={false}
              onFilterClick={() => setTrayOpen(true)}
            />
          }
          action={
            <DropdownAction
              text="Done"
              icon={<Icon size="mini">{TickBold16}</Icon>}
              onClick={() => setOpen(false)}
            />
          }
        >
          {filtered.map((item) => (
            <DropdownItem
              key={item.label}
              label={lbl(item.label)}
              mode="multi"
              orientation="right"
              checked={selected.has(item.label)}
              state={item.disabled ? 'disabled' : 'default'}
              onSelect={() => toggle(item.label)}
            />
          ))}
          {filtered.length === 0 && (
            <DropdownItem label="No results" mode="single" state="disabled" />
          )}
        </Dropdown>
      </div>
      <FilterTray
        open={trayOpen}
        onClose={handleTrayClose}
        onApply={handleTrayApply}
        selectionSlot={
          <>
            <CTAButton ctaType="tertiary" colorTheme="brand" size="base" label="Select all" />
            <CTAButton ctaType="tertiary" colorTheme="brand" size="base" label="Deselect all" />
          </>
        }
      />
    </div>
  );
}

/* ================================================================
   13. Single Select Right (Categorised, Search & Filter)
   ================================================================ */

function SingleSelectRightCatSearchFilter() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<string | undefined>('Rabies');
  const [filterValue, setFilterValue] = useState('');
  const [trayOpen, setTrayOpen] = useState(false);

  const sections = [
    {
      title: 'Communicable',
      items: [
        { label: 'Cholera', disabled: false },
        { label: 'Rabies', disabled: false },
        { label: 'COVID-19', disabled: false },
        { label: 'Measles', disabled: true },
      ],
    },
    {
      title: 'Non - Communicable',
      items: [
        { label: 'Angina', disabled: false },
        { label: 'Melanoma', disabled: false },
        { label: 'Lymphoma', disabled: true },
      ],
    },
  ];

  const filteredSections = sections
    .map((s) => ({
      ...s,
      items: filterValue
        ? s.items.filter((i) => lbl(i.label).toLowerCase().includes(filterValue.toLowerCase()))
        : s.items,
    }))
    .filter((s) => s.items.length > 0);

  const handleTrayClose = useCallback(() => setTrayOpen(false), []);
  const handleTrayApply = useCallback(() => setTrayOpen(false), []);

  return (
    <div style={sectionStyle}>
      <div style={heading}>Single Select Right (Categorised, Search &amp; Filter)</div>
      <div style={subheading}>SingleSelect, Right orientation, sections + search + filter button</div>
      <div style={{ width: 260 }}>
        <Dropdown
          placeholder="Select disease"
          value={selected ? lbl(selected) : undefined}
          style={{ width: '100%' }}
          filter={
            <DropdownFilter
              value={filterValue}
              onChange={setFilterValue}
              onClear={() => setFilterValue('')}
              placeholder="Search..."
              hasFilter
              filterActive={false}
              onFilterClick={() => setTrayOpen(true)}
            />
          }
        >
          {filteredSections.map((section, si) => (
            <span key={section.title}>
              {si > 0 && <DropdownSeparator mode="single" orientation="right" />}
              <DropdownSection text={section.title} mode="single" orientation="right" />
              {section.items.map((item) => (
                <DropdownItem
                  key={item.label}
                  label={lbl(item.label)}
                  mode="single"
                  orientation="right"
                  checked={selected === item.label}
                  state={item.disabled ? 'disabled' : 'default'}
                  onSelect={() => setSelected(item.label)}
                />
              ))}
            </span>
          ))}
          {filteredSections.length === 0 && (
            <DropdownItem label="No results" mode="single" state="disabled" />
          )}
        </Dropdown>
      </div>
      <FilterTray
        open={trayOpen}
        onClose={handleTrayClose}
        onApply={handleTrayApply}
        selectionSlot={
          <>
            <CTAButton ctaType="tertiary" colorTheme="brand" size="base" label="Select all" />
            <CTAButton ctaType="tertiary" colorTheme="brand" size="base" label="Deselect all" />
          </>
        }
      />
    </div>
  );
}

/* ================================================================
   14. Multi Select Right (Categorised, Search & Filter)
   ================================================================ */

function MultiSelectRightCatSearchFilter() {
  const lbl = useLabel();
  const [selected, setSelected] = useState<Set<string>>(new Set(['Rabies']));
  const [filterValue, setFilterValue] = useState('');
  const [open, setOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);

  const toggle = useCallback((label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const sections = [
    {
      title: 'Communicable',
      items: [
        { label: 'Cholera', disabled: false },
        { label: 'Rabies', disabled: false },
        { label: 'COVID-19', disabled: false },
        { label: 'Measles', disabled: true },
      ],
    },
    {
      title: 'Non - Communicable',
      items: [
        { label: 'Angina', disabled: false },
        { label: 'Melanoma', disabled: false },
        { label: 'Lymphoma', disabled: true },
      ],
    },
  ];

  const filteredSections = sections
    .map((s) => ({
      ...s,
      items: filterValue
        ? s.items.filter((i) => lbl(i.label).toLowerCase().includes(filterValue.toLowerCase()))
        : s.items,
    }))
    .filter((s) => s.items.length > 0);

  const displayText = selected.size === 0
    ? undefined
    : Array.from(selected).map(lbl).join(', ');

  const handleTrayClose = useCallback(() => setTrayOpen(false), []);
  const handleTrayApply = useCallback(() => setTrayOpen(false), []);

  return (
    <div style={sectionStyle}>
      <div style={heading}>Multi Select Right (Categorised, Search &amp; Filter)</div>
      <div style={subheading}>MultiSelect, Right orientation, sections + search + filter + Done action</div>
      <div style={{ width: 280 }}>
        <Dropdown
          placeholder="Select diseases"
          value={displayText}
          open={open}
          onOpenChange={setOpen}
          closeOnSelect={false}
          style={{ width: '100%' }}
          filter={
            <DropdownFilter
              value={filterValue}
              onChange={setFilterValue}
              onClear={() => setFilterValue('')}
              placeholder="Search..."
              hasFilter
              filterActive={false}
              onFilterClick={() => setTrayOpen(true)}
            />
          }
          action={
            <DropdownAction
              text="Done"
              icon={<Icon size="mini">{TickBold16}</Icon>}
              onClick={() => setOpen(false)}
            />
          }
        >
          {filteredSections.map((section, si) => (
            <span key={section.title}>
              {si > 0 && <DropdownSeparator mode="multi" orientation="right" />}
              <DropdownSection text={section.title} mode="multi" orientation="right" />
              {section.items.map((item) => (
                <DropdownItem
                  key={item.label}
                  label={lbl(item.label)}
                  mode="multi"
                  orientation="right"
                  checked={selected.has(item.label)}
                  state={item.disabled ? 'disabled' : 'default'}
                  onSelect={() => toggle(item.label)}
                />
              ))}
            </span>
          ))}
          {filteredSections.length === 0 && (
            <DropdownItem label="No results" mode="single" state="disabled" />
          )}
        </Dropdown>
      </div>
      <FilterTray
        open={trayOpen}
        onClose={handleTrayClose}
        onApply={handleTrayApply}
        selectionSlot={
          <>
            <CTAButton ctaType="tertiary" colorTheme="brand" size="base" label="Select all" />
            <CTAButton ctaType="tertiary" colorTheme="brand" size="base" label="Deselect all" />
          </>
        }
      />
    </div>
  );
}

/* ================================================================
   15. Dropdown Group Variants
   ================================================================ */

function DropdownGroupVariants() {
  const [val1, setVal1] = useState<string | undefined>('Option A');
  const [val2, setVal2] = useState<string | undefined>(undefined);
  const items = ['Option A', 'Option B', 'Option C'];

  return (
    <div style={sectionStyle}>
      <div style={heading}>Dropdown Group Variants</div>
      <div style={subheading}>Vertical / Horizontal / Span / MoreInfo layouts</div>
      <div style={{ ...row, gap: 48 }}>
        {/* Vertical */}
        <div style={{ ...col, width: 240 }}>
          <div style={subheading}>Vertical</div>
          <DropdownGroup label="Report Type" layout="vertical">
            <Dropdown placeholder="Select type" value={val1} style={{ width: '100%' }}>
              {items.map((i) => (
                <DropdownItem key={i} label={i} checked={val1 === i} onSelect={() => setVal1(i)} />
              ))}
            </Dropdown>
          </DropdownGroup>
        </div>

        {/* Horizontal */}
        <div style={{ ...col, width: 400 }}>
          <div style={subheading}>Horizontal</div>
          <DropdownGroup label="Department" layout="horizontal">
            <Dropdown placeholder="Select" value={val2} style={{ width: '100%' }}>
              {items.map((i) => (
                <DropdownItem key={i} label={i} checked={val2 === i} onSelect={() => setVal2(i)} />
              ))}
            </Dropdown>
          </DropdownGroup>
        </div>

        {/* Horizontal + Span */}
        <div style={{ ...col, width: 400 }}>
          <div style={subheading}>Horizontal + Span</div>
          <DropdownGroup label="Category" layout="horizontal" span>
            <Dropdown placeholder="Select" style={{ width: '100%' }}>
              {items.map((i) => (
                <DropdownItem key={i} label={i} />
              ))}
            </Dropdown>
          </DropdownGroup>
        </div>

        {/* Vertical + MoreInfo */}
        <div style={{ ...col, width: 240 }}>
          <div style={subheading}>Vertical + MoreInfo</div>
          <DropdownGroup label="Insurance Plan" layout="vertical" moreInfo onMoreInfoClick={() => alert('More info clicked')}>
            <Dropdown placeholder="Select plan" style={{ width: '100%' }}>
              {items.map((i) => (
                <DropdownItem key={i} label={i} />
              ))}
            </Dropdown>
          </DropdownGroup>
        </div>

        {/* Horizontal + MoreInfo */}
        <div style={{ ...col, width: 400 }}>
          <div style={subheading}>Horizontal + MoreInfo</div>
          <DropdownGroup label="Priority" layout="horizontal" moreInfo onMoreInfoClick={() => alert('More info clicked')}>
            <Dropdown placeholder="Select" style={{ width: '100%' }}>
              {items.map((i) => (
                <DropdownItem key={i} label={i} />
              ))}
            </Dropdown>
          </DropdownGroup>
        </div>

        {/* Horizontal + Span + MoreInfo */}
        <div style={{ ...col, width: 400 }}>
          <div style={subheading}>Horizontal + Span + MoreInfo</div>
          <DropdownGroup label="Region" layout="horizontal" span moreInfo onMoreInfoClick={() => alert('More info clicked')}>
            <Dropdown placeholder="Select" style={{ width: '100%' }}>
              {items.map((i) => (
                <DropdownItem key={i} label={i} />
              ))}
            </Dropdown>
          </DropdownGroup>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   8. Sub-components Standalone
   ================================================================ */

function SubComponentsShowcase() {
  return (
    <div style={sectionStyle}>
      <div style={heading}>Sub-components (Standalone)</div>
      <div style={subheading}>Individual sub-component variants for visual verification</div>

      <div style={row}>
        {/* DropdownItem states */}
        <div style={{ ...col, width: 200, border: '1px solid var(--colour-stroke-divider-primary-light)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', fontSize: 11, fontWeight: 700, color: 'var(--colour-text-default-low-emphasis)' }}>SingleSelect Left</div>
          <DropdownItem label="Default" checked={false} />
          <DropdownItem label="Checked" checked />
          <DropdownItem label="Hover" state="hover" />
          <DropdownItem label="Pressed" state="pressed" />
          <DropdownItem label="Disabled" state="disabled" />
        </div>

        {/* Right orientation */}
        <div style={{ ...col, width: 200, border: '1px solid var(--colour-stroke-divider-primary-light)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', fontSize: 11, fontWeight: 700, color: 'var(--colour-text-default-low-emphasis)' }}>SingleSelect Right</div>
          <DropdownItem label="Default" orientation="right" checked={false} />
          <DropdownItem label="Checked" orientation="right" checked />
          <DropdownItem label="Hover" orientation="right" state="hover" />
        </div>

        {/* MultiSelect */}
        <div style={{ ...col, width: 240, border: '1px solid var(--colour-stroke-divider-primary-light)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', fontSize: 11, fontWeight: 700, color: 'var(--colour-text-default-low-emphasis)' }}>MultiSelect Left</div>
          <DropdownItem label="Unchecked" mode="multi" checked={false} />
          <DropdownItem label="Checked" mode="multi" checked />
          <DropdownItem label="Hover" mode="multi" state="hover" />
          <DropdownItem label="Disabled" mode="multi" state="disabled" />
        </div>

        {/* With MoreInfo */}
        <div style={{ ...col, width: 220, border: '1px solid var(--colour-stroke-divider-primary-light)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', fontSize: 11, fontWeight: 700, color: 'var(--colour-text-default-low-emphasis)' }}>With MoreInfo</div>
          <DropdownItem label="Item" moreInfo />
          <DropdownItem label="Checked" moreInfo checked />
        </div>
      </div>

      {/* Other sub-components */}
      <div style={{ ...row, marginTop: 16 }}>
        <div style={{ ...col, width: 240, border: '1px solid var(--colour-stroke-divider-primary-light)', borderRadius: 8, overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '8px 14px', fontSize: 11, fontWeight: 700, color: 'var(--colour-text-default-low-emphasis)' }}>Section + Separator + More</div>
          <DropdownSection text="Section Title" />
          <DropdownItem label="Item One" />
          <DropdownItem label="Item Two" checked />
          <DropdownSeparator />
          <DropdownSection text="Another Section" />
          <DropdownItem label="Item Three" />
          <DropdownMore />
        </div>

        <div style={{ ...col, width: 240, border: '1px solid var(--colour-stroke-divider-primary-light)', borderRadius: 8, overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '8px 14px', fontSize: 11, fontWeight: 700, color: 'var(--colour-text-default-low-emphasis)' }}>Action Button</div>
          <DropdownAction text="Done" icon={<Icon size="mini">{TickBold16}</Icon>} />
          <DropdownAction text="Manage Reports" icon={<Icon size="mini">{FixRegular16}</Icon>} />
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   9. Trigger States
   ================================================================ */

function TriggerStates() {
  return (
    <div style={sectionStyle}>
      <div style={heading}>Trigger States</div>
      <div style={subheading}>Default / Hover / Disabled / Focus states (prop-driven)</div>
      <div style={row}>
        <div style={col}>
          <div style={subheading}>Default (unselected)</div>
          <Dropdown placeholder="Select" style={{ width: 200 }}>
            <DropdownItem label="Option" />
          </Dropdown>
        </div>

        <div style={col}>
          <div style={subheading}>Default (selected)</div>
          <Dropdown placeholder="Select" value="Denial Analysis" style={{ width: 200 }}>
            <DropdownItem label="Denial Analysis" checked />
          </Dropdown>
        </div>

        <div style={col}>
          <div style={subheading}>Hover</div>
          <Dropdown placeholder="Select" state="hover" style={{ width: 200 }}>
            <DropdownItem label="Option" />
          </Dropdown>
        </div>

        <div style={col}>
          <div style={subheading}>Disabled</div>
          <Dropdown placeholder="Select" state="disabled" style={{ width: 200 }}>
            <DropdownItem label="Option" />
          </Dropdown>
        </div>

        <div style={col}>
          <div style={subheading}>Focus</div>
          <Dropdown placeholder="Select" focus style={{ width: 200 }}>
            <DropdownItem label="Option" />
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   10. Hook: Single Select (useDropdown)
   ================================================================ */

function HookSingleSelect() {
  const lbl = useLabel();
  const items: DropdownItemDef[] = [
    { value: 'denial', label: lbl('Denial Analysis') },
    { value: 'payment', label: lbl('Payment Trends') },
    { value: 'aging', label: lbl('Aging Report') },
    { value: 'compliance', label: lbl('Compliance Audit'), disabled: true },
  ];

  const { dropdownProps, getItemProps, filteredItems } = useDropdown({
    items,
    mode: 'single',
    defaultSelected: 'denial',
  });

  return (
    <div style={sectionStyle}>
      <div style={heading}>Hook: Single Select</div>
      <div style={subheading}>useDropdown — single-select with disabled item, ~15 lines vs ~35 manual</div>
      <div style={{ width: 240 }}>
        <Dropdown placeholder="Select report" {...dropdownProps} style={{ width: '100%' }}>
          {filteredItems.map((item) => (
            <DropdownItem key={item.value} {...getItemProps(item.value)} />
          ))}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   11. Hook: Multi Select (useDropdown)
   ================================================================ */

function HookMultiSelect() {
  const lbl = useLabel();
  const items: DropdownItemDef[] = [
    { value: 'cardiology', label: lbl('Cardiology') },
    { value: 'oncology', label: lbl('Oncology') },
    { value: 'neurology', label: lbl('Neurology') },
    { value: 'pediatrics', label: lbl('Pediatrics'), disabled: true },
    { value: 'radiology', label: lbl('Radiology') },
  ];

  const { dropdownProps, getItemProps, filteredItems, setOpen } = useDropdown({
    items,
    mode: 'multi',
    defaultSelected: ['cardiology', 'oncology'],
  });

  return (
    <div style={sectionStyle}>
      <div style={heading}>Hook: Multi Select</div>
      <div style={subheading}>useDropdown — multi-select with disabled item + auto "All selected" detection</div>
      <div style={{ width: 260 }}>
        <Dropdown
          placeholder="Select departments"
          {...dropdownProps}
          style={{ width: '100%' }}
          action={
            <DropdownAction
              text="Done"
              icon={<Icon size="mini">{TickBold16}</Icon>}
              onClick={() => setOpen(false)}
            />
          }
        >
          {filteredItems.map((item) => (
            <DropdownItem key={item.value} {...getItemProps(item.value)} />
          ))}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   12. Hook: Multi Select with Search (useDropdown)
   ================================================================ */

function HookMultiSelectWithSearch() {
  const lbl = useLabel();
  const items: DropdownItemDef[] = [
    { value: 'icd10', label: lbl('ICD-10') },
    { value: 'icd11', label: lbl('ICD-11') },
    { value: 'cpt', label: lbl('CPT') },
    { value: 'hcpcs', label: lbl('HCPCS') },
    { value: 'drg', label: lbl('DRG') },
    { value: 'ndc', label: lbl('NDC') },
    { value: 'snomed', label: lbl('SNOMED CT') },
  ];

  const { dropdownProps, getItemProps, filteredItems, filterProps, setOpen } =
    useDropdown({
      items,
      mode: 'multi',
      filterable: true,
      defaultSelected: ['icd10'],
    });

  return (
    <div style={sectionStyle}>
      <div style={heading}>Hook: Multi Select + Search</div>
      <div style={subheading}>useDropdown — filterable multi-select, auto-reset on close</div>
      <div style={{ width: 280 }}>
        <Dropdown
          placeholder="Select code systems"
          {...dropdownProps}
          style={{ width: '100%' }}
          filter={
            <DropdownFilter placeholder="Search codes..." {...filterProps} />
          }
          action={
            <DropdownAction
              text="Done"
              icon={<Icon size="mini">{TickBold16}</Icon>}
              onClick={() => setOpen(false)}
            />
          }
        >
          {filteredItems.map((item) => (
            <DropdownItem key={item.value} {...getItemProps(item.value)} />
          ))}
          {filteredItems.length === 0 && (
            <DropdownItem label="No results" mode="single" state="disabled" />
          )}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   13. Hook: Multi Select with Sections (useDropdown)
   ================================================================ */

function HookMultiSelectSections() {
  const lbl = useLabel();
  const items: DropdownItemDef[] = [
    { value: 'claim', label: lbl('Claim Submission'), section: 'primary' },
    { value: 'eligibility', label: lbl('Eligibility Check'), section: 'primary' },
    { value: 'prior-auth', label: lbl('Prior Authorization'), section: 'primary' },
    { value: 'payment', label: lbl('Payment Posting'), section: 'primary' },
    { value: 'denial', label: lbl('Denial Management'), section: 'secondary' },
    { value: 'appeal', label: lbl('Appeal Filing'), section: 'secondary' },
    { value: 'billing', label: lbl('Patient Billing'), section: 'secondary' },
  ];

  const sectionDefs = [
    { title: 'Primary', key: 'primary' },
    { title: 'Secondary', key: 'secondary', separatorBefore: true },
  ];

  const { dropdownProps, getItemProps, groupedItems, filterProps, setOpen } =
    useDropdown({
      items,
      mode: 'multi',
      filterable: true,
      sections: sectionDefs,
      defaultSelected: ['claim', 'eligibility'],
    });

  return (
    <div style={sectionStyle}>
      <div style={heading}>Hook: Multi Select + Sections</div>
      <div style={subheading}>useDropdown — sections + filter + "All selected" — full-featured, minimal code</div>
      <div style={{ width: 300 }}>
        <Dropdown
          placeholder="Select workflows"
          {...dropdownProps}
          style={{ width: '100%' }}
          filter={
            <DropdownFilter placeholder="Search workflows..." {...filterProps} />
          }
          action={
            <DropdownAction
              text="Done"
              icon={<Icon size="mini">{TickBold16}</Icon>}
              onClick={() => setOpen(false)}
            />
          }
        >
          {groupedItems.map((group, gi) => (
            <span key={group.section?.key ?? `ungrouped-${gi}`}>
              {group.section?.separatorBefore && (
                <DropdownSeparator mode="multi" orientation="left" />
              )}
              {group.section && (
                <DropdownSection
                  text={group.section.title}
                  mode="multi"
                  orientation="left"
                />
              )}
              {group.items.map((item) => (
                <DropdownItem key={item.value} {...getItemProps(item.value)} />
              ))}
            </span>
          ))}
          {groupedItems.every((g) => g.items.length === 0) && (
            <DropdownItem label="No results" mode="single" state="disabled" />
          )}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   14. Hook: Controlled Selection (useDropdown)
   ================================================================ */

function HookControlledSelection() {
  const lbl = useLabel();
  const items: DropdownItemDef[] = [
    { value: 'inpatient', label: lbl('Inpatient') },
    { value: 'outpatient', label: lbl('Outpatient') },
    { value: 'emergency', label: lbl('Emergency') },
    { value: 'surgical', label: lbl('Surgical') },
    { value: 'diagnostic', label: lbl('Diagnostic') },
  ];

  const [externalSelected, setExternalSelected] = useState<string[]>([
    'inpatient',
    'emergency',
  ]);

  const { dropdownProps, getItemProps, filteredItems, setOpen, isAllSelected, selectAll, clearAll } =
    useDropdown({
      items,
      mode: 'multi',
      selected: externalSelected,
      onSelectedChange: (sel) => setExternalSelected(sel as string[]),
    });

  return (
    <div style={sectionStyle}>
      <div style={heading}>Hook: Controlled Selection</div>
      <div style={subheading}>
        External state controls selection — buttons below sync with dropdown
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <button
          type="button"
          onClick={selectAll}
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--colour-stroke-divider-primary-light)', cursor: 'pointer' }}
        >
          Select All
        </button>
        <button
          type="button"
          onClick={clearAll}
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--colour-stroke-divider-primary-light)', cursor: 'pointer' }}
        >
          Clear All
        </button>
        <span style={{ padding: '6px 0', fontSize: 13, color: 'var(--colour-text-default-low-emphasis)' }}>
          {isAllSelected ? 'All selected' : `${externalSelected.length} of ${items.length}`}
        </span>
      </div>
      <div style={{ width: 260 }}>
        <Dropdown
          placeholder="Select services"
          {...dropdownProps}
          style={{ width: '100%' }}
          action={
            <DropdownAction
              text="Done"
              icon={<Icon size="mini">{TickBold16}</Icon>}
              onClick={() => setOpen(false)}
            />
          }
        >
          {filteredItems.map((item) => (
            <DropdownItem key={item.value} {...getItemProps(item.value)} />
          ))}
        </Dropdown>
      </div>
    </div>
  );
}

/* ================================================================
   Scenario → Component Map
   ================================================================ */

const SCENARIO_MAP: Record<string, () => React.JSX.Element> = {
  'single-basic': SingleSelectBasic,
  'single-sections': SingleSelectSections,
  'single-filter': SingleSelectRightWithFilter,
  'single-search-filter': SingleSelectWithSearchFilter,
  'multi-basic': MultiSelectBasic,
  'multi-all': MultiSelectAllSelectable,
  'multi-search': MultiSelectWithSearch,
  'multi-sections': MultiSelectFull,
  'right-single-search': SingleSelectRightSearch,
  'right-multi-search': MultiSelectRightSearch,
  'right-single-search-cat': SingleSelectRightSearchCategorised,
  'right-multi-search-cat': MultiSelectRightSearchCategorised,
  'right-single-search-filter': SingleSelectRightSearchAndFilter,
  'right-multi-search-filter': MultiSelectRightSearchAndFilter,
  'right-single-cat-search-filter': SingleSelectRightCatSearchFilter,
  'right-multi-cat-search-filter': MultiSelectRightCatSearchFilter,
  'group-variants': DropdownGroupVariants,
  'sub-components': SubComponentsShowcase,
  'trigger-states': TriggerStates,
  'hook-single': HookSingleSelect,
  'hook-multi': HookMultiSelect,
  'hook-multi-search': HookMultiSelectWithSearch,
  'hook-multi-sections': HookMultiSelectSections,
  'hook-controlled': HookControlledSelection,
};

/* ================================================================
   Main Demo Export — Scenario Picker
   ================================================================ */

const TEXT_LENGTH_OPTIONS: DropdownItemDef[] = [
  { value: 'short', label: 'Short Text' },
  { value: 'long', label: 'Long Text' },
];

export function DropdownDemo() {
  const scenarioPicker = useDropdown({
    items: SCENARIOS,
    mode: 'single',
    defaultSelected: 'all',
    filterable: true,
  });

  const [textLength, setTextLength] = useState<TextLength>('short');

  const activeScenario = scenarioPicker.selectedValues[0] ?? 'all';
  const showAll = activeScenario === 'all';

  return (
    <div style={{ padding: 40, maxWidth: 1200 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, color: 'var(--colour-text-default-base)' }}>
        Dropdown Component System
      </h1>
      <p style={{ fontSize: 14, color: 'var(--colour-text-default-low-emphasis)', marginBottom: 32 }}>
        Select a scenario to preview, or choose "All" to display every variant at once.
      </p>

      {/* ---- Scenario Picker + Text Length Toggle ---- */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', marginBottom: 48 }}>
        <div style={{ width: 340 }}>
          <DropdownGroup label="Select scenario" layout="vertical">
            <Dropdown
              placeholder="Select scenario"
              {...scenarioPicker.dropdownProps}
              style={{ width: '100%' }}
              filter={
                <DropdownFilter placeholder="Search scenarios..." {...scenarioPicker.filterProps} />
              }
            >
              {scenarioPicker.filteredItems.map((item) => (
                <DropdownItem key={item.value} {...scenarioPicker.getItemProps(item.value)} />
              ))}
              {scenarioPicker.filteredItems.length === 0 && (
                <DropdownItem label="No matching scenarios" mode="single" state="disabled" />
              )}
            </Dropdown>
          </DropdownGroup>
        </div>

        <div style={{ width: 180 }}>
          <DropdownGroup label="Item text length" layout="vertical">
            <Dropdown
              placeholder="Text length"
              value={textLength === 'short' ? 'Short Text' : 'Long Text'}
              style={{ width: '100%' }}
            >
              {TEXT_LENGTH_OPTIONS.map((opt) => (
                <DropdownItem
                  key={opt.value}
                  label={opt.label}
                  mode="single"
                  checked={textLength === opt.value}
                  onSelect={() => setTextLength(opt.value as TextLength)}
                />
              ))}
            </Dropdown>
          </DropdownGroup>
        </div>
      </div>

      {/* ---- Scenario Content ---- */}
      <TextLengthContext.Provider value={textLength}>
        {showAll
          ? SCENARIOS.filter((s) => s.value !== 'all').map((scenario) => {
              const Component = SCENARIO_MAP[scenario.value];
              return Component ? <Component key={scenario.value} /> : null;
            })
          : (() => {
              const Component = SCENARIO_MAP[activeScenario];
              return Component ? <Component /> : null;
            })()
        }
      </TextLengthContext.Provider>
    </div>
  );
}
