/* Figma: Remittances Sidebar — X3ePdrL3EFGOKK6Gb6qbV7 node 1311:13964
   Filter panel for the Analytics → Remittances screen.
   Report Console (top) + Section Connector + Custom Filters (bottom).
   Sidebar expansion is controlled by the Toggle Small inside the Report Console. */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  signal,
} from '@angular/core';
import { RemittancesReportConsoleComponent } from '../remittances-report-console/remittances-report-console.component';
import { SectionConnectorComponent } from '@merces/components/display/section-connector/section-connector.component';
import { IconComponent } from '@merces/assets/icon/icon.component';
import { CtaButtonComponent } from '@merces/components/inputs-and-interactive/cta-button/cta-button.component';
import { DropdownComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-standalone/dropdown.component';
import { DropdownGroupComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-group/dropdown-group.component';
import { DropdownItemComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-item/dropdown-item.component';
import { DropdownSectionComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-section/dropdown-section.component';
import { DropdownSeparatorComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-separator/dropdown-separator.component';
import { StringfieldPlainComponent } from '@merces/components/data-entry/stringfield-plain/stringfield-plain.component';
import { StringfieldPlainGroupComponent } from '@merces/components/data-entry/stringfield-plain/stringfield-plain-group/stringfield-plain-group.component';
import { StringfieldPlainMinMaxGroupComponent } from '@merces/components/data-entry/stringfield-plain/stringfield-plain-minmax-group/stringfield-plain-minmax-group.component';
import { CalendarRangedComponent } from '@merces/components/data-entry/calendar/calendar-ranged.component';
import { SearchComponent } from '@merces/components/inputs-and-interactive/sub-controls/search/search.component';
import { OverlayScrollComponent } from '@merces/components/display/overlay-scroll/overlay-scroll.component';
import { DEFAULT_PRESETS } from '../../remittances/data/presets';
import type { ReportPreset, PresetType } from '../../remittances/data/presets';

type DateColumnValue = 'date-of-service' | 'date-of-service-end' | 'check-date';
type DateRangeValue  =
  | 'last-7-days' | 'last-30-days' | 'last-90-days'
  | 'last-month'  | 'last-3-months' | 'last-6-months' | 'last-12-months'
  | 'this-year'   | 'last-year' | 'last-5-years'
  | 'custom';
type ParameterDropdownValue = 'any';

const DEFAULT_DATE_COLUMN: DateColumnValue = 'date-of-service';
const DEFAULT_DATE_RANGE:  DateRangeValue  = 'last-5-years';
const DEFAULT_PARAMETER_DROPDOWN: ParameterDropdownValue = 'any';

const TEXT_FILTER_KEYS = [
  'adjustmentReasonCodes',
  'billingProviderNames',
  'billingProviderNumbers',
  'checkNumber',
  'claimControlNumbers',
  'claimFrequencyCodes',
  'diagnosisRelatedGroup',
  'facilityCodes',
  'moaRemarkCodes',
  'payers',
  'processedAs',
  'renderingProviderNames',
  'renderingProviderNumbers',
  'typeOfBills',
] as const;

const MIN_MAX_FILTER_KEYS = [
  'coInsurance',
  'coPayment',
  'costReportDays',
  'coveredDays',
  'deductible',
  'ppsCapitalAmount',
  'ppsCapitalOutlierAmount',
  'ppsOperatingOutlierAmount',
  'totalAllowed',
  'totalBilled',
  'totalPaid',
  'totalPrDollars',
] as const;

const PARAMETER_DATE_RANGE_KEYS = [
  'dateOfServiceEnd',
  'payerAcceptanceDates',
  'dosEndDates',
] as const;

type TextFilterKey = typeof TEXT_FILTER_KEYS[number];
type MinMaxFilterKey = typeof MIN_MAX_FILTER_KEYS[number];
type ParameterDateRangeKey = typeof PARAMETER_DATE_RANGE_KEYS[number];

interface MinMaxFilterValue {
  readonly min: string;
  readonly max: string;
}

interface FilterDateRangeValue {
  readonly start: Date | null;
  readonly end: Date | null;
}

interface RemittancesFilterSnapshot {
  readonly dateColumn: DateColumnValue;
  readonly dateRange: DateRangeValue;
  readonly customDateRange: FilterDateRangeValue;
  readonly adjustmentReasonCategory: ParameterDropdownValue;
  readonly claimStatus: ParameterDropdownValue;
  readonly textFilters: Record<TextFilterKey, string>;
  readonly minMaxFilters: Record<MinMaxFilterKey, MinMaxFilterValue>;
  readonly dateRangeFilters: Record<ParameterDateRangeKey, FilterDateRangeValue>;
}

function createEmptyDateRange(): FilterDateRangeValue {
  return { start: null, end: null };
}

function createEmptyTextFilters(): Record<TextFilterKey, string> {
  return Object.fromEntries(
    TEXT_FILTER_KEYS.map(key => [key, ''])
  ) as Record<TextFilterKey, string>;
}

function createEmptyMinMaxFilters(): Record<MinMaxFilterKey, MinMaxFilterValue> {
  return Object.fromEntries(
    MIN_MAX_FILTER_KEYS.map(key => [key, { min: '', max: '' }])
  ) as Record<MinMaxFilterKey, MinMaxFilterValue>;
}

function createEmptyDateRangeFilters(): Record<ParameterDateRangeKey, FilterDateRangeValue> {
  return Object.fromEntries(
    PARAMETER_DATE_RANGE_KEYS.map(key => [key, createEmptyDateRange()])
  ) as Record<ParameterDateRangeKey, FilterDateRangeValue>;
}

function createDefaultFilterSnapshot(): RemittancesFilterSnapshot {
  return {
    dateColumn: DEFAULT_DATE_COLUMN,
    dateRange: DEFAULT_DATE_RANGE,
    customDateRange: createEmptyDateRange(),
    adjustmentReasonCategory: DEFAULT_PARAMETER_DROPDOWN,
    claimStatus: DEFAULT_PARAMETER_DROPDOWN,
    textFilters: createEmptyTextFilters(),
    minMaxFilters: createEmptyMinMaxFilters(),
    dateRangeFilters: createEmptyDateRangeFilters(),
  };
}

@Component({
  selector: 'payerpath-remittances-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sidebar--expanded]':       'sidebarExpanded()',
    '[class.sidebar--collapsed]':      '!sidebarExpanded()',
    '[class.sidebar--hover-expanded]': 'hoverExpanded()',
    '(mouseenter)':                    'onMouseEnter()',
    '(mouseleave)':                    'onMouseLeave()',
  },
  imports: [
    RemittancesReportConsoleComponent,
    SectionConnectorComponent,
    IconComponent,
    CtaButtonComponent,
    DropdownComponent,
    DropdownGroupComponent,
    DropdownItemComponent,
    DropdownSectionComponent,
    DropdownSeparatorComponent,
    StringfieldPlainComponent,
    StringfieldPlainGroupComponent,
    StringfieldPlainMinMaxGroupComponent,
    CalendarRangedComponent,
    SearchComponent,
    OverlayScrollComponent,
  ],
  templateUrl: './remittances-sidebar.component.html',
  styleUrl: './remittances-sidebar.component.css',
})
export class RemittancesSidebarComponent {

  /* ── Available presets ── */
  protected readonly allPresets = DEFAULT_PRESETS;

  /* ── Active preset state ── */
  protected readonly selectedPreset = signal<ReportPreset>(DEFAULT_PRESETS[1]); // Denial Analysis
  protected readonly presetType     = signal<PresetType>('saved');

  /* ── Sidebar expansion — toggled by Report Console's Hide/Show ── */
  protected readonly sidebarExpanded  = signal(true);

  /**
   * True when the mouse is over the sidebar while it is collapsed.
   * Creates a hover-expanded "peek" state — the sidebar visually shows at
   * full width as an overlay without affecting the page layout.
   */
  protected readonly hoverExpanded = signal(false);

  /**
   * True when the sidebar should display its full content — either because
   * the user has toggled it expanded, or because they are hovering over it
   * while it is collapsed.  Used for all content open/close bindings.
   */
  protected readonly isFullyExpanded = computed(() =>
    this.sidebarExpanded() || this.hoverExpanded()
  );

  /* ── Filter search — filters the visible parameters list ── */
  protected readonly filterSearch = model('');

  /* ── Date filter selections (have defaults — only changed by explicit user selection) ── */
  protected readonly dateColumn = signal<DateColumnValue>(DEFAULT_DATE_COLUMN);
  protected readonly dateRange  = signal<DateRangeValue>(DEFAULT_DATE_RANGE);
  protected readonly customDateRange = signal<FilterDateRangeValue>(createEmptyDateRange());

  /** True when Date Range is Custom — shows the ranged date picker inline */
  protected readonly isCustomDateRange = computed(() => this.dateRange() === 'custom');

  /* ── Parameter dropdown selections ── */
  protected readonly adjustmentReasonCategory = signal<ParameterDropdownValue>(DEFAULT_PARAMETER_DROPDOWN);
  protected readonly claimStatus              = signal<ParameterDropdownValue>(DEFAULT_PARAMETER_DROPDOWN);
  protected readonly textFilters              = signal<Record<TextFilterKey, string>>(createEmptyTextFilters());
  protected readonly minMaxFilters            = signal<Record<MinMaxFilterKey, MinMaxFilterValue>>(createEmptyMinMaxFilters());
  protected readonly dateRangeFilters         = signal<Record<ParameterDateRangeKey, FilterDateRangeValue>>(createEmptyDateRangeFilters());

  /* ── Date filter display labels ── */
  protected readonly DATE_COLUMN_LABELS: Record<DateColumnValue, string> = {
    'date-of-service':     'Date of Service',
    'date-of-service-end': 'Date of Service End',
    'check-date':          'Check Date',
  };

  protected readonly DATE_RANGE_LABELS: Record<DateRangeValue, string> = {
    'last-7-days':    'Last 7 Days',
    'last-30-days':   'Last 30 days',
    'last-90-days':   'Last 90 days',
    'last-month':     'Last Month',
    'last-3-months':  'Last 3 Months',
    'last-6-months':  'Last 6 Months',
    'last-12-months': 'Last 12 Months',
    'this-year':      'This Year',
    'last-year':      'Last Year',
    'last-5-years':   'Last 5 Years',
    'custom':         'Custom Date Range',
  };

  protected readonly PARAMETER_DROPDOWN_LABELS: Record<ParameterDropdownValue, string> = {
    'any': 'Any',
  };

  /** Increments on Reset — forces @for to destroy and recreate all filter components. */
  protected readonly _filterKey = signal(0);

  /* ─────────────────────────────────────────────────────────────
     Filter state machine
     ─────────────────────────────────────────────────────────────
     All visible filter inputs are owned signals. Pending state is computed by
     comparing a staged "draft" snapshot with the last applied snapshot. This
     keeps Reset/Apply honest today and gives the future custom-preset save
     flow one serialisable filter object to persist.
     ───────────────────────────────────────────────────────────── */

  private readonly _activePresetSnapshot = signal<RemittancesFilterSnapshot>(createDefaultFilterSnapshot());
  private readonly _appliedFilterSnapshot = signal<RemittancesFilterSnapshot>(createDefaultFilterSnapshot());

  private readonly _draftFilterSnapshot = computed<RemittancesFilterSnapshot>(() => ({
    dateColumn: this.dateColumn(),
    dateRange: this.dateRange(),
    customDateRange: this.customDateRange(),
    adjustmentReasonCategory: this.adjustmentReasonCategory(),
    claimStatus: this.claimStatus(),
    textFilters: this.textFilters(),
    minMaxFilters: this.minMaxFilters(),
    dateRangeFilters: this.dateRangeFilters(),
  }));

  /**
   * True when there are staged changes that differ from the last-Applied state.
   */
  private readonly _pendingChanges = computed(() =>
    !this._filterSnapshotsEqual(this._draftFilterSnapshot(), this._appliedFilterSnapshot())
  );

  /** Apply is disabled when there are no pending changes to commit. */
  protected readonly applyDisabled = computed(() => !this._pendingChanges());

  /**
   * Reset is disabled when neither the staged nor applied state has any
   * divergence from the active preset — i.e., there is nothing to reset.
   */
  protected readonly resetDisabled = computed(() =>
    this._filterSnapshotsEqual(this._draftFilterSnapshot(), this._activePresetSnapshot()) &&
    this._filterSnapshotsEqual(this._appliedFilterSnapshot(), this._activePresetSnapshot())
  );

  /* ── Hover expansion handlers ── */

  /** Called on host mouseenter — starts the hover-peek if sidebar is collapsed. */
  protected onMouseEnter(): void {
    if (!this.sidebarExpanded()) this.hoverExpanded.set(true);
  }

  /** Called on host mouseleave — always ends the hover-peek. */
  protected onMouseLeave(): void {
    this.hoverExpanded.set(false);
  }

  /* ── Preset selection ── */

  protected onPresetSelected(preset: ReportPreset): void {
    const presetSnapshot = this._snapshotForPreset(preset);

    this.selectedPreset.set(preset);
    this._activePresetSnapshot.set(this._cloneFilterSnapshot(presetSnapshot));
    this._appliedFilterSnapshot.set(this._cloneFilterSnapshot(presetSnapshot));
    this._restoreDraftFromSnapshot(presetSnapshot);
    this.presetType.set('saved');
  }

  /* ── Date filter handlers ── */

  /**
   * Called when the user selects a Date Column item. No-ops if value is unchanged.
   * Pending state is computed automatically — no flag needed.
   */
  protected onDateColumnChanged(value: DateColumnValue): void {
    if (this.dateColumn() === value) return;
    this.dateColumn.set(value);
  }

  /**
   * Called when the user selects a Date Range item. No-ops if value is unchanged.
   * Pending state is computed automatically — no flag needed.
   */
  protected onDateRangeChanged(value: DateRangeValue): void {
    if (this.dateRange() === value) return;
    this.dateRange.set(value);
    if (value !== 'custom') {
      this.customDateRange.set(createEmptyDateRange());
    }
  }

  /**
   * Parameter dropdowns should only mark the sidebar dirty when their value
   * changes. Opening the menu, or re-selecting the checked default item, is not
   * a filter change.
   */
  protected onAdjustmentReasonCategoryChanged(value: ParameterDropdownValue): void {
    if (this.adjustmentReasonCategory() === value) return;
    this.adjustmentReasonCategory.set(value);
  }

  protected onClaimStatusChanged(value: ParameterDropdownValue): void {
    if (this.claimStatus() === value) return;
    this.claimStatus.set(value);
  }

  protected onCustomDateRangeChanged(range: FilterDateRangeValue): void {
    this.customDateRange.set(this._cloneDateRange(range));
  }

  protected textFilterValue(key: TextFilterKey): string {
    return this.textFilters()[key];
  }

  protected onTextFilterChanged(key: TextFilterKey, value: string): void {
    this.textFilters.update(filters => ({
      ...filters,
      [key]: value,
    }));
  }

  protected minMaxFilterValue(key: MinMaxFilterKey, bound: keyof MinMaxFilterValue): string {
    return this.minMaxFilters()[key][bound];
  }

  protected onMinMaxFilterChanged(
    key: MinMaxFilterKey,
    bound: keyof MinMaxFilterValue,
    value: string,
  ): void {
    this.minMaxFilters.update(filters => ({
      ...filters,
      [key]: {
        ...filters[key],
        [bound]: value,
      },
    }));
  }

  protected dateRangeFilterValue(key: ParameterDateRangeKey): FilterDateRangeValue {
    return this.dateRangeFilters()[key];
  }

  protected onDateRangeFilterChanged(key: ParameterDateRangeKey, range: FilterDateRangeValue): void {
    this.dateRangeFilters.update(filters => ({
      ...filters,
      [key]: this._cloneDateRange(range),
    }));
  }

  /* ── Filter state handlers ── */

  /**
   * Commits staged filter changes and notifies the report-console.
   * This is the only place that updates presetType — any report-console
   * "save" affordance only appears after an explicit Apply.
   */
  protected onApply(): void {
    const draftSnapshot = this._draftFilterSnapshot();

    this._appliedFilterSnapshot.set(this._cloneFilterSnapshot(draftSnapshot));
    this.presetType.set(
      this._filterSnapshotsEqual(draftSnapshot, this._activePresetSnapshot())
        ? 'saved'
        : 'unsaved'
    );
  }

  /**
   * Fully resets all filter fields back to the active preset state.
   * Reset is the opposite branch from Apply: it discards the draft, restores
   * the applied snapshot, and returns the report-console to Saved.
   */
  protected onResetFilters(): void {
    // Clear the search query immediately (it's bound, so it updates the list)
    this.filterSearch.set('');

    // Reset the draft to the active preset configuration. Today every shipped
    // preset uses the default snapshot; future custom presets can provide their
    // own saved snapshot via _snapshotForPreset().
    const activePresetSnapshot = this._activePresetSnapshot();
    this._restoreDraftFromSnapshot(activePresetSnapshot);
    this._appliedFilterSnapshot.set(this._cloneFilterSnapshot(activePresetSnapshot));
    this.presetType.set('saved');

    // Defer @for key increment to the next frame so the custom-date slot can
    // start its collapse transition before the parameter list is recreated.
    // Keeping those layout changes out of the same render turn avoids the
    // visible hitch that used to happen during Reset.
    requestAnimationFrame(() => this._filterKey.update(k => k + 1));
  }

  /* ── Sidebar toggle ── */

  /**
   * Toggles the sidebar between its expanded and collapsed states.
   * Always clears the hover-expanded state first so the next stable state
   * is determined exclusively by the toggle (not by cursor position).
   * Uses `isFullyExpanded()` as the "current" state so that clicking the
   * toggle while hover-peeking correctly collapses rather than expanding.
   */
  protected onExpandedToggle(): void {
    this.hoverExpanded.set(false);
    this.sidebarExpanded.set(!this.isFullyExpanded());
  }

  /* ── Report Console actions (wired when save dialog / persistence is built) ── */

  protected onSaveAs(): void {
    // Custom preset save flow — to be wired once the save dialog is built
  }

  protected onUpdateChanges(): void {
    // Overwrite custom preset — to be wired once persistence is in place
  }

  /* ── Search filtering ── */

  /** Returns true when the filter label matches the current search query. */
  protected isVisible(label: string): boolean {
    const q = this.filterSearch().toLowerCase().trim();
    return q === '' || label.toLowerCase().includes(q);
  }

  private _snapshotForPreset(_preset: ReportPreset): RemittancesFilterSnapshot {
    return createDefaultFilterSnapshot();
  }

  private _restoreDraftFromSnapshot(snapshot: RemittancesFilterSnapshot): void {
    const next = this._cloneFilterSnapshot(snapshot);

    this.dateColumn.set(next.dateColumn);
    this.dateRange.set(next.dateRange);
    this.customDateRange.set(next.customDateRange);
    this.adjustmentReasonCategory.set(next.adjustmentReasonCategory);
    this.claimStatus.set(next.claimStatus);
    this.textFilters.set(next.textFilters);
    this.minMaxFilters.set(next.minMaxFilters);
    this.dateRangeFilters.set(next.dateRangeFilters);
  }

  private _cloneFilterSnapshot(snapshot: RemittancesFilterSnapshot): RemittancesFilterSnapshot {
    return {
      dateColumn: snapshot.dateColumn,
      dateRange: snapshot.dateRange,
      customDateRange: this._cloneDateRange(snapshot.customDateRange),
      adjustmentReasonCategory: snapshot.adjustmentReasonCategory,
      claimStatus: snapshot.claimStatus,
      textFilters: { ...snapshot.textFilters },
      minMaxFilters: Object.fromEntries(
        MIN_MAX_FILTER_KEYS.map(key => [key, { ...snapshot.minMaxFilters[key] }])
      ) as Record<MinMaxFilterKey, MinMaxFilterValue>,
      dateRangeFilters: Object.fromEntries(
        PARAMETER_DATE_RANGE_KEYS.map(key => [key, this._cloneDateRange(snapshot.dateRangeFilters[key])])
      ) as Record<ParameterDateRangeKey, FilterDateRangeValue>,
    };
  }

  private _cloneDateRange(range: FilterDateRangeValue): FilterDateRangeValue {
    return {
      start: range.start ? new Date(range.start.getTime()) : null,
      end: range.end ? new Date(range.end.getTime()) : null,
    };
  }

  private _filterSnapshotsEqual(
    a: RemittancesFilterSnapshot,
    b: RemittancesFilterSnapshot,
  ): boolean {
    return a.dateColumn === b.dateColumn &&
      a.dateRange === b.dateRange &&
      a.adjustmentReasonCategory === b.adjustmentReasonCategory &&
      a.claimStatus === b.claimStatus &&
      this._dateRangesEqual(a.customDateRange, b.customDateRange) &&
      TEXT_FILTER_KEYS.every(key => a.textFilters[key] === b.textFilters[key]) &&
      MIN_MAX_FILTER_KEYS.every(key =>
        a.minMaxFilters[key].min === b.minMaxFilters[key].min &&
        a.minMaxFilters[key].max === b.minMaxFilters[key].max
      ) &&
      PARAMETER_DATE_RANGE_KEYS.every(key =>
        this._dateRangesEqual(a.dateRangeFilters[key], b.dateRangeFilters[key])
      );
  }

  private _dateRangesEqual(a: FilterDateRangeValue, b: FilterDateRangeValue): boolean {
    return this._dateTime(a.start) === this._dateTime(b.start) &&
      this._dateTime(a.end) === this._dateTime(b.end);
  }

  private _dateTime(date: Date | null): number | null {
    return date ? date.getTime() : null;
  }
}
