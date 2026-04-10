/* Figma: Analytics → Remittances — X3ePdrL3EFGOKK6Gb6qbV7 node 49:2
   Layout: sidebar (left, 320px) + main content card (right, flex:1).
   Pagination and Status Bars are deferred — to be built later. */

import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal } from '@angular/core';
import { DataTableComponent } from '@merces/components/display/data-table/data-table/data-table.component';
import type { DataTableColumn } from '@merces/components/display/data-table/data-table/data-table.types';
import { CtaButtonComponent } from '@merces/components/inputs-and-interactive/cta-button/cta-button.component';
import { TabButtonComponent } from '@merces/components/inputs-and-interactive/tab-button/tab-button.component';
import { DropdownGroupComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-group/dropdown-group.component';
import { DropdownComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-standalone/dropdown.component';
import { DropdownItemComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-item/dropdown-item.component';
import { CheckboxDatavizComponent } from '@merces/components/inputs-and-interactive/checkboxes/checkbox-dataviz/checkbox-dataviz.component';
import type { CheckboxDatavizSeries } from '@merces/components/inputs-and-interactive/checkboxes/checkbox-dataviz/checkbox-dataviz.types';
import { DownloadChipComponent } from '../components/download-chip/download-chip.component';
import { RemittancesSidebarComponent } from '../components/remittances-sidebar/remittances-sidebar.component';
import { DEFAULT_PRESETS } from './data/presets';
import { REMITTANCES_RECORDS, CHART_SERIES_DEFS, CHART_GROUPS } from './data/records';

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
    DropdownGroupComponent,
    DropdownComponent,
    DropdownItemComponent,
    CheckboxDatavizComponent,
  ],
  templateUrl: './remittances.component.html',
  styleUrl: './remittances.component.css',
})
export class AnalyticsRemittancesComponent {
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
  private readonly _tableSortKey = signal<string | null>('billingProvider');
  private readonly _tableSortDir = signal<'ascending' | 'descending'>('ascending');

  /** Called by (sortChange) on the data table — mirrors sort state into signals. */
  protected onTableSortChange(e: { key: string | null; direction: 'ascending' | 'descending' | 'none' }): void {
    this._tableSortKey.set(e.key);
    if (e.direction !== 'none') this._tableSortDir.set(e.direction);
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

  /** Chart groups sorted in sync with the table's active sort — full parity for all columns. */
  protected readonly chartGroups = computed(() => {
    const key = this._tableSortKey();
    const dir = this._tableSortDir();
    if (!key) return CHART_GROUPS;  // no active sort — default insertion order

    const seriesId = this._COL_TO_SERIES[key];

    return [...CHART_GROUPS].sort((a, b) => {
      let cmp: number;
      if (seriesId === null || seriesId === undefined) {
        // billingProvider: lexicographic / numeric string compare on groupId
        cmp = a.groupId.localeCompare(b.groupId, undefined, { numeric: true });
      } else {
        // numeric series value compare
        cmp = (a.seriesValues[seriesId] ?? 0) - (b.seriesValues[seriesId] ?? 0);
      }
      return dir === 'ascending' ? cmp : -cmp;
    });
  });

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
    for (const group of CHART_GROUPS) {
      for (const id of active) {
        const val = group.seriesValues[id] ?? 0;
        if (val > rawMax) rawMax = val;
      }
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

  /* ── Row data — swap REMITTANCES_RECORDS for an API call once backend is wired ── */
  protected readonly rows = REMITTANCES_RECORDS;
}
