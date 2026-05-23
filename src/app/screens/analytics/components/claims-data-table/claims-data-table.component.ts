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

  // ── CSS Grid template — 58px sticky-left + 11 proportional columns ─────────
  protected readonly gridTemplate = computed(() =>
    `var(--_cdt-sticky-left-w) ` +
    this.COLUMNS.map(c => `minmax(${c.minWidth}px, ${c.minWidth}fr)`).join(' ')
  );

  // ── Sub-table grid template — 7 fill columns + 48px sticky-right ─────────
  protected readonly svcGridTemplate = computed(() =>
    this.SVC_COLS.map(c => `minmax(${c.minWidth}px, 1fr)`).join(' ') +
    ` var(--_cdt-sticky-right-w)`
  );

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
  private readonly _statusMap   = signal(new Map<string, string>());

  protected readonly openOptionsId  = signal<string | null>(null);

  /* Panel fixed-position state — calculated on click, bound via [style.*] in template.
     position:fixed escapes all overflow:hidden ancestors (including .cdt-exp-grid). */
  protected readonly panelTop    = signal<number | null>(null);
  protected readonly panelBottom = signal<number | null>(null);
  protected readonly panelRight  = signal<number>(0);

  private readonly _el = inject(ElementRef);

  protected isExpanded(rowId: string): boolean {
    return this._expandedIds().has(rowId);
  }

  protected toggleRow(rowId: string): void {
    const s = new Set(this._expandedIds());
    s.has(rowId) ? s.delete(rowId) : s.add(rowId);
    this._expandedIds.set(s);
  }

  protected getStatus(rowId: string): string {
    return this._statusMap().get(rowId) ?? 'Denied';
  }

  protected setStatus(rowId: string, status: string): void {
    const m = new Map(this._statusMap());
    m.set(rowId, status);
    this._statusMap.set(m);
  }

  protected openOptions(svcId: string, event: MouseEvent): void {
    event.stopPropagation();
    if (this.openOptionsId() === svcId) {
      this.openOptionsId.set(null);
      return;
    }
    const el    = event.currentTarget as HTMLElement;
    const rect  = el.getBoundingClientRect();
    const GAP   = 8; /* --gap-md */
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
    this.openOptionsId.set(svcId);
  }

  @HostListener('document:click')
  onDocClick(): void {
    if (this.openOptionsId() !== null) this.openOptionsId.set(null);
  }

  protected onEditDisplayColumns(): void {}
}
