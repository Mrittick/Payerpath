/* Figma: Claims Data tab — X3ePdrL3EFGOKK6Gb6qbV7
   Main Table: node 1158-33915 — frozen header + sticky-left expand/collapse column
   Expanded Table: node 1158-33916 — sticky-right triple-dot column
   Entry Options overlay: node 9043-104376
   Service Status dropdown: node 5988-61612 */

import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  ElementRef,
  signal,
  computed,
  input,
} from '@angular/core';
import { IconComponent } from '@merces/assets/icon/icon.component';
import { CtaButtonComponent } from '@merces/components/inputs-and-interactive/cta-button/cta-button.component';
import { DropdownGroupComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-group/dropdown-group.component';
import { DropdownComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-standalone/dropdown.component';
import { DropdownItemComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-item/dropdown-item.component';
import { DropdownSeparatorComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-separator/dropdown-separator.component';
import { TableHeaderComponent } from '@merces/components/display/data-table/table-header/table-header.component';
import { TableRowComponent } from '@merces/components/display/data-table/table-row/table-row.component';
import { TableEntryComponent } from '@merces/components/display/data-table/table-entry/table-entry.component';
import { OverlayScrollComponent } from '@merces/components/display/overlay-scroll/overlay-scroll.component';
import type { ClaimsDataRow, ServiceRow } from './claims-data.types';

type SortDir   = 'ascending' | 'descending';
type SortOrder = 'none' | SortDir;

@Component({
  selector: 'payerpath-claims-data-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconComponent,
    CtaButtonComponent,
    DropdownGroupComponent,
    DropdownComponent,
    DropdownItemComponent,
    DropdownSeparatorComponent,
    TableHeaderComponent,
    TableRowComponent,
    TableEntryComponent,
    OverlayScrollComponent,
  ],
  templateUrl: './claims-data-table.component.html',
  styleUrl: './claims-data-table.component.css',
})
export class ClaimsDataTableComponent {
  readonly rows = input<ClaimsDataRow[]>([]);

  // ── Sub-table column definitions (matches ServiceRow field names) ──────────
  protected readonly SVC_COLS = [
    { key: 'claimCheckDate',       extra: 'Claim',   main: 'Check Date',     minWidth: 100 },
    { key: 'serviceDOS',           extra: 'Service', main: 'DOS',            minWidth: 120 },
    { key: 'serviceTotalBilled',   extra: 'Service', main: 'Total Billed',   minWidth: 120 },
    { key: 'serviceProcedureCode', extra: 'Service', main: 'Procedure Code', minWidth: 140 },
    { key: 'serviceTotalPaid',     extra: 'Service', main: 'Total Paid',     minWidth: 140 },
    { key: 'claimControlNumber',   extra: 'Claim',   main: 'Control Number', minWidth: 160 },
    { key: 'servicePayer',         extra: 'Service', main: 'Payer',          minWidth: 120 },
  ] as const;

  // ── Main column definitions ────────────────────────────────────────────────
  protected readonly COLUMNS = [
    { key: 'claimControlNumber',    label: 'Claim Control Number',    minWidth: 160 },
    { key: 'dateOfClaim',           label: 'Date of Claim',           minWidth: 120 },
    { key: 'renderingProviderName', label: 'Rendering Provider Name', minWidth: 180 },
    { key: 'billingProviderName',   label: 'Billing Provider Name',   minWidth: 180 },
    { key: 'checkDate',             label: 'Check Date',              minWidth: 120 },
    { key: 'claimStatus',           label: 'Claim Status',            minWidth: 160 },
    { key: 'processedAs',           label: 'Processed As',            minWidth: 120 },
    { key: 'totalBilled',           label: 'Total Billed',            minWidth: 120 },
    { key: 'totalPaid',             label: 'Total Paid',              minWidth: 120 },
    { key: 'totalPRDollars',        label: 'Total PR Dollars',        minWidth: 120 },
    { key: 'payer',                 label: 'Payer',                   minWidth: 160 },
  ] as const;

  // ── Column resize state — main table ─────────────────────────────────────
  /** Sparse map of column index → explicit px width. Only resized columns
   *  appear here; the rest stay on their fr-based auto-distribution. */
  private readonly _colWidthsPx = signal<Map<number, number>>(new Map());
  private _resizeDrag: { colIndex: number; startX: number; startWidth: number } | null = null;

  // ── Column resize state — sub-table ──────────────────────────────────────
  private readonly _svcColWidthsPx = signal<Map<number, number>>(new Map());
  private _svcResizeDrag: { colIndex: number; startX: number; startWidth: number } | null = null;

  // ── CSS Grid template — 58px sticky-left + 11 proportional columns + 56px sticky-right ──
  protected readonly gridTemplate = computed(() => {
    const left   = 'var(--_cdt-sticky-left-w)';
    const right  = 'var(--_cdt-sticky-right-w)';
    const widths = this._colWidthsPx();
    const cols   = this.COLUMNS;
    return left + ' ' + cols.map((c, i) => {
      const min      = c.minWidth;
      const explicit = widths.get(i);
      if (explicit !== undefined) {
        return `${Math.max(min, explicit)}px`;
      }
      // Unresized columns keep proportional fr distribution.
      return `minmax(${min}px, ${min}fr)`;
    }).join(' ') + ' ' + right;
  });

  // ── Sub-table grid template — 7 fill columns + 41px sticky-right ─────────
  protected readonly svcGridTemplate = computed(() => {
    const right  = 'var(--_cdt-sticky-right-exp-w)';
    const widths = this._svcColWidthsPx();
    const cols   = this.SVC_COLS;
    return cols.map((c, i) => {
      const min      = c.minWidth;
      const explicit = widths.get(i);
      if (explicit !== undefined) {
        return `${Math.max(min, explicit)}px`;
      }
      // Proportional fr — matches the main table's distribution so columns keep
      // natural ratios. Unresized columns continue to auto-distribute even when
      // sibling columns are locked to px widths.
      return `minmax(${min}px, ${min}fr)`;
    }).join(' ') + ' ' + right;
  });

  // ── Main table sort state ──────────────────────────────────────────────────
  protected readonly sortKey = signal<string | null>(null);
  protected readonly sortDir = signal<SortDir>('ascending');

  // ── Service sub-table sort state (shared across all expanded rows) ─────────
  protected readonly svcSortKey = signal<string | null>(null);
  protected readonly svcSortDir = signal<SortDir>('ascending');

  protected readonly sortedRows = computed(() => {
    const rows = this.rows();
    const key  = this.sortKey();
    const dir  = this.sortDir();
    if (!key) return rows;
    return [...rows].sort((a, b) => {
      const av = (a as unknown as Record<string, string>)[key] ?? '';
      const bv = (b as unknown as Record<string, string>)[key] ?? '';
      const cmp = av.localeCompare(bv);
      return dir === 'ascending' ? cmp : -cmp;
    });
  });

  protected sortOrderFor(key: string): SortOrder {
    return this.sortKey() === key ? this.sortDir() : 'none';
  }

  protected onSortChange(key: string, order: SortOrder): void {
    if (order === 'none') {
      this.sortKey.set(null);
    } else {
      this.sortKey.set(key);
      this.sortDir.set(order);
    }
  }

  protected svcSortOrderFor(key: string): SortOrder {
    return this.svcSortKey() === key ? this.svcSortDir() : 'none';
  }

  protected onSvcSortChange(key: string, order: SortOrder): void {
    if (order === 'none') {
      this.svcSortKey.set(null);
    } else {
      this.svcSortKey.set(key);
      this.svcSortDir.set(order);
    }
  }

  protected sortedServices(row: ClaimsDataRow): ServiceRow[] {
    const key = this.svcSortKey();
    const dir = this.svcSortDir();
    if (!key) return row.services;
    return [...row.services].sort((a, b) => {
      const av = (a as unknown as Record<string, string>)[key] ?? '';
      const bv = (b as unknown as Record<string, string>)[key] ?? '';
      const cmp = av.startsWith('$')
        ? parseFloat(av.replace(/[$,]/g, '')) - parseFloat(bv.replace(/[$,]/g, ''))
        : av.localeCompare(bv);
      return dir === 'ascending' ? cmp : -cmp;
    });
  }

  // ── Expand / collapse state ────────────────────────────────────────────────
  private readonly _expandedIds = signal(new Set<string>());
  /** Rows whose sub-table scroll container is mounted in the DOM.
   *  Diverges from _expandedIds on close: we keep the DOM alive for the
   *  300ms collapse animation so the content collapses with the panel
   *  instead of vanishing instantly, then unmount.
   *  Critical: avoids the "wide collapsed sub-grid breaks layout" bug — when
   *  a resize sets a wide _svcColWidthsPx, collapsed rows without their
   *  merces-overlay-scroll have nothing to leak into the visible area. */
  private readonly _mountedSubIds = signal(new Set<string>());
  private readonly _statusMap   = signal(new Map<string, string>());

  protected readonly openOptionsId     = signal<string | null>(null); /* svc-row panel */
  protected readonly openMainOptionsId = signal<string | null>(null); /* main-row panel */

  /* Panel fixed-position state — shared; only one panel open at a time.
     Calculated on click, bound via [style.*] in template.
     position:fixed escapes all overflow:hidden ancestors. */
  protected readonly panelTop    = signal<number | null>(null);
  protected readonly panelBottom = signal<number | null>(null);
  protected readonly panelRight  = signal<number>(0);

  private readonly _el = inject(ElementRef);

  protected isExpanded(rowId: string): boolean {
    return this._expandedIds().has(rowId);
  }

  protected isSubMounted(rowId: string): boolean {
    return this._mountedSubIds().has(rowId);
  }

  protected toggleRow(rowId: string): void {
    const isOpen = this._expandedIds().has(rowId);
    if (isOpen) {
      // Collapsing — flip expansion class immediately so the CSS height
      // transition fires; keep the DOM mounted so the content collapses
      // with the animation, then unmount after the 300ms transition.
      this._expandedIds.update(s => { const n = new Set(s); n.delete(rowId); return n; });
      setTimeout(() => {
        // Guard against rapid re-open within the animation window.
        if (!this._expandedIds().has(rowId)) {
          this._mountedSubIds.update(m => { const n = new Set(m); n.delete(rowId); return n; });
        }
      }, 300);
    } else {
      // Opening — mount + expand in the same tick so the panel animates open
      // with content already in place.
      this._mountedSubIds.update(m => { const n = new Set(m); n.add(rowId); return n; });
      this._expandedIds.update(s => { const n = new Set(s); n.add(rowId); return n; });
    }
  }

  protected getStatus(rowId: string): string {
    return this._statusMap().get(rowId) ?? 'Denied';
  }

  protected setStatus(rowId: string, status: string): void {
    const m = new Map(this._statusMap());
    m.set(rowId, status);
    this._statusMap.set(m);
  }

  private _positionPanel(event: MouseEvent): void {
    const el      = event.currentTarget as HTMLElement;
    const rect    = el.getBoundingClientRect();
    const GAP     = 8; /* --gap-md */
    /* Flip upward when < 112px of viewport below trigger (96px panel + 8px gap + 8px buffer) */
    const flipped = window.innerHeight - rect.bottom < 112;
    this.panelRight.set(window.innerWidth - rect.right);
    if (flipped) {
      this.panelTop.set(null);
      this.panelBottom.set(window.innerHeight - rect.top + GAP);
    } else {
      this.panelBottom.set(null);
      this.panelTop.set(rect.bottom + GAP);
    }
  }

  protected openOptions(svcId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openMainOptionsId.set(null);
    if (this.openOptionsId() === svcId) { this.openOptionsId.set(null); return; }
    this._positionPanel(event);
    this.openOptionsId.set(svcId);
  }

  protected openMainOptions(rowId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openOptionsId.set(null);
    if (this.openMainOptionsId() === rowId) { this.openMainOptionsId.set(null); return; }
    this._positionPanel(event);
    this.openMainOptionsId.set(rowId);
  }

  @HostListener('document:click')
  onDocClick(): void {
    if (this.openOptionsId()     !== null) this.openOptionsId.set(null);
    if (this.openMainOptionsId() !== null) this.openMainOptionsId.set(null);
  }

  protected onEditDisplayColumns(): void {}

  // ── Column resize ─────────────────────────────────────────────────────────

  /** Returns a column to its fr-based auto-distribution by removing its
   *  explicit width from the sparse map. */
  protected resetColumnWidth(colIndex: number): void {
    this._colWidthsPx.update(m => {
      if (!m.has(colIndex)) return m;
      const next = new Map(m);
      next.delete(colIndex);
      return next;
    });
  }

  protected startResize(colIndex: number, event: MouseEvent): void {
    // Read the column's currently rendered width as the drag's starting point —
    // works whether the column is currently fr-distributed or already locked to px.
    const root = this._el.nativeElement as HTMLElement;
    const header = root
      .querySelectorAll<HTMLElement>('.cdt-header-row merces-table-header.th--string')[colIndex];
    if (!header) return;
    const startWidth = header.getBoundingClientRect().width;
    this._resizeDrag = { colIndex, startX: event.clientX, startWidth };

    document.body.style.cursor     = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (e: MouseEvent) => {
      if (!this._resizeDrag) return;
      const { colIndex: ci, startX, startWidth: sw } = this._resizeDrag;
      const min = this.COLUMNS[ci].minWidth;
      const w   = Math.max(min, sw + (e.clientX - startX));
      this._colWidthsPx.update(m => {
        const next = new Map(m);
        next.set(ci, w);
        return next;
      });
    };

    const onUp = () => {
      this._resizeDrag = null;
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  }

  // ── Sub-table column resize ───────────────────────────────────────────────

  protected resetSvcColumnWidth(colIndex: number): void {
    this._svcColWidthsPx.update(m => {
      if (!m.has(colIndex)) return m;
      const next = new Map(m);
      next.delete(colIndex);
      return next;
    });
  }

  protected startSvcResize(colIndex: number, event: MouseEvent): void {
    const root = this._el.nativeElement as HTMLElement;
    // Read this column's rendered width from any currently-open sub-table.
    // (All sub-tables share svcGridTemplate, so any open one is correct.)
    const header = Array.from(
      root.querySelectorAll<HTMLElement>('.cdt-exp-animated--open .cdt-exp-hrow merces-table-header.th--string')
    ).slice(0, this.SVC_COLS.length)[colIndex];
    if (!header) return;
    const startWidth = header.getBoundingClientRect().width;
    this._svcResizeDrag = { colIndex, startX: event.clientX, startWidth };

    document.body.style.cursor     = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (e: MouseEvent) => {
      if (!this._svcResizeDrag) return;
      const { colIndex: ci, startX, startWidth: sw } = this._svcResizeDrag;
      const min = this.SVC_COLS[ci].minWidth;
      const w   = Math.max(min, sw + (e.clientX - startX));
      this._svcColWidthsPx.update(m => {
        const next = new Map(m);
        next.set(ci, w);
        return next;
      });
    };

    const onUp = () => {
      this._svcResizeDrag = null;
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  }
}
