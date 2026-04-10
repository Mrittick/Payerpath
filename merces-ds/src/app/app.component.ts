import { Component, ChangeDetectionStrategy, signal, computed, AfterViewInit } from '@angular/core';
import { IconComponent } from '../assets/icon/icon.component';
import { ICON_TYPE_MAP, IconName, IconType } from '../assets/icon/icon.types';
import { SearchComponent } from '../components/inputs-and-interactive/sub-controls/search/search.component';
import { ClearComponent } from '../components/inputs-and-interactive/sub-controls/clear/clear.component';
import { DoneComponent } from '../components/inputs-and-interactive/sub-controls/done/done.component';
import { ChevronBadgeComponent } from '../components/inputs-and-interactive/sub-controls/chevron-badge/chevron-badge.component';
import { ActiveIndicatorComponent } from '../components/inputs-and-interactive/sub-controls/active-indicator/active-indicator.component';
import { FilterComponent } from '../components/inputs-and-interactive/sub-controls/filter/filter.component';
import { MoreInfoComponent } from '../components/inputs-and-interactive/sub-controls/more-info/more-info.component';
import { CopierComponent } from '../components/inputs-and-interactive/sub-controls/copier/copier.component';
import { MaskToggleComponent } from '../components/inputs-and-interactive/sub-controls/mask-toggle/mask-toggle.component';
import { CtaButtonComponent } from '../components/inputs-and-interactive/cta-button/cta-button.component';
import { CtaButtonIntent } from '../components/inputs-and-interactive/cta-button/cta-button.types';
import { TabButtonComponent } from '../components/inputs-and-interactive/tab-button/tab-button.component';
import { SelectionChipComponent } from '../components/inputs-and-interactive/selection-chip/selection-chip.component';
import { DropdownItemComponent } from '../components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-item/dropdown-item.component';
import { DropdownSeparatorComponent } from '../components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-separator/dropdown-separator.component';
import { DropdownSectionComponent } from '../components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-section/dropdown-section.component';
import { DropdownActionComponent } from '../components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-action/dropdown-action.component';
import { DropdownMoreComponent } from '../components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-more/dropdown-more.component';
import { DropdownFilterComponent } from '../components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-filter/dropdown-filter.component';
import { DropdownNoResultsComponent } from '../components/inputs-and-interactive/dropdown/dropdown-dependencies/no-results/dropdown-no-results.component';
import { DropdownComponent } from '../components/inputs-and-interactive/dropdown/dropdown-standalone/dropdown.component';
import { DropdownGroupComponent } from '../components/inputs-and-interactive/dropdown/dropdown-group/dropdown-group.component';
import { ModalFieldComponent } from '../components/inputs-and-interactive/modal-field/modal-field/modal-field.component';
import { ModalFieldGroupComponent } from '../components/inputs-and-interactive/modal-field/modal-field-group/modal-field-group.component';
import { MinMaxModalGroupComponent } from '../components/inputs-and-interactive/modal-field/min-max-modal-group/min-max-modal-group.component';
import { CheckboxComponent } from '../components/inputs-and-interactive/checkboxes/checkbox/checkbox.component';
import { CheckboxTableComponent } from '../components/inputs-and-interactive/checkboxes/checkbox-table/checkbox-table.component';
import { CheckboxDatavizComponent } from '../components/inputs-and-interactive/checkboxes/checkbox-dataviz/checkbox-dataviz.component';
import type { CheckboxDatavizSeries } from '../components/inputs-and-interactive/checkboxes/checkbox-dataviz/checkbox-dataviz.types';
import { CheckboxCardComponent } from '../components/inputs-and-interactive/checkboxes/checkbox-card/checkbox-card.component';
import { RadioPickerComponent } from '../components/inputs-and-interactive/radio-picker/radio-picker.component';
import { SwitchComponent } from '../components/inputs-and-interactive/switch-toggle/switch/switch.component';
import { SwitchCardComponent } from '../components/inputs-and-interactive/switch-toggle/switch-card/switch-card.component';
import { StringfieldPlainComponent } from '../components/data-entry/stringfield-plain/stringfield-plain.component';
import { StringfieldSecureComponent } from '../components/data-entry/stringfield-secure/stringfield-secure.component';
import { StringfieldMessageComponent } from '../components/data-entry/stringfield-plain/stringfield-plain-message/stringfield-plain-message.component';
import { StringfieldClearAllComponent } from '../components/data-entry/stringfield-plain/stringfield-plain-clear-all/stringfield-plain-clear-all.component';
import { StringfieldPlainGroupComponent } from '../components/data-entry/stringfield-plain/stringfield-plain-group/stringfield-plain-group.component';
import { StringfieldPlainMinMaxGroupComponent } from '../components/data-entry/stringfield-plain/stringfield-plain-minmax-group/stringfield-plain-minmax-group.component';
import { TableHeaderComponent } from '../components/display/data-table/table-header/table-header.component';
import { TableEntryComponent } from '../components/display/data-table/table-entry/table-entry.component';
import { TableRowComponent } from '../components/display/data-table/table-row/table-row.component';
import { TableNoDataComponent } from '../components/display/data-table/table-no-data/table-no-data.component';
import { DataTableComponent } from '../components/display/data-table/data-table/data-table.component';
import { PEOPLE_COLUMNS, PEOPLE_100 } from '../mock-database/data-table.mock';
import { AR_COLUMNS, AR_ROWS, CLAIM_COLUMNS, CLAIM_ROWS } from '../mock-database/billing.mock';
import { BrandingComponent } from '../components/display/branding/branding.component';
import { LoaderComponent } from '../components/display/loader/loader.component';
import { UacComponent } from '../components/display/uac/uac.component';
import { GlobalHeaderComponent } from '../components/display/global-header/global-header.component';
import { GlobalNavbarComponent } from '../components/display/global-navbar/global-navbar.component';
import { AccordionComponent } from '../components/display/accordion/accordion.component';
import { AccordionGroupComponent } from '../components/display/accordion/accordion-group.component';
import type { NavbarPage as NavbarPageDef } from '../components/display/global-navbar/global-navbar.types';
import type { NavbarCategoryId as NavbarCatId } from '../components/display/global-navbar/global-navbar.types';
import type { UserRole } from '../components/display/uac/uac.types';
import { CalendarComponent } from '../components/data-entry/calendar/calendar.component';
import { CalendarUiComponent } from '../components/inputs-and-interactive/calendar/calendar-ui.component';
import { CalendarUiRangedComponent } from '../components/inputs-and-interactive/calendar/calendar-ui-ranged.component';
import { CalendarRangedComponent } from '../components/data-entry/calendar/calendar-ranged.component';
import { TimePickerComponent } from '../components/data-entry/time/time-picker.component';
import { TimePickerRangedComponent } from '../components/data-entry/time/time-picker-ranged.component';
import type { TimeFieldValidationState } from '../components/data-entry/time/time-field.types';

interface NavSubItem {
  id: string;
  label: string;
}

interface NavSidebarSection {
  label: string;
  items: NavSubItem[];
}

interface NavPage {
  id: string;
  label: string;
  sectionLabel?: string;  // overrides the sidebar section header when set
  subItems?: NavSubItem[];
  sidebarSections?: NavSidebarSection[];  // multi-section sidebar (replaces subItems + sectionLabel)
  keywords?: string[];   // additional search terms for buried sub-components
}

interface NavGroup {
  id: string;
  label: string;
  pages: NavPage[];
}

@Component({
  selector: 'merces-root',
  standalone: true,
  imports: [IconComponent, SearchComponent, ClearComponent, DoneComponent, ChevronBadgeComponent, ActiveIndicatorComponent, FilterComponent, MoreInfoComponent, CopierComponent, MaskToggleComponent, CtaButtonComponent, TabButtonComponent, SelectionChipComponent, DropdownItemComponent, DropdownSeparatorComponent, DropdownSectionComponent, DropdownActionComponent, DropdownMoreComponent, DropdownFilterComponent, DropdownNoResultsComponent, DropdownComponent, DropdownGroupComponent, ModalFieldComponent, ModalFieldGroupComponent, MinMaxModalGroupComponent, CheckboxComponent, CheckboxTableComponent, CheckboxDatavizComponent, CheckboxCardComponent, RadioPickerComponent, SwitchComponent, SwitchCardComponent, StringfieldPlainComponent, StringfieldMessageComponent, StringfieldClearAllComponent, StringfieldPlainGroupComponent, StringfieldPlainMinMaxGroupComponent, StringfieldSecureComponent, CalendarComponent, CalendarUiComponent, CalendarUiRangedComponent, CalendarRangedComponent, TimePickerComponent, TimePickerRangedComponent, BrandingComponent, LoaderComponent, UacComponent, GlobalHeaderComponent, GlobalNavbarComponent, AccordionComponent, AccordionGroupComponent, TableHeaderComponent, TableEntryComponent, TableRowComponent, TableNoDataComponent, DataTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {

  readonly firstLoad = signal(true);
  readonly navSearch = signal<string>('');

  readonly filteredGroups = computed(() => {
    const q = this.navSearch().toLowerCase().trim();
    if (!q) return this.groups;
    return this.groups
      .map(group => ({
        ...group,
        pages: group.pages.filter(page =>
          page.label.toLowerCase().includes(q) ||
          page.keywords?.some(k => k.toLowerCase().includes(q))
        ),
      }))
      .filter(group => group.pages.length > 0);
  });

  ngAfterViewInit(): void {
    setTimeout(() => this.firstLoad.set(false), 450);
  }

  // ── Active user (from database) ──
  readonly currentUser: { name: string; role: UserRole; avatarUrl?: string } = {
    name:    'Mrittick Choudhury',
    role:    'admin',
  };

  // ── Icon gallery (dynamic from ICON_TYPE_MAP) ──
  iconTypeMap = ICON_TYPE_MAP;
  iconNames = Object.keys(ICON_TYPE_MAP) as IconName[];
  totalSvgCount = this.iconNames.reduce((sum, name) => sum + ICON_TYPE_MAP[name].length, 0);
  iconSearch = signal('');
  filteredIconNames = computed(() => {
    const q = this.iconSearch().toLowerCase().trim();
    return q ? this.iconNames.filter(n => n.includes(q)) : this.iconNames;
  });

  // ── Navigation ──────────────────────────────
  groups: NavGroup[] = [
    {
      id: 'assets',
      label: 'Assets',
      pages: [
        { id: 'colours', label: 'Colours' },
        {
          id: 'typography',
          label: 'Typography',
          subItems: [
            { id: 'typography-headings', label: 'Headings' },
            { id: 'typography-paragraphs', label: 'Paragraphs' },
            { id: 'typography-ui', label: 'UI Text' },
          ],
        },
        { id: 'icons', label: 'Icons' },
      ],
    },
    {
      id: 'inputs-and-interactive',
      label: 'Inputs & Interactive',
      pages: [
        {
          id: 'sub-controls',
          label: 'Sub Controls',
          keywords: ['clear', 'search', 'done', 'chevron badge', 'active indicator', 'filter', 'more info', 'copier', 'mask toggle'],
          subItems: [
            { id: 'clear', label: 'Clear' },
            { id: 'search', label: 'Search' },
            { id: 'done', label: 'Done' },
            { id: 'chevron-badge', label: 'Chevron Badge' },
            { id: 'active-indicator', label: 'Active Indicator' },
            { id: 'filter', label: 'Filter' },
            { id: 'more-info', label: 'More Info' },
            { id: 'copier', label: 'Copier' },
            { id: 'mask-toggle', label: 'Mask Toggle' },
          ],
        },
        {
          id: 'cta-button',
          label: 'CTA Button',
          keywords: ['span', 'compound'],
          subItems: [
            { id: 'cta-button-cta', label: 'CTA' },
            { id: 'cta-button-span', label: 'Span' },
            { id: 'cta-button-compound', label: 'Compound' },
          ],
        },
        {
          id: 'tab-button',
          label: 'Tab Button',
          subItems: [
            { id: 'tab-button-use-case', label: 'Use Case' },
            { id: 'tab-button-level01',  label: 'Level 01 — Pill' },
            { id: 'tab-button-level02',  label: 'Level 02 — Underline' },
            { id: 'tab-button-focus',    label: 'Focus Ring' },
          ],
        },
        {
          id: 'selection-chip',
          label: 'Selection Chip',
        },
        {
          id: 'dropdown',
          label: 'Dropdown',
          keywords: ['item', 'separator', 'section', 'action', 'trigger', 'group'],
          subItems: [
            { id: 'dropdown-item', label: 'Dropdown Item' },
            { id: 'dropdown-separator', label: 'Separator' },
            { id: 'dropdown-section', label: 'Section' },
            { id: 'dropdown-action', label: 'Action' },
            { id: 'dropdown-more', label: 'More' },
            { id: 'dropdown-filter', label: 'Filter' },
            { id: 'dropdown-trigger', label: 'Trigger' },
            { id: 'dropdown-group', label: 'Group' },
          ],
        },
        {
          id: 'modal-field',
          label: 'Modal Field',
          keywords: ['group', 'min-max', 'minmax'],
          subItems: [
            { id: 'modal-field-core', label: 'Modal Field' },
            { id: 'modal-field-group', label: 'Group' },
            { id: 'modal-field-minmax', label: 'Min-Max' },
          ],
        },
        {
          id: 'checkbox',
          label: 'Checkboxes',
          sectionLabel: 'Components',
          keywords: ['table', 'dataviz', 'data visualization', 'card'],
          subItems: [
            { id: 'checkbox-brand',   label: 'Brand' },
            { id: 'checkbox-neutral', label: 'Neutral' },
            { id: 'checkbox-table',   label: 'Table' },
            { id: 'checkbox-dataviz', label: 'Dataviz' },
            { id: 'checkbox-card',    label: 'Card' },
          ],
        },
        {
          id: 'radio-picker',
          label: 'Radio Picker',
          sectionLabel: 'Flavours',
          subItems: [
            { id: 'radio-picker-brand', label: 'Brand' },
            { id: 'radio-picker-neutral', label: 'Neutral' },
          ],
        },
        {
          id: 'switch-toggle',
          label: 'Switch Toggle',
          keywords: ['switch', 'switch card', 'card'],
          sectionLabel: 'Components',
          subItems: [
            { id: 'switch-toggle-switch', label: 'Switch' },
            { id: 'switch-toggle-card', label: 'Switch Card' },
          ],
        },
      ],
    },
    {
      id: 'data-entry',
      label: 'Data Entry',
      pages: [
        {
          id: 'string-field',
          label: 'String Field',
          keywords: ['group', 'min-max', 'minmax', 'message', 'clear all', 'text field', 'input'],
          subItems: [
            { id: 'sf-core', label: 'Core Components' },
            { id: 'sf-sub', label: 'Sub Components' },
          ],
        },
        {
          id: 'secure-field',
          label: 'Secure Field',
          subItems: [
            { id: 'ssf-core', label: 'Core Components' },
          ],
        },
        {
          id: 'calendar',
          label: 'Calendar',
          keywords: ['date field', 'date picker', 'calendar ui'],
          subItems: [
            { id: 'calendar-field', label: 'Date Field' },
            { id: 'calendar-ui', label: 'Calendar UI' },
          ],
        },
        {
          id: 'time-picker',
          label: 'Time Picker',
          keywords: ['12hr', '24hr', '12 hour', '24 hour', 'time'],
          subItems: [
            { id: 'time-picker-12hr', label: '12hr' },
            { id: 'time-picker-24hr', label: '24hr' },
          ],
        },
      ],
    },
    {
      id: 'display',
      label: 'Display',
      pages: [
        { id: 'branding', label: 'Branding' },
        { id: 'loader', label: 'Loader' },
        { id: 'uac', label: 'UAC' },
        { id: 'global-header', label: 'Global Header' },
        { id: 'global-navbar', label: 'Global Navbar' },
        { id: 'accordion', label: 'Accordion' },
        {
          id: 'data-table',
          label: 'Data Table',
          keywords: ['simple', 'checkboxes', 'nested', 'selection', 'sort'],
          subItems: [
            { id: 'data-table-simple',     label: 'Simple Data'     },
            { id: 'data-table-checkboxes', label: 'With Checkboxes' },
            { id: 'data-table-nested',     label: 'Nested'          },
          ],
        },
      ],
    },
  ];

  activePage = signal('about');
  activeSubItem = signal<string | null>(null);
  private _expandedGroups = signal(new Set(['assets', 'inputs-and-interactive', 'data-entry', 'display']));

  // ── Global Navbar demo state ──
  navbarPayerpathCollapsed = signal(false);
  navbarEchartCollapsed = signal(false);

  /** Tracks which page is active in the demo — mirrors how ShellComponent uses the router URL. */
  readonly demoCurrentPageId = signal('claims/view-claims');

  private static readonly _DEMO_ALL_PAGES: Omit<NavbarPageDef, 'isCurrent'>[] = [
    // Claims
    { id: 'claim-attachments',      label: 'Claim Attachments',         categoryId: 'claims'      },
    { id: 'codecheck-defaults',     label: 'CodeCheck Defaults',        categoryId: 'claims'      },
    { id: 'reconcile-batch',        label: 'Reconcile by Batch',        categoryId: 'claims'      },
    { id: 'upload-claims',          label: 'Upload Claims',             categoryId: 'claims'      },
    { id: 'view-claims',            label: 'View Claims',               categoryId: 'claims'      },
    { id: 'workers-comp',           label: "Workers' Comp",             categoryId: 'claims'      },
    // Patients
    { id: 'patient-demographics',   label: 'Patient Demographics',      categoryId: 'patients'    },
    // Reports
    { id: 'audit-trail',            label: 'Audit Trail Report',        categoryId: 'reports'     },
    { id: 'billing-summary',        label: 'Billing Summary',           categoryId: 'reports'     },
    { id: 'claim-age',              label: 'Claim Age',                 categoryId: 'reports'     },
    { id: 'era-optimisation',       label: 'ERA Optimisation',          categoryId: 'reports'     },
    { id: 'error-trend',            label: 'Error Trend',               categoryId: 'reports'     },
    { id: 'offline-reports',        label: 'Offline Reports List',      categoryId: 'reports'     },
    { id: 'payer-rejects',          label: 'Payer Rejects',             categoryId: 'reports'     },
    { id: 'payer-rejects-workflow', label: 'Payer Rejects Workflow',    categoryId: 'reports'     },
    { id: 'payer-responses',        label: 'Payer Responses',           categoryId: 'reports'     },
    { id: 'remittances',            label: 'Remittances',               categoryId: 'reports'     },
    { id: 'transmitted-claim',      label: 'Transmitted Claim',         categoryId: 'reports'     },
    { id: 'upload-detail',          label: 'Upload Detail',             categoryId: 'reports'     },
    { id: 'upload-reconciliation',  label: 'Upload Reconciliation',     categoryId: 'reports'     },
    { id: 'upload-summary',         label: 'Upload Summary',            categoryId: 'reports'     },
    // Maintenance
    { id: 'edit-claim-defaults',    label: 'Edit Claim Defaults',       categoryId: 'maintenance' },
    { id: 'integrated-edits',       label: 'Integrated Edits Password', categoryId: 'maintenance' },
    { id: 'payer-table',            label: 'Payer Table',               categoryId: 'maintenance' },
    { id: 'profile-maintenance',    label: 'Profile Maintenance',       categoryId: 'maintenance' },
    { id: 'user-maintenance',       label: 'User Maintenance',          categoryId: 'maintenance' },
    { id: 'provider-maintenance',   label: 'Provider Maintenance',      categoryId: 'maintenance' },
    { id: 'master-payer-list',      label: 'View Master Payer List',    categoryId: 'maintenance' },
    { id: 'view-messages',          label: 'View Messages',             categoryId: 'maintenance' },
    // Resources
    { id: 'client-portal',          label: 'Client Portal',             categoryId: 'resources'   },
    { id: 'elearning',              label: 'eLearning',                 categoryId: 'resources'   },
    { id: 'knowledge-center',       label: 'Knowledge Center',          categoryId: 'resources'   },
    { id: 'user-guide',             label: 'User Guide — Professional', categoryId: 'resources'   },
    // Analytics
    { id: 'remittances',            label: 'Remittances',               categoryId: 'analytics'   },
    { id: 'account-receivables',    label: 'Account Receivables',       categoryId: 'analytics'   },
    { id: 'appt-productivity',      label: 'Appointment Productivity',  categoryId: 'analytics'   },
  ];

  readonly demoNavPages = computed<NavbarPageDef[]>(() =>
    AppComponent._DEMO_ALL_PAGES.map(p => ({
      ...p,
      isCurrent: `${p.categoryId}/${p.id}` === this.demoCurrentPageId(),
    }))
  );

  onDemoPageSelected(compound: string): void {
    this.demoCurrentPageId.set(compound);
  }

  // ── eChart Coder demo state (separate from Payerpath) ──
  readonly demoEchartCurrentPageId = signal('project-settings/quality-audit-settings');

  /** eChart Coder demo pages — 9 categories.
   *  Project Settings has one sub-item (Quality Audit Settings) for the demo.
   *  Other categories are standalone (no sub-items) so they show as direct nav entries. */
  private static readonly _ECHART_DEMO_PAGES: Omit<NavbarPageDef, 'isCurrent'>[] = [
    // Project Settings — the only category with a sub-item in this demo
    { id: 'quality-audit-settings', label: 'Quality Audit Settings', categoryId: 'project-settings' as NavbarCatId },
  ];

  readonly demoEchartNavPages = computed<NavbarPageDef[]>(() =>
    AppComponent._ECHART_DEMO_PAGES.map(p => ({
      ...p,
      isCurrent: `${p.categoryId}/${p.id}` === this.demoEchartCurrentPageId(),
    }))
  );

  onDemoEchartPageSelected(compound: string): void {
    this.demoEchartCurrentPageId.set(compound);
  }

  /** The currently active page object (looked up from groups). */
  private _activePage = computed(() => {
    const id = this.activePage();
    for (const group of this.groups) {
      const page = group.pages.find(p => p.id === id);
      if (page) return page;
    }
    return null;
  });

  /** The label of the current page (for sidebar header — uses sectionLabel when set). */
  readonly activePageLabel = computed(() => {
    const page = this._activePage();
    return page?.sectionLabel ?? page?.label ?? '';
  });

  /** Whether the sidebar should be visible. */
  readonly hasSidebar = computed(() => {
    const page = this._activePage();
    return (page?.subItems != null && page.subItems.length > 0) ||
           (page?.sidebarSections != null && page.sidebarSections.length > 0);
  });

  /** Sub-items for the current page (flat — for pages without sections). */
  readonly activePageSubItems = computed(() => this._activePage()?.subItems ?? []);

  /** Sidebar sections for the current page (for pages with named sections). */
  readonly activePageSidebarSections = computed(() => this._activePage()?.sidebarSections ?? []);

  /** The effective content key — either the sub-item ID or the page ID. */
  readonly contentKey = computed(() => this.activeSubItem() ?? this.activePage());

  isExpanded(groupId: string): boolean {
    return this._expandedGroups().has(groupId);
  }

  toggleGroup(groupId: string): void {
    const current = new Set(this._expandedGroups());
    if (current.has(groupId)) {
      current.delete(groupId);
    } else {
      current.add(groupId);
    }
    this._expandedGroups.set(current);
  }

  // ── CTA Button flavour tabs ─────────────────
  readonly flavours: CtaButtonIntent[] = ['brand', 'neutral', 'emphasis', 'danger', 'caution'];
  readonly activeFlavour = signal<CtaButtonIntent>('brand');
  readonly activeSize = signal<'base' | 'mini'>('base');

  // ── String Field tab selection ──────────
  readonly sfCoreTab = signal<string>('field');
  readonly sfSubTab = signal<string>('message');
  readonly ssfCoreTab = signal<string>('field');
  readonly ssfValue1 = signal<string>('');
  readonly ssfValue2 = signal<string>('');
  readonly ssfValue3 = signal<string>('');
  readonly ssfValue4 = signal<string>('');

  // ── String Field standalone demos ────────────────────────────────────────
  readonly maskDemoMasked = signal(true);

  readonly sfEmpty = signal('');
  readonly sfFilled = signal('Sample text');
  readonly sfWarning = signal('');
  readonly sfError = signal('');

  // ── String Field Group demos (one signal per field) ──────────────────────
  readonly sfGroup1 = signal('');
  readonly sfGroup2 = signal('');
  readonly sfGroup3 = signal('');

  // ── Min-Max Group demos (one pair per demo) ───────────────────────────────
  readonly sfMin1 = signal('');
  readonly sfMax1 = signal('');
  readonly sfMin2 = signal('');   // live-validated pair
  readonly sfMax2 = signal('');
  readonly sfMin3 = signal('');
  readonly sfMax3 = signal('');

  // Live min < max validation: fires when both fields are non-empty
  readonly sfMinMaxValidation = computed<'default' | 'warning' | 'error'>(() => {
    const minRaw = this.sfMin2();
    const maxRaw = this.sfMax2();
    if (minRaw.length === 0 || maxRaw.length === 0) return 'default';
    const min = parseFloat(minRaw);
    const max = parseFloat(maxRaw);
    if (isNaN(min) || isNaN(max)) return 'default';
    if (min === max) return 'warning';
    if (min > max) return 'error';
    return 'default';
  });

  readonly sfMinMaxMessage = computed(() => {
    const v = this.sfMinMaxValidation();
    if (v === 'warning') return 'Range values cannot be the same.';
    if (v === 'error') return 'Minimum value must be less than maximum.';
    return '';
  });

  // ── Calendar UI tab (Specific / Ranged) ───────────────────────────────────
  readonly calendarUiTab    = signal<'specific' | 'ranged'>('specific');
  readonly calendarFieldTab = signal<'specific' | 'ranged'>('specific');

  // ── Calendar demos ────────────────────────────────────────────────────────
  readonly calendarValue1 = signal<Date | null>(null);
  readonly calendarValue2 = signal<Date | null>(new Date());
  readonly calendarValue3 = signal<Date | null>(new Date(1955, 0, 1)); // DOB → age 71, triggers warning on load
  readonly calendarValue4 = signal<Date | null>(new Date(2013, 0, 1)); // DOB → age 13, triggers error on load

  /** Ranged calendar UI demo — pre-seeded to show a visible range on load. */
  readonly calendarRangeStart = signal<Date | null>(new Date(2026, 3, 10)); // Apr 10
  readonly calendarRangeEnd   = signal<Date | null>(new Date(2026, 4, 5));  // May 5

  /** Ranged calendar field demo — separate state for the Date Field page. */
  readonly calendarFieldRangeStart = signal<Date | null>(new Date(2026, 3, 10));
  readonly calendarFieldRangeEnd   = signal<Date | null>(new Date(2026, 4, 5));

  /** Returns the age in whole years for a given date of birth. */
  private _ageFrom(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }

  /**
   * Warning when the selected DOB implies an age above 60.
   * Above 60 is accepted but not recommended.
   */
  readonly calendarWarningState = computed<'default' | 'warning'>(() => {
    const d = this.calendarValue3();
    if (!d) return 'default';
    return this._ageFrom(d) > 60 ? 'warning' : 'default';
  });
  readonly calendarWarningMessage = computed(() =>
    this.calendarWarningState() === 'warning'
      ? 'Applicants above 60 are accepted but not recommended for this plan.'
      : '',
  );

  /**
   * Error when the selected DOB implies an age below 18.
   * Must be at least 18 years old.
   */
  readonly calendarErrorState = computed<'default' | 'error'>(() => {
    const d = this.calendarValue4();
    if (!d) return 'default';
    return this._ageFrom(d) < 18 ? 'error' : 'default';
  });
  readonly calendarErrorMessage = computed(() =>
    this.calendarErrorState() === 'error'
      ? 'You must be at least 18 years old to apply.'
      : '',
  );

  // ── Time Picker demos ─────────────────────────────────────────────────────
  readonly timePicker12hrTab = signal<'single' | 'ranged'>('single');
  readonly timePicker24hrTab = signal<'single' | 'ranged'>('single');

  // Validation rules used in the live demo
  // Working hours: 08:00–18:00 | Peak hours: 11:00–13:00
  private getTimeValidation(value: string | null): { state: TimeFieldValidationState; message: string } {
    if (!value) return { state: 'valid', message: '' };
    if (value < '08:00' || value >= '18:00') {
      return { state: 'error', message: 'Time selected is outside of working hours (8:00 am - 6:00 pm).' };
    }
    if (value >= '11:00' && value < '13:00') {
      return { state: 'warning', message: 'Time selected might be during peak hours (11:00 am - 1:00 pm), affecting coverage.' };
    }
    return { state: 'valid', message: '' };
  }

  // 12hr single
  readonly tp12Empty   = signal<string | null>(null);
  readonly tp12Filled  = signal<string | null>('09:30');
  readonly tp12Warning = signal<string | null>('11:30'); // inside peak hours (11–13)
  readonly tp12Error   = signal<string | null>('22:00'); // outside working hours (08–18)
  readonly tp12WarnValidation  = computed(() => this.getTimeValidation(this.tp12Warning()));
  readonly tp12ErrorValidation = computed(() => this.getTimeValidation(this.tp12Error()));
  // 12hr ranged
  readonly tp12RangeStart = signal<string | null>('09:00');
  readonly tp12RangeEnd   = signal<string | null>('17:00');

  // 24hr single
  readonly tp24Empty   = signal<string | null>(null);
  readonly tp24Filled  = signal<string | null>('14:00');
  readonly tp24Warning = signal<string | null>('11:30'); // inside peak hours (11–13)
  readonly tp24Error   = signal<string | null>('22:00'); // outside working hours (08–18)
  readonly tp24WarnValidation  = computed(() => this.getTimeValidation(this.tp24Warning()));
  readonly tp24ErrorValidation = computed(() => this.getTimeValidation(this.tp24Error()));
  // 24hr ranged
  readonly tp24RangeStart = signal<string | null>('09:00');
  readonly tp24RangeEnd   = signal<string | null>('17:00');

  resetTimePicker12hr(): void {
    this.tp12Empty.set(null);
    this.tp12Filled.set('09:30');
    this.tp12Warning.set('11:30');
    this.tp12Error.set('22:00');
    this.tp12RangeStart.set('09:00');
    this.tp12RangeEnd.set('17:00');
  }

  resetTimePicker24hr(): void {
    this.tp24Empty.set(null);
    this.tp24Filled.set('14:00');
    this.tp24Warning.set('11:30');
    this.tp24Error.set('22:00');
    this.tp24RangeStart.set('09:00');
    this.tp24RangeEnd.set('17:00');
  }

  // ── Accordion demo ───────────────────────────────────────────────────────
  /** Raw value from the number input — string so the input binding is direct. */
  accordionEntryInput = signal<string>('4');
  /** Applied entry count — only updates when the user clicks Apply. */
  accordionAppliedCount = signal<number>(4);
  /** Open/closed state for each demo accordion (brand, emphasis, danger, read-write). */
  accordionBrandOpen    = signal<boolean>(false);
  accordionEmphasisOpen = signal<boolean>(false);
  accordionDangerOpen   = signal<boolean>(false);
  accordionRwOpen       = signal<boolean>(false);

  /** Generates the entry labels array from the current applied count. */
  readonly accordionEntries = computed<string[]>(() =>
    Array.from({ length: this.accordionAppliedCount() }, (_, i) => `Accordion Entry ${i + 1}`)
  );

  applyAccordionEntryCount(): void {
    const n = parseInt(this.accordionEntryInput(), 10);
    if (!isNaN(n) && n >= 0) this.accordionAppliedCount.set(n);
  }

  /** Active mode tab for the accordion demo. */
  accordionMode    = signal<'multi' | 'exclusive'>('multi');
  /** Active flavour tab for the accordion demo. */
  accordionFlavour = signal<'brand' | 'emphasis' | 'danger'>('brand');
  /** Selected entry count for the batch-edit demo card. */
  accordionBatchSelected = signal<number>(0);

  // ── Data Table — Shared ──
  readonly TABLE_ROW_HEIGHTS = [44, 48, 52, 56];

  // ── Data Table — Mock data (from mock-database) ──
  readonly peopleColumns  = PEOPLE_COLUMNS;
  readonly simpleRows     = PEOPLE_100;
  readonly arColumns      = AR_COLUMNS;
  readonly arRows         = AR_ROWS;
  readonly claimColumns   = CLAIM_COLUMNS;
  readonly claimRows      = CLAIM_ROWS;

  // ── Data Table — Per-tab row height signals ──
  simpleRowHeight      = signal<number | undefined>(undefined);
  checkboxes1RowHeight = signal<number | undefined>(undefined);
  checkboxes2RowHeight = signal<number | undefined>(undefined);

  /** Entry labels for the group demos (fixed 3-item set for clarity). */
  readonly accordionGroupEntries: string[][] = [
    ['Payerpath Reports', 'eChart Coder Reports', 'Shared Reports'],
    ['Q1 Analytics', 'Q2 Analytics', 'Q3 Analytics'],
    ['Active Alerts', 'Dismissed Alerts', 'Alert History'],
  ];

  resetCalendar(): void {
    this.calendarValue1.set(null);
    this.calendarValue2.set(new Date());
    this.calendarValue3.set(new Date(1955, 0, 1));
    this.calendarValue4.set(new Date(2013, 0, 1));
    this.calendarRangeStart.set(new Date(2026, 3, 10));
    this.calendarRangeEnd.set(new Date(2026, 4, 5));
    this.calendarFieldRangeStart.set(new Date(2026, 3, 10));
    this.calendarFieldRangeEnd.set(new Date(2026, 4, 5));
  }

  selectPage(pageId: string): void {
    this.activePage.set(pageId);
    // Find the page to check for sub-items
    for (const group of this.groups) {
      const page = group.pages.find(p => p.id === pageId);
      if (page) {
        if (pageId === 'dropdown') {
          this.activeSubItem.set('dropdown-trigger');
        } else if (page.sidebarSections?.length) {
          this.activeSubItem.set(page.sidebarSections[0].items[0]?.id ?? null);
        } else {
          this.activeSubItem.set(page.subItems?.[0]?.id ?? null);
        }
        return;
      }
    }
    this.activeSubItem.set(null);
  }

  // ── Colour palette (from primitives.css) ────
  colourGroups: { label: string; swatches: { token: string; name: string }[] }[] = [
    {
      label: 'Neutral',
      swatches: [
        { token: '--colour-neutral-black', name: 'black' },
        { token: '--colour-neutral-grey-100', name: 'grey-100' },
        { token: '--colour-neutral-grey-200', name: 'grey-200' },
        { token: '--colour-neutral-grey-300', name: 'grey-300' },
        { token: '--colour-neutral-grey-400', name: 'grey-400' },
        { token: '--colour-neutral-grey-500', name: 'grey-500' },
        { token: '--colour-neutral-grey-600', name: 'grey-600' },
        { token: '--colour-neutral-grey-700', name: 'grey-700' },
        { token: '--colour-neutral-grey-800', name: 'grey-800' },
        { token: '--colour-neutral-grey-900', name: 'grey-900' },
        { token: '--colour-neutral-grey-1000', name: 'grey-1000' },
        { token: '--colour-neutral-white', name: 'white' },
      ],
    },
    {
      label: 'Brand — Purple',
      swatches: [
        { token: '--colour-brand-purple-50', name: '50' },
        { token: '--colour-brand-purple-100', name: '100' },
        { token: '--colour-brand-purple-200', name: '200' },
        { token: '--colour-brand-purple-300', name: '300' },
        { token: '--colour-brand-purple-400', name: '400' },
        { token: '--colour-brand-purple-500', name: '500' },
        { token: '--colour-brand-purple-600', name: '600' },
        { token: '--colour-brand-purple-700', name: '700' },
        { token: '--colour-brand-purple-800', name: '800' },
        { token: '--colour-brand-purple-900', name: '900' },
        { token: '--colour-brand-purple-1000', name: '1000' },
        { token: '--colour-brand-purple-1100', name: '1100' },
      ],
    },
    {
      label: 'Brand — Red',
      swatches: [
        { token: '--colour-brand-red-100', name: '100' },
        { token: '--colour-brand-red-200', name: '200' },
        { token: '--colour-brand-red-300', name: '300' },
        { token: '--colour-brand-red-400', name: '400' },
        { token: '--colour-brand-red-500', name: '500' },
        { token: '--colour-brand-red-600', name: '600' },
        { token: '--colour-brand-red-700', name: '700' },
        { token: '--colour-brand-red-800', name: '800' },
        { token: '--colour-brand-red-900', name: '900' },
        { token: '--colour-brand-red-1000', name: '1000' },
        { token: '--colour-brand-red-1100', name: '1100' },
      ],
    },
    {
      label: 'Brand — Yellow',
      swatches: [
        { token: '--colour-brand-yellow-100', name: '100' },
        { token: '--colour-brand-yellow-200', name: '200' },
        { token: '--colour-brand-yellow-300', name: '300' },
        { token: '--colour-brand-yellow-400', name: '400' },
        { token: '--colour-brand-yellow-500', name: '500' },
        { token: '--colour-brand-yellow-600', name: '600' },
        { token: '--colour-brand-yellow-700', name: '700' },
        { token: '--colour-brand-yellow-800', name: '800' },
        { token: '--colour-brand-yellow-900', name: '900' },
        { token: '--colour-brand-yellow-1000', name: '1000' },
        { token: '--colour-brand-yellow-1100', name: '1100' },
      ],
    },
    {
      label: 'Brand — Green',
      swatches: [
        { token: '--colour-brand-green-100', name: '100' },
        { token: '--colour-brand-green-200', name: '200' },
        { token: '--colour-brand-green-300', name: '300' },
        { token: '--colour-brand-green-400', name: '400' },
        { token: '--colour-brand-green-500', name: '500' },
        { token: '--colour-brand-green-600', name: '600' },
        { token: '--colour-brand-green-700', name: '700' },
        { token: '--colour-brand-green-800', name: '800' },
        { token: '--colour-brand-green-900', name: '900' },
        { token: '--colour-brand-green-1000', name: '1000' },
        { token: '--colour-brand-green-1100', name: '1100' },
      ],
    },
    {
      label: 'Dataviz',
      swatches: [
        { token: '--colour-dataviz-coral-default', name: 'coral' },
        { token: '--colour-dataviz-lime-default', name: 'lime' },
        { token: '--colour-dataviz-parrot-default', name: 'parrot' },
        { token: '--colour-dataviz-turquoise-default', name: 'turquoise' },
        { token: '--colour-dataviz-sky-default', name: 'sky' },
        { token: '--colour-dataviz-ocean-default', name: 'ocean' },
        { token: '--colour-dataviz-lavender-default', name: 'lavender' },
        { token: '--colour-dataviz-rose-default', name: 'rose' },
      ],
    },
  ];

  // ── Typography styles ──────────────────────
  typeGroups: { label: string; styles: { className: string; label: string; sample: string }[] }[] = [
    {
      label: 'Headings',
      styles: [
        { className: 'heading-h1', label: 'H1 — 32px / 500', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'heading-h1-bold', label: 'H1 Bold — 32px / 700', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'heading-h2', label: 'H2 — 24px / 500', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'heading-h2-bold', label: 'H2 Bold — 24px / 700', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'heading-h3', label: 'H3 — 20px / 500', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'heading-h3-thin', label: 'H3 Thin — 20px / 400', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'heading-h3-bold', label: 'H3 Bold — 20px / 700', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'heading-h4', label: 'H4 — 16px / 500', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'heading-h4-bold', label: 'H4 Bold — 16px / 700', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'heading-h4-strong', label: 'H4 Strong — 16px / 900', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'heading-h5', label: 'H5 — 12px / 900 / UPPERCASE', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'heading-h6', label: 'H6 — 10px / 900 / UPPERCASE', sample: 'This is Merces - the Design System for Payerpath™' },
      ],
    },
    {
      label: 'Paragraphs',
      styles: [
        { className: 'paragraph-p1', label: 'P1 — 20px / 500', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-p2', label: 'P2 — 16px / 500', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-p2-thin', label: 'P2 Thin — 16px / 400', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-p2-bold', label: 'P2 Bold — 16px / 900', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-p3', label: 'P3 — 14px / 500', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-p3-thin', label: 'P3 Thin — 14px / 400', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-p3-bold', label: 'P3 Bold — 14px / 900', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-p4', label: 'P4 — 12px / 500', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-p4-bold', label: 'P4 Bold — 12px / 700', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-p4-strong', label: 'P4 Strong — 12px / 900', sample: 'This is Merces - the Design System for Payerpath™' },
      ],
    },
    {
      label: 'UI Text',
      styles: [
        { className: 'paragraph-ui', label: 'UI — 14px / 700', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-ui-underlined', label: 'UI Underlined', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-ui-stylised', label: 'UI Stylised (italic)', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-ui-thin', label: 'UI Thin — 14px / 500', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-ui-thin-underlined', label: 'UI Thin Underlined', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-ui-thin-stylised', label: 'UI Thin Stylised (italic)', sample: 'This is Merces - the Design System for Payerpath™' },
        { className: 'paragraph-ui-thin-strikethrough', label: 'UI Thin Strikethrough', sample: 'This is Merces - the Design System for Payerpath™' },
      ],
    },
  ];

  // ── Demo data (Tab Button page) ────────────
  readonly demoTab = signal<'analytics' | 'claims' | 'service'>('analytics');

  // ── Demo data (Selection Chip page) ────────
  private static readonly CHIP_WRAP_DEFAULT = ['Deductible Amount', 'Co-payment Amount', 'Procedure Code'];
  private static readonly CHIP_NOWRAP_DEFAULT = ['The procedure code is inconsistent with the modifier', 'Short'];
  private static readonly CHIP_SCROLL_DEFAULT = [
    '1 - Deductible Amount',
    '3 - Co-payment Amount',
    '4 - The procedure code is inconsistent with the modifier used. Usage: Refer to the 835 Healthcare Policy Identification Segment (loop 2110 Service Payment Information REF), if present.',
    '7 - The procedure/revenue code is inconsistent with the patient\'s gender. Usage: Refer to the 835 Healthcare Policy Identification Segment (loop 2110 Service Payment Information REF), if present.',
    '8 - The procedure code is inconsistent with the provider type/specialty (taxonomy). Usage: Refer to the 835 Healthcare Policy Identification Segment (loop 2110 Service Payment Information REF), if present.',
  ];

  readonly chipWrapItems = signal([...AppComponent.CHIP_WRAP_DEFAULT]);
  readonly chipNowrapItems = signal([...AppComponent.CHIP_NOWRAP_DEFAULT]);
  readonly chipScrollItems = signal([...AppComponent.CHIP_SCROLL_DEFAULT]);
  readonly exitingChips = signal(new Set<string>());

  private static readonly CHIP_EXIT_MS = 300;

  readonly chipAnyRemoved = () =>
    this.chipWrapItems().length < AppComponent.CHIP_WRAP_DEFAULT.length ||
    this.chipNowrapItems().length < AppComponent.CHIP_NOWRAP_DEFAULT.length ||
    this.chipScrollItems().length < AppComponent.CHIP_SCROLL_DEFAULT.length;

  private _animateOut(label: string, removeFn: (label: string) => void): void {
    this.exitingChips.update(set => { const next = new Set(set); next.add(label); return next; });
    setTimeout(() => {
      this.exitingChips.update(set => { const next = new Set(set); next.delete(label); return next; });
      removeFn(label);
    }, AppComponent.CHIP_EXIT_MS);
  }

  removeChipWrap(label: string): void {
    this._animateOut(label, l => this.chipWrapItems.update(items => items.filter(i => i !== l)));
  }

  removeChipNowrap(label: string): void {
    this._animateOut(label, l => this.chipNowrapItems.update(items => items.filter(i => i !== l)));
  }

  removeChipScroll(label: string): void {
    this._animateOut(label, l => {
      this.chipScrollItems.update(items => items.filter(i => i !== l));
    });
  }

  resetChips(): void {
    const allItems = [...this.chipWrapItems(), ...this.chipNowrapItems(), ...this.chipScrollItems()];
    this.exitingChips.set(new Set(allItems));
    setTimeout(() => {
      this.exitingChips.set(new Set());
      this.chipWrapItems.set([...AppComponent.CHIP_WRAP_DEFAULT]);
      this.chipNowrapItems.set([...AppComponent.CHIP_NOWRAP_DEFAULT]);
      this.chipScrollItems.set([...AppComponent.CHIP_SCROLL_DEFAULT]);
    }, AppComponent.CHIP_EXIT_MS);
  }

  isExiting(label: string): boolean {
    return this.exitingChips().has(label);
  }

  // ── Scroll tooltip (position:fixed, escapes overflow) ──
  readonly scrollTooltip = signal({ visible: false, text: '', top: '0px', left: '0px', pressed: false });
  private _hoveredScrollChip: HTMLElement | null = null;

  onScrollChipHover(event: MouseEvent): void {
    const chip = (event.target as HTMLElement).closest('merces-selection-chip') as HTMLElement | null;
    if (!chip) return;
    this._hoveredScrollChip = chip;
    this._positionScrollTooltip(chip);
  }

  onScrollChipLeave(): void {
    this._hoveredScrollChip = null;
    this.scrollTooltip.set({ visible: false, text: '', top: '0px', left: '0px', pressed: false });
  }

  onScrollChipMousedown(): void {
    this.scrollTooltip.update(t => ({ ...t, pressed: true }));
  }

  onScrollChipMouseup(): void {
    this.scrollTooltip.update(t => ({ ...t, pressed: false }));
  }

  onScrollChipWheel(event: WheelEvent): void {
    const el = event.currentTarget as HTMLElement;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (delta !== 0) {
      event.preventDefault();
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      el.scrollLeft = Math.min(maxScroll, Math.max(0, el.scrollLeft + delta));
    }
  }

  onScrollChipMove(): void {
    if (this._hoveredScrollChip) {
      this._positionScrollTooltip(this._hoveredScrollChip);
    }
  }

  private _positionScrollTooltip(chip: HTMLElement): void {
    const label = chip.querySelector('.selection-chip__label')?.textContent?.trim() || chip.getAttribute('label') || '';
    if (!label) return;

    const rect = chip.getBoundingClientRect();
    const container = chip.closest('.chip-scroll') as HTMLElement | null;
    const containerRect = container?.getBoundingClientRect();

    // Clamp chip bounds to the visible portion within the scroll container.
    // When a chip is partially off-screen, rect includes the hidden area —
    // centering on the full rect puts the tooltip outside the viewport.
    const visibleLeft = containerRect ? Math.max(rect.left, containerRect.left) : rect.left;
    const visibleRight = containerRect ? Math.min(rect.right, containerRect.right) : rect.right;
    const chipCenterX = (visibleLeft + visibleRight) / 2;

    const pressed = this.scrollTooltip().pressed;

    this.scrollTooltip.set({
      visible: true,
      text: label,
      top: `${rect.top - 4}px`,
      left: `${chipCenterX}px`,
      pressed,
    });

    // Second pass: once rendered, clamp tooltip itself to viewport edges
    requestAnimationFrame(() => {
      const tooltipEl = document.querySelector('.chip-scroll-tooltip') as HTMLElement;
      if (!tooltipEl) return;
      const tooltipRect = tooltipEl.getBoundingClientRect();
      const viewportPad = 8;

      let leftPx = chipCenterX;
      if (tooltipRect.right > window.innerWidth - viewportPad) {
        leftPx -= tooltipRect.right - (window.innerWidth - viewportPad);
      }
      if (tooltipRect.left < viewportPad) {
        leftPx += viewportPad - tooltipRect.left;
      }

      if (leftPx !== chipCenterX) {
        this.scrollTooltip.set({ visible: true, text: label, top: `${rect.top - 4}px`, left: `${leftPx}px`, pressed });
      }
    });
  }

  // ── Demo data (Search page) ─────────────────
  demoQuery = '';
  demoQueryPrefilled = 'Invoices 2024';
  demoQueryCompact = '';
  demoQueryCompactPrefilled = 'Q3 Report';

  // ── Demo data (Dropdown page) ─────────────────

  // Generic single-select state keyed by demo ID
  private _singleSelections = new Map<string, ReturnType<typeof signal<string>>>();
  ss(id: string): ReturnType<typeof signal<string>> {
    if (!this._singleSelections.has(id)) this._singleSelections.set(id, signal(''));
    return this._singleSelections.get(id)!;
  }
  selectSingle(id: string, value: string): void { this.ss(id).set(value); }

  // Generic multi-select state keyed by demo ID
  private _multiSelections = new Map<string, ReturnType<typeof signal<Set<string>>>>([
    ['mf-selected', signal(new Set(['Denial Analysis']))],
  ]);
  ms(id: string): ReturnType<typeof signal<Set<string>>> {
    if (!this._multiSelections.has(id)) this._multiSelections.set(id, signal(new Set<string>()));
    return this._multiSelections.get(id)!;
  }
  toggleMulti(id: string, value: string): void {
    this.ms(id).update(prev => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value); else next.add(value);
      return next;
    });
  }
  msText(id: string): string {
    const s = this.ms(id)();
    return s.size === 0 ? '' : Array.from(s).join(', ');
  }

  // Search filter state keyed by demo ID
  private _filters = new Map<string, ReturnType<typeof signal<string>>>();
  filterVal(id: string): ReturnType<typeof signal<string>> {
    if (!this._filters.has(id)) this._filters.set(id, signal(''));
    return this._filters.get(id)!;
  }

  /** Returns true if item label matches the current filter for a given demo ID. */
  matchesFilter(id: string, label: string): boolean {
    const q = this.filterVal(id)().toLowerCase();
    return q === '' || label.toLowerCase().includes(q);
  }

  /** Returns true if at least one label in a section matches the current filter. */
  sectionHasMatches(id: string, labels: string[]): boolean {
    return labels.some(label => this.matchesFilter(id, label));
  }

  /** Returns true when a query is active but no label in the full list matches. */
  hasNoMatches(id: string, allLabels: string[]): boolean {
    const q = this.filterVal(id)().toLowerCase();
    if (q === '') return false;
    return allLabels.every(label => !label.toLowerCase().includes(q));
  }

  // ── Modal Field overlay demo state ─────────────────

  // ── Modal Field overlay — generic, works for any field ─────────────────

  // Option sets keyed by field ID
  private static readonly MODAL_OPTIONS: Record<string, string[]> = {
    'mf-default': [
      'Denial Analysis', 'Payment Trends', 'Aging Report', 'Compliance Audit',
      'Claim Status Summary', 'Revenue Cycle',
    ],
    'mf-selected': [
      'Denial Analysis', 'Payment Trends', 'Aging Report', 'Compliance Audit',
      'Claim Status Summary', 'Revenue Cycle',
    ],
    'mf-overlay': [
      'Denial Analysis', 'Payment Trends', 'Aging Report', 'Compliance Audit',
      'Claim Status Summary', 'Revenue Cycle', 'Patient Responsibility',
      'Payer Mix Analysis', 'Write-Off Report', 'Collections Dashboard',
      'AR Snapshot', 'Underpayment Tracker',
    ],
    'mfg-vert': ['Aging Report', 'Denial Analysis', 'Payment Trends', 'Revenue Cycle', 'Compliance Audit'],
    'mfg-span': ['BlueCross BlueShield', 'Aetna HMO', 'United PPO', 'Cigna EPO', 'Humana Gold'],
    'mfg-horiz': ['Dr. Smith', 'Dr. Jones', 'Dr. Patel', 'Dr. Chen', 'Dr. Williams'],
    'mfg-hspan': ['BlueCross PPO', 'Aetna HMO', 'United PPO', 'Cigna EPO'],
    'mm-min': ['$0', '$50', '$100', '$250', '$500', '$1,000'],
    'mm-max': ['$1,000', '$2,500', '$5,000', '$10,000', '$25,000', '$50,000'],
    'mm-hmin': ['01/01/2023', '04/01/2023', '07/01/2023', '10/01/2023', '01/01/2024'],
    'mm-hmax': ['03/31/2024', '06/30/2024', '09/30/2024', '12/31/2024', '03/31/2025'],
    'mm-smin': ['$0', '$50', '$100', '$250', '$500', '$1,000'],
    'mm-smax': ['$1,000', '$2,500', '$5,000', '$10,000', '$25,000', '$50,000'],
    'mm-shmin': ['01/01/2023', '04/01/2023', '07/01/2023', '10/01/2023', '01/01/2024'],
    'mm-shmax': ['03/31/2024', '06/30/2024', '09/30/2024', '12/31/2024', '03/31/2025'],
  };

  readonly modalOverlayOpen = signal(false);
  readonly modalOverlayClosing = signal(false);
  readonly modalOverlaySearch = signal('');
  readonly modalOverlayFieldId = signal('');
  readonly modalOverlayTitle = signal('');
  readonly modalOverlayOptions = signal<string[]>([]);
  readonly modalOverlayMode = signal<'single' | 'multi'>('multi');
  readonly modalPendingSelections = signal(new Set<string>());

  // Title map for overlay header
  private static readonly MODAL_TITLES: Record<string, string> = {
    'mf-default': 'Select Report',
    'mf-selected': 'Select Report',
    'mf-overlay': 'Select Reports',
    'mfg-vert': 'Select Report Type',
    'mfg-span': 'Select Payer',
    'mfg-horiz': 'Select Provider',
    'mfg-hspan': 'Select Plan',
    'mm-min': 'Select Minimum',
    'mm-max': 'Select Maximum',
    'mm-hmin': 'Select Start Date',
    'mm-hmax': 'Select End Date',
    'mm-smin': 'Select Minimum',
    'mm-smax': 'Select Maximum',
    'mm-shmin': 'Select Start Date',
    'mm-shmax': 'Select End Date',
  };

  openModalOverlay(fieldId: string, mode: 'single' | 'multi' = 'multi'): void {
    const options = AppComponent.MODAL_OPTIONS[fieldId] || [];
    const title = AppComponent.MODAL_TITLES[fieldId] || 'Select';
    this.modalOverlayFieldId.set(fieldId);
    this.modalOverlayTitle.set(title);
    this.modalOverlayOptions.set(options);
    this.modalOverlayMode.set(mode);
    this.modalOverlaySearch.set('');
    this.modalOverlayClosing.set(false);

    // Copy confirmed selections into pending
    if (mode === 'multi') {
      this.modalPendingSelections.set(new Set(this.ms(fieldId)()));
    } else {
      const current = this.ss(fieldId)();
      this.modalPendingSelections.set(current ? new Set([current]) : new Set());
    }

    this.modalOverlayOpen.set(true);
  }

  toggleModalPending(value: string): void {
    if (this.modalOverlayMode() === 'single') {
      // Single-select: replace
      this.modalPendingSelections.set(new Set([value]));
      return;
    }
    this.modalPendingSelections.update(prev => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value); else next.add(value);
      return next;
    });
  }

  applyModalSelections(): void {
    const fieldId = this.modalOverlayFieldId();
    const pending = this.modalPendingSelections();

    if (this.modalOverlayMode() === 'single') {
      const val = pending.size > 0 ? Array.from(pending)[0] : '';
      this.ss(fieldId).set(val);
    } else {
      this.ms(fieldId).set(new Set(pending));
    }

    this._closeOverlay();
  }

  cancelModalOverlay(): void {
    this._closeOverlay();
  }

  private _closeOverlay(): void {
    this.modalOverlayClosing.set(true);
    setTimeout(() => {
      this.modalOverlayOpen.set(false);
      this.modalOverlayClosing.set(false);
    }, 150);
  }

  modalFieldMatchesSearch(label: string): boolean {
    const q = this.modalOverlaySearch().toLowerCase();
    return q === '' || label.toLowerCase().includes(q);
  }

  modalFieldDisplayText(fieldId: string, mode: 'single' | 'multi' = 'multi'): string {
    if (mode === 'single') return this.ss(fieldId)();
    const s = this.ms(fieldId)();
    if (s.size === 0) return '';
    return `${s.size} selected`;
  }

  modalFieldHasValue(fieldId: string, mode: 'single' | 'multi' = 'multi'): boolean {
    if (mode === 'single') return !!this.ss(fieldId)();
    return this.ms(fieldId)().size > 0;
  }

  modalFieldCoreAnyModified(): boolean {
    const defaultVal = this.ms('mf-default')();
    const selectedVal = this.ms('mf-selected')();
    const overlayVal = this.ms('mf-overlay')();
    const selectedDefault = selectedVal.size === 1 && selectedVal.has('Denial Analysis');
    return defaultVal.size > 0 || !selectedDefault || overlayVal.size > 0;
  }

  resetModalFieldCore(): void {
    this.ms('mf-default').set(new Set());
    this.ms('mf-selected').set(new Set(['Denial Analysis']));
    this.ms('mf-overlay').set(new Set());
  }

  clearModalField(fieldId: string, mode: 'single' | 'multi' = 'multi'): void {
    if (mode === 'single') {
      this.ss(fieldId).set('');
    } else {
      this.ms(fieldId).set(new Set());
    }
  }

  // ── Radio Picker demo state ─────────────────

  // Single selection per group (keyed by group ID)
  private _radioSelections = new Map<string, ReturnType<typeof signal<string>>>([
    ['brand-group', signal('Option A')],
    ['neutral-group', signal('Option A')],
    ['brand-group-right', signal('Option A')],
    ['neutral-group-right', signal('Option A')],
    ['brand-group-mini', signal('Option A')],
    ['neutral-group-mini', signal('Option A')],
  ]);

  radioSelected(groupId: string, option: string): boolean {
    if (!this._radioSelections.has(groupId)) {
      this._radioSelections.set(groupId, signal(''));
    }
    return this._radioSelections.get(groupId)!() === option;
  }

  selectRadio(groupId: string, option: string): void {
    if (!this._radioSelections.has(groupId)) {
      this._radioSelections.set(groupId, signal(''));
    }
    this._radioSelections.get(groupId)!.set(option);
  }

  /* ── Checkbox Dataviz series list ── */
  readonly datavizSeries: CheckboxDatavizSeries[] = ['01', '02', '03', '04', '05', '06', '07', '08'];

  /* ── Checkbox Table demo ── */
  readonly tableTheme = signal<'brand' | 'neutral'>('brand');
  readonly tableSize  = signal<'base' | 'mini'>('base');
  readonly tableEntries = signal<boolean[]>([false, true, false, false, true]);

  readonly tableHeaderChecked = computed(() => this.tableEntries().every(Boolean));
  readonly tableHeaderIndeterminate = computed(() => {
    const entries = this.tableEntries();
    const count = entries.filter(Boolean).length;
    return count > 0 && count < entries.length;
  });

  toggleTableEntry(index: number): void {
    const entries = [...this.tableEntries()];
    entries[index] = !entries[index];
    this.tableEntries.set(entries);
  }

  toggleTableAll(): void {
    const all = this.tableEntries().every(Boolean);
    this.tableEntries.set(this.tableEntries().map(() => !all));
  }

  /* ── Checkbox state helpers ── */
  private _checkboxStates = new Map<string, ReturnType<typeof signal<boolean>>>([
    ['brand-left-b', signal(true)],
    ['brand-right-b', signal(true)],
    ['brand-mini-b', signal(true)],
    ['neutral-left-b', signal(true)],
    ['neutral-mini-b', signal(true)],
  ]);

  checkboxChecked(id: string): boolean {
    if (!this._checkboxStates.has(id)) {
      this._checkboxStates.set(id, signal(false));
    }
    return this._checkboxStates.get(id)!();
  }

  toggleCheckbox(id: string): void {
    if (!this._checkboxStates.has(id)) {
      this._checkboxStates.set(id, signal(false));
    }
    const s = this._checkboxStates.get(id)!;
    s.set(!s());
  }

  /* ── Switch state helpers ── */
  private _switchStates = new Map<string, ReturnType<typeof signal<boolean>>>([
    ['brand-base-b', signal(true)],
    ['brand-base-label-b', signal(true)],
    ['brand-base-right-b', signal(true)],
    ['brand-mini-b', signal(true)],
    ['brand-mini-label-b', signal(true)],
    ['neutral-base-b', signal(true)],
    ['neutral-base-label-b', signal(true)],
    ['neutral-mini-b', signal(true)],
    ['neutral-mini-label-b', signal(true)],
    ['card-span-b', signal(true)],
    ['card-stack-b', signal(true)],
  ]);

  switchChecked(id: string): boolean {
    if (!this._switchStates.has(id)) {
      this._switchStates.set(id, signal(false));
    }
    return this._switchStates.get(id)!();
  }

  toggleSwitch(id: string): void {
    if (!this._switchStates.has(id)) {
      this._switchStates.set(id, signal(false));
    }
    const s = this._switchStates.get(id)!;
    s.set(!s());
  }
}
