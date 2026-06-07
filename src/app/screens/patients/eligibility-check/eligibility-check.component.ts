import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  model,
  signal,
  untracked,
} from '@angular/core';
import { OverlayScrollComponent } from '@merces/components/display/overlay-scroll/overlay-scroll.component';
import { TabButtonComponent } from '@merces/components/inputs-and-interactive/tab-button/tab-button.component';
import { SwitchComponent } from '@merces/components/inputs-and-interactive/switch-toggle/switch/switch.component';
import { CtaButtonComponent } from '@merces/components/inputs-and-interactive/cta-button/cta-button.component';
import { DropdownGroupComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-group/dropdown-group.component';
import { DropdownComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-standalone/dropdown.component';
import { DropdownItemComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-item/dropdown-item.component';
import { PaginatorComponent } from '@merces/components/display/pagination/paginator/paginator.component';
import { SearchComponent } from '@merces/components/inputs-and-interactive/sub-controls/search/search.component';
import { CalendarComponent } from '@merces/components/data-entry/calendar/calendar.component';
import type { BadgeResultOutcome } from './components/badge-result/badge-result.component';
import {
  EcTableHeaderComponent,
  type EcSelectionState,
  type EcSortOrder,
} from './components/data-table-header/data-table-header.component';
import { EcEntryRowComponent } from './components/data-table-entryrow/data-table-entryrow.component';
import type { EcRowData } from './components/data-table-entryrow/data-table-entryrow.types';
import { HttpClient } from '@angular/common/http';
import { EcDetailTrayComponent } from './components/detail-tray/detail-tray.component';

// ── Column definitions ────────────────────────────────────────────────────────
// Widths match the Figma frame widths exactly (px). The first entry is the
// checkbox/selection column; the rest are data columns in order.
const COLUMNS: { key: keyof EcRowData | '_selection'; label: string; width: number; minWidth: number; sortable: boolean }[] = [
  { key: '_selection',    label: '',               width: 36,  minWidth: 36,  sortable: false },
  { key: 'patientName',   label: 'Patient Name',   width: 200, minWidth: 200, sortable: true  },
  { key: 'dateOfBirth',   label: 'Date of Birth',  width: 210, minWidth: 210, sortable: true  },
  { key: 'transactionDate', label: 'Transaction Date', width: 210, minWidth: 210, sortable: true },
  { key: 'insurance',     label: 'Insurance',      width: 180, minWidth: 180, sortable: true  },
  { key: 'policyId',      label: 'Policy ID',      width: 150, minWidth: 150, sortable: true  },
  { key: 'result',        label: 'Result',         width: 180, minWidth: 180, sortable: true  },
  { key: 'alerts',        label: 'Alert',          width: 145, minWidth: 145, sortable: true  },
  { key: 'coPayments',    label: 'Co-Payments',    width: 150, minWidth: 150, sortable: true  },
  { key: 'deductibles',   label: 'Deductibles',    width: 145, minWidth: 145, sortable: true  },
  { key: 'provider',      label: 'Provider',       width: 160, minWidth: 160, sortable: true  },
];

@Component({
  selector: 'payerpath-eligibility-check',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OverlayScrollComponent,
    TabButtonComponent,
    SwitchComponent,
    CtaButtonComponent,
    DropdownGroupComponent,
    DropdownComponent,
    DropdownItemComponent,
    PaginatorComponent,
    SearchComponent,
    CalendarComponent,
    EcTableHeaderComponent,
    EcEntryRowComponent,
    EcDetailTrayComponent,
  ],
  templateUrl: './eligibility-check.component.html',
  styleUrl: './eligibility-check.component.css',
})
export class EligibilityCheckComponent {

  protected readonly columns = COLUMNS;

  // ── DOM access ──────────────────────────────────────────────────────────────
  private readonly _el   = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _http = inject(HttpClient);

  // ── Row data — fetched from /api/eligibility-check ───────────────────────────
  private readonly _rows = signal<EcRowData[]>([]);

  // ── Tab + action bar state ───────────────────────────────────────────────────
  protected readonly activeTab     = signal<'eligibility-check-list' | 'payer-response-status'>('eligibility-check-list');
  protected readonly discoveredOnly = signal<boolean>(false);

  // ── Detail tray ──────────────────────────────────────────────────────────────
  protected readonly trayRow = signal<EcRowData | null>(null);
  protected openTray(row: EcRowData): void  { this.trayRow.set(row); }
  protected closeTray(): void               { this.trayRow.set(null); }

  protected onNewRequest():   void { /* TODO */ }
  protected onSettings():     void { /* TODO */ }
  protected onPrint():        void { /* TODO */ }
  protected onDownloadXls():  void { /* TODO */ }

  // ── Column search / filter signals ───────────────────────────────────────────
  protected readonly searchName      = model('');
  protected readonly searchDob       = model<Date | null>(null);
  protected readonly searchTxDate    = model<Date | null>(null);
  protected readonly searchInsurance = model('');
  protected readonly searchPolicyId  = model('');
  protected readonly filterResult    = signal<BadgeResultOutcome | 'all'>('all');
  protected readonly searchAlerts    = model('');
  protected readonly searchCoPay     = model('');
  protected readonly searchDeduct    = model('');
  protected readonly searchProvider  = model('');

  protected readonly filterResultLabel = computed(() => {
    const v = this.filterResult();
    if (v === 'all')             return 'All';
    if (v === 'active')          return 'Active';
    if (v === 'inactive')        return 'Inactive';
    if (v === 'cannot-process')  return 'Cannot Process';
    if (v === 'invalid-response')return 'Invalid Response';
    return 'Unknown';
  });

  protected setFilterResult(v: BadgeResultOutcome | 'all'): void {
    this.filterResult.set(v);
  }

  protected setDiscoveredOnly(v: boolean): void {
    this.discoveredOnly.set(v);
  }

  // ── Filtered rows — applies ALL active filters ────────────────────────────
  protected readonly filteredRows = computed(() => {
    let rows = this._rows();

    if (this.discoveredOnly()) rows = rows.filter(r => r.found);

    const name = this.searchName().trim().toLowerCase();
    if (name) rows = rows.filter(r => r.patientName.toLowerCase().includes(name));

    const dob = this.searchDob();
    if (dob) {
      const s = this._fmtDate(dob);
      rows = rows.filter(r => r.dateOfBirth.includes(s));
    }

    const tx = this.searchTxDate();
    if (tx) {
      const s = this._fmtDate(tx);
      rows = rows.filter(r => r.transactionDate.includes(s));
    }

    const ins = this.searchInsurance().trim().toLowerCase();
    if (ins) rows = rows.filter(r => r.insurance.toLowerCase().includes(ins));

    const pid = this.searchPolicyId().trim().toLowerCase();
    if (pid) rows = rows.filter(r => r.policyId.toLowerCase().includes(pid));

    const res = this.filterResult();
    if (res !== 'all') rows = rows.filter(r => r.result === res);

    const alr = this.searchAlerts().trim().toUpperCase();
    if (alr) rows = rows.filter(r => r.alerts.some(a => a.includes(alr)));

    const cop = this.searchCoPay().trim().toLowerCase();
    if (cop) rows = rows.filter(r => (r.coPayments ?? '').toLowerCase().includes(cop));

    const ded = this.searchDeduct().trim().toLowerCase();
    if (ded) rows = rows.filter(r => (r.deductibles ?? '').toLowerCase().includes(ded));

    const prv = this.searchProvider().trim().toLowerCase();
    if (prv) rows = rows.filter(r => (r.provider ?? '').toLowerCase().includes(prv));

    return rows;
  });

  // ── Constructor — fetch rows, reset page on filter change ───────────────────
  constructor() {
    this._http.get<EcRowData[]>('/api/eligibility-check').subscribe(rows => this._rows.set(rows));

    effect(() => {
      this.filteredRows();                      // tracks all filter signals
      untracked(() => this.currentPage.set(1)); // reset without creating a cycle
    });
  }

  private _fmtDate(d: Date): string {
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const dd   = String(d.getDate()).padStart(2, '0');
    const yyyy = String(d.getFullYear());
    return `${mm}/${dd}/${yyyy}`;
  }

  // ── Pagination ───────────────────────────────────────────────────────────────
  protected readonly currentPage = signal<number>(1);
  protected readonly pageSize    = signal<number>(25);
  protected readonly totalItems  = computed(() => this.filteredRows().length);
  protected readonly paginatedRows = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return this.sortedRows().slice(start, start + size);
  });

  // ── Selection state ─────────────────────────────────────────────────────────
  private readonly _selected = signal<Set<EcRowData>>(new Set());

  protected readonly headerSel = computed<EcSelectionState>(() => {
    const n = this._selected().size;
    if (n === 0) return 'none';
    if (n === this._rows().length) return 'all';
    return 'mixed';
  });

  protected isSelected(row: EcRowData): boolean {
    return this._selected().has(row);
  }

  protected toggleRow(row: EcRowData): void {
    this._selected.update(s => {
      const n = new Set(s);
      n.has(row) ? n.delete(row) : n.add(row);
      return n;
    });
  }

  protected toggleAll(selectAll: boolean): void {
    this._selected.set(selectAll ? new Set(this._rows()) : new Set());
  }

  // ── Sort state ───────────────────────────────────────────────────────────────
  private readonly _sortKey = signal<string | null>('transactionDate');
  private readonly _sortDir = signal<'ascending' | 'descending'>('descending');

  protected sortFor(key: string): EcSortOrder {
    return this._sortKey() === key ? this._sortDir() : 'none';
  }

  protected setSort(key: string, dir: 'ascending' | 'descending'): void {
    this._sortKey.set(key);
    this._sortDir.set(dir);
  }

  protected readonly sortedRows = computed(() => {
    const key = this._sortKey();
    const dir = this._sortDir();
    if (!key) return this.filteredRows();
    return [...this.filteredRows()].sort((a, b) => {
      const av = String((a as unknown as Record<string, unknown>)[key] ?? '');
      const bv = String((b as unknown as Record<string, unknown>)[key] ?? '');
      return dir === 'ascending' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  });

  // ── Column resize ────────────────────────────────────────────────────────────
  // Sparse map of column index → explicit px width. Columns not in the map
  // stay at their Figma default (defined in COLUMNS). Double-click a resize
  // handle to reset that column to its default.
  private readonly _colWidthsPx = signal<Map<number, number>>(new Map());
  private _resizeDrag: { colIndex: number; startX: number; startWidth: number } | null = null;

  protected readonly gridTemplate = computed(() => {
    const widths = this._colWidthsPx();
    return COLUMNS.map((col, i) => {
      const explicit = widths.get(i);
      if (explicit !== undefined) {
        // User has explicitly resized this column — honour the drag value
        return `${Math.max(col.minWidth, explicit)}px`;
      }
      // Selection column: fixed, never grows
      if (col.key === '_selection') {
        return `${col.minWidth}px`;
      }
      // Data columns: grow proportionally to fill available width (mirrors Remittances table)
      return `minmax(${col.minWidth}px, ${col.minWidth}fr)`;
    }).join(' ');
  });

  protected startResize(colIndex: number, event: MouseEvent): void {
    const headers = this._el.nativeElement.querySelectorAll<HTMLElement>('payerpath-ec-table-header.th--text');
    // colIndex=0 is the checkbox col (no resize), data cols start at index 1
    const headerEl = headers[colIndex - 1];
    if (!headerEl) return;
    const startWidth = headerEl.getBoundingClientRect().width;
    this._resizeDrag = { colIndex, startX: event.clientX, startWidth };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (e: MouseEvent) => {
      if (!this._resizeDrag) return;
      const { colIndex: ci, startX, startWidth: sw } = this._resizeDrag;
      const min = COLUMNS[ci]?.minWidth ?? 80;
      this._colWidthsPx.update(m => {
        const next = new Map(m);
        next.set(ci, Math.max(min, sw + (e.clientX - startX)));
        return next;
      });
    };

    const onUp = () => {
      this._resizeDrag = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  protected resetColumnWidth(colIndex: number): void {
    this._colWidthsPx.update(m => {
      if (!m.has(colIndex)) return m;
      const next = new Map(m);
      next.delete(colIndex);
      return next;
    });
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  _onKeyActivate(e: KeyboardEvent): void {
    e.preventDefault();
  }
}
