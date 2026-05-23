/* Figma: Analytics → Remittances — X3ePdrL3EFGOKK6Gb6qbV7 node 49:2
   Layout: sidebar (left, 320px) + main content card (right, flex:1).
   Pagination and Status Bars are deferred — to be built later. */

import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, signal, OnDestroy } from '@angular/core';
import { DataTableComponent } from '@merces/components/display/data-table/data-table/data-table.component';
import type { DataTableColumn } from '@merces/components/display/data-table/data-table/data-table.types';
import { TableNoDataComponent } from '@merces/components/display/data-table/table-no-data/table-no-data.component';
import { PaginatorComponent } from '@merces/components/display/pagination/paginator/paginator.component';
import { CtaButtonComponent } from '@merces/components/inputs-and-interactive/cta-button/cta-button.component';
import { TabButtonComponent } from '@merces/components/inputs-and-interactive/tab-button/tab-button.component';
import { DropdownGroupComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-group/dropdown-group.component';
import { DropdownComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-standalone/dropdown.component';
import { DropdownItemComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-item/dropdown-item.component';
import { CheckboxDatavizComponent } from '@merces/components/inputs-and-interactive/checkboxes/checkbox-dataviz/checkbox-dataviz.component';
import type { CheckboxDatavizSeries } from '@merces/components/inputs-and-interactive/checkboxes/checkbox-dataviz/checkbox-dataviz.types';
import { DownloadChipComponent } from '../components/download-chip/download-chip.component';
import { RemittancesSidebarComponent } from '../components/remittances-sidebar/remittances-sidebar.component';
import { ClaimsDataTableComponent } from '../components/claims-data-table/claims-data-table.component';
import { DEFAULT_PRESETS } from './data/presets';
import { CHART_SERIES_DEFS } from './data/records';
import type { ChartGroup } from './data/records';
import { CLAIMS_DATA } from './data/claims-data';
import type { ClaimsDataRow } from '../components/claims-data-table/claims-data.types';

type RemittancesTab    = 'analytics' | 'claims-data' | 'service-data';
type RemittancesPlot   = 'chart' | 'date-series';

@Component({
  selector: 'payerpath-analytics-remittances',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RemittancesSidebarComponent,
    TabButtonComponent,
    CtaButtonComponent,
    DownloadChipComponent,
    DataTableComponent,
    TableNoDataComponent,
    PaginatorComponent,
    DropdownGroupComponent,
    DropdownComponent,
    DropdownItemComponent,
    CheckboxDatavizComponent,
    ClaimsDataTableComponent,
  ],
  templateUrl: './remittances.component.html',
  styleUrl: './remittances.component.css',
})
export class AnalyticsRemittancesComponent implements OnDestroy {
  protected readonly isLoading = signal(true);
  private worker: Worker | null = null;
  private loadTimer: any;
  private readonly _globalMaxValues = signal<Record<string, number>>({});
  
  constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./data/remittances.worker', import.meta.url));
      
      this.worker.onmessage = ({ data }) => {
        if (data.type === 'DATA_READY') {
          clearTimeout(this.loadTimer);
          this._globalMaxValues.set(data.globalMaxValues);
          this._chartGroups.set(data.chartGroups);
          this._paginatedRows.set(data.paginatedRows);
          this.totalItems.set(data.totalItems);
          this.isLoading.set(false);
        }
      };

      effect(() => {
        // Track dependencies
        const page = this.currentPage();
        const size = this.pageSize();
        const sortKey = this.tableSortKey();
        const sortDir = this.tableSortDir();
        const cLimit = this.chartLimit();
        
        if (this.totalItems() === 0) {
          this.isLoading.set(true);
        } else {
          clearTimeout(this.loadTimer);
          this.loadTimer = setTimeout(() => this.isLoading.set(true), 150);
        }

        this.worker?.postMessage({
          type: 'LOAD_DATA',
          sortKey,
          sortDir,
          page,
          pageSize: size,
          chartLimit: cLimit
        });
      });
    } else {
      console.warn('Web Workers are not supported in this environment.');
    }
  }

  ngOnDestroy(): void {
    if (this.worker) {
      this.worker.terminate();
    }
  }
  /* ── Header tab state ── */
  protected readonly activeTab        = signal<RemittancesTab>('analytics');
  protected readonly activePlottingTab = signal<RemittancesPlot>('chart');

  /* ── Segmentation state ── */
  // Reading from the preset explicitly right now as we are actively working with Denial Analysis
  private readonly defaultDenialPreset = DEFAULT_PRESETS.find(p => p.id === 'denial-analysis')!;
  
  protected readonly groupByOptions = signal(this.defaultDenialPreset.segmentation!.groupBy);
  protected readonly frequencyOptions = signal(this.defaultDenialPreset.segmentation!.frequency);
  protected readonly showColumnOptions = signal(this.defaultDenialPreset.segmentation!.showColumn);

  /* ── Chart Series state ── */
  protected readonly chartSeriesDefs = CHART_SERIES_DEFS;
  protected readonly activeSeriesIds = signal<Set<string>>(new Set(this.chartSeriesDefs.map(d => d.id)));

  /* ── Section resizer ── */
  /** Pixel height pinned by the user dragging the resizer. Null = use CSS flex default. */
  protected readonly chartHeightPx = signal<number | null>(null);
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
  private _dragStartY   = 0;
  private _dragStartH   = 0;

  protected onResizerMouseDown(e: MouseEvent): void {
    e.preventDefault();
    this._dragStartY = e.clientY;
    const chartEl = this._el.nativeElement.querySelector<HTMLElement>('.charting');
    const tableEl = this._el.nativeElement.querySelector<HTMLElement>('.table-area');
    this._dragStartH = chartEl?.getBoundingClientRect().height ?? 300;

    // Total pool = chart + table at drag start.
    // Chart is clamped to [220, pool - 280] so the table always keeps ≥ 280px.
    const tableH   = tableEl?.getBoundingClientRect().height ?? 300;
    const totalPool = this._dragStartH + tableH;
    const minChartH = 220;
    const maxChartH = totalPool - 280;

    const onMove = (m: MouseEvent): void => {
      const newH = Math.min(maxChartH, Math.max(minChartH, this._dragStartH + (m.clientY - this._dragStartY)));
      this.chartHeightPx.set(newH);
    };
    const onUp = (): void => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  }

  /* ── Table sort state — mirrored to chart row order.
     Defaults to Billing Provider ascending, matching the table's [defaultSort] binding. */
  protected readonly tableSortKey = signal<string | null>('billingProvider');
  protected readonly tableSortDir = signal<'ascending' | 'descending'>('ascending');

  /** Called by (sortChange) on the data table — mirrors sort state into signals. */
  protected onTableSortChange(e: { key: string | null; direction: 'ascending' | 'descending' | 'none' }): void {
    if (e.direction === 'none') {
      // 'none' resets to the default sort (billingProvider ascending).
      // This prevents the worker from entering insertion-order mode, which would
      // cause the DataTable's local sort to operate on only the first 25 base records
      // rather than the full globally-sorted 50k dataset.
      this.tableSortKey.set('billingProvider');
      this.tableSortDir.set('ascending');
    } else {
      this.tableSortKey.set(e.key);
      this.tableSortDir.set(e.direction);
    }
  }

  /* ── Chart limit for infinite scroll ── */
  protected readonly chartLimit = signal(100);

  protected onChartScroll(e: Event): void {
    const target = e.target as HTMLElement;
    // Load more when scrolled within 50px of the bottom
    if (Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 50) {
      if (this.chartGroups().length === this.chartLimit() && this.chartLimit() < this.totalItems()) {
        this.chartLimit.update(v => v + 100);
      }
    }
  }

  /** Maps data table column keys to the corresponding chart group sort value.
   *  billingProvider sorts by groupId (string); all others sort by their series numeric value. */
  private readonly _COL_TO_SERIES: Record<string, string | null> = {
    billingProvider:  null,   // null → sort by groupId string
    totalClaimCount: '01',
    days0to30:       '02',
    days31to60:      '03',
    days61to90:      '04',
    days91to120:     '05',
    days120plus:     '06',
  };

  private readonly _chartGroups = signal<ChartGroup[]>([]);
  
  /** Chart groups fetched from the worker (top 100). */
  protected readonly chartGroups = computed(() => this._chartGroups());

  protected onToggleSeries(seriesId: string): void {
    const active = new Set(this.activeSeriesIds());
    if (active.has(seriesId)) {
      active.delete(seriesId);
    } else {
      active.add(seriesId);
    }
    this.activeSeriesIds.set(active);
  }

  /* ── Chart helpers ── */

  /** Compute a "nice" step size that produces ~targetTicks evenly spaced ticks */
  private _niceStep(rawMax: number, targetTicks: number): number {
    const raw = rawMax / targetTicks;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    if (norm <= 1) return mag;
    if (norm <= 2) return 2 * mag;
    if (norm <= 5) return 5 * mag;
    return 10 * mag;
  }

  /** Reactive chart max — recalculates from VISIBLE series only.
   *  Unchecking a series (e.g. Total Claims) rescales the axis to the next largest. */
  protected readonly _chartMax = computed(() => {
    const active = this.activeSeriesIds();
    if (active.size === 0) return 1000; // safe floor when everything is hidden
    let rawMax = 0;
    const gMax = this._globalMaxValues();
    for (const id of active) {
      const val = gMax[id] ?? 0;
      if (val > rawMax) rawMax = val;
    }
    const step = this._niceStep(rawMax, 9);
    return Math.ceil(rawMax / step) * step;
  });

  /** Maps a raw value to a CSS width % string against the current reactive max.
   *  Pass _chartMax() from the template so Angular tracks the signal dependency. */
  protected getBarWidthPercent(value: number, max: number): string {
    const pct = Math.min((value / max) * 100, 100);
    return `${pct.toFixed(2)}%`;
  }

  /** Reactive x-axis ticks — derived from _chartMax() so scale + labels always match. */
  protected readonly xAxisTicks = computed(() => {
    const max = this._chartMax();
    const step = this._niceStep(max, 9);
    const ticks: { label: string; percent: number }[] = [];
    for (let v = 0; v <= max; v += step) {
      const label = v === 0 ? '0' : v >= 1000 ? `${v / 1000}k` : `${v}`;
      const percent = (v / max) * 100;
      ticks.push({ label, percent });
    }
    return ticks;
  });

  /* ── Claims Data ── */
  protected readonly claimsCurrentPage  = signal(1);
  protected readonly claimsPageSize     = signal(25);
  protected readonly claimsTotalItems   = CLAIMS_DATA.length;

  protected readonly paginatedClaimsRows = computed(() => {
    const page = this.claimsCurrentPage();
    const size = this.claimsPageSize();
    return CLAIMS_DATA.slice((page - 1) * size, page * size);
  });

  /* ── Stub handlers — wired up when chart/download features land ── */
  protected onEditColumns(): void {}
  protected onDownloadAll(): void {}
  protected onDownloadChartSnapshot(): void {}

  /* ── Table columns — Figma node 179:1156
     Billing Provider (sortable) | Total Claim Count | 0-30d | 31-60d | 61-90d | 91-120d ── */
  protected readonly columns: DataTableColumn[] = [
    { key: 'billingProvider',  label: 'Billing Provider',  width: 220, minWidth: 140 },
    { key: 'totalClaimCount', label: 'Total Claim Count', width: 148, minWidth: 160 },
    { key: 'days0to30',       label: '0 – 30 days',       width: 120, minWidth: 120 },
    { key: 'days31to60',      label: '31 – 60 days',      width: 120, minWidth: 120 },
    { key: 'days61to90',      label: '61 – 90 days',      width: 120, minWidth: 120 },
    { key: 'days91to120',     label: '91 – 120 days',     width: 120, minWidth: 120 },
    { key: 'days120plus',     label: '120+ days',          width: 120, minWidth: 120 },
  ];

  /* ── Pagination ── */
  protected readonly currentPage = signal(1);
  protected readonly pageSize    = signal(25);
  protected readonly totalItems  = signal(0);

  /* ── Row data — populated by Web Worker ── */
  private readonly _paginatedRows = signal<any[]>([]);
  
  protected readonly paginatedRows = computed(() => this._paginatedRows());
}
