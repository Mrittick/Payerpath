import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { DataTableColumn, DataTableRow } from './data-table.types';
import { TableHeaderComponent } from '../table-header/table-header.component';
import { TableRowComponent } from '../table-row/table-row.component';
import { TableEntryComponent } from '../table-entry/table-entry.component';
import { TableNoDataComponent } from '../table-no-data/table-no-data.component';
import { OverlayScrollComponent } from '../../overlay-scroll/overlay-scroll.component';

@Component({
  selector: 'merces-data-table',
  standalone: true,
  imports: [TableHeaderComponent, TableRowComponent, TableEntryComponent, TableNoDataComponent, OverlayScrollComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {

  // ── Inputs ────────────────────────────────────────────────────────────────
  columns       = input<DataTableColumn[]>([]);
  rows          = input<DataTableRow[]>([]);
  rowHeight     = input<number | undefined>(undefined);
  size          = input<'base' | 'mini'>('mini');
  showSelection = input<boolean>(true);
  /** Optional default sort applied on first render.
   *  Pass { key: columnKey, direction: 'ascending' | 'descending' }. */
  defaultSort   = input<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

  // ── Outputs ───────────────────────────────────────────────────────────────
  selectionChange = output<DataTableRow[]>();
  /** Emitted whenever the sort column or direction changes.
   *  key is null when sorting is cleared. */
  sortChange = output<{ key: string | null; direction: 'ascending' | 'descending' | 'none' }>();

  // ── DOM access ────────────────────────────────────────────────────────────
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);

  // ── Internal state ────────────────────────────────────────────────────────
  private readonly _deletedRows       = signal<Set<DataTableRow>>(new Set());
  private readonly _leavingRows       = signal<Set<DataTableRow>>(new Set());
  protected readonly _leavingRowHeight  = signal<number>(0);
  private readonly _sel               = signal<Set<DataTableRow>>(new Set());
  protected readonly _sortColKey   = signal<string | null>(null);
  protected readonly _sortDir      = signal<'ascending' | 'descending'>('ascending');

  constructor() {
    // Apply defaultSort once on first render, before any user interaction.
    effect(() => {
      const ds = this.defaultSort();
      if (ds && this._sortColKey() === null) {
        this._sortColKey.set(ds.key);
        this._sortDir.set(ds.direction);
      }
    });
  }

  // ── Grid layout ───────────────────────────────────────────────────────────
  readonly gridTemplate = computed(() => {
    const selCol = this.showSelection() ? 'min-content ' : '';
    return selCol + this.columns().map(c => `minmax(${c.minWidth ?? 100}px, ${c.width}fr)`).join(' ');
  });

  // ── Derived ───────────────────────────────────────────────────────────────
  private readonly _activeRows = computed(() =>
    this.rows().filter(r => !this._deletedRows().has(r))
  );

  readonly sortedRows = computed(() => {
    const rows = this._activeRows();
    const key  = this._sortColKey();
    const dir  = this._sortDir();
    if (!key) return rows;
    return [...rows].sort((a, b) => {
      const av = a[key] ?? '', bv = b[key] ?? '';
      const an = Number(av.replace(/[,$]/g, ''));
      const bn = Number(bv.replace(/[,$]/g, ''));
      const cmp = !isNaN(an) && !isNaN(bn) ? an - bn : av.localeCompare(bv);
      return dir === 'ascending' ? cmp : -cmp;
    });
  });

  // Public — accessible via template reference (#tableRef)
  readonly anySelected = computed(() =>
    this._activeRows().some(r => this._sel().has(r))
  );

  readonly headerSel = computed<'none' | 'all' | 'mixed'>(() => {
    const active   = this._activeRows();
    const sel      = this._sel();
    const selected = active.filter(r => sel.has(r)).length;
    if (selected === 0 || active.length === 0) return 'none';
    if (selected === active.length) return 'all';
    return 'mixed';
  });

  readonly leavingRows = computed(() => this._leavingRows());

  private readonly _willBeEmpty = computed(() => {
    const leaving = this._leavingRows();
    if (leaving.size === 0) return false;
    return this._activeRows().every(r => leaving.has(r));
  });

  readonly isEmpty = computed(() =>
    this._activeRows().length === 0 || this._willBeEmpty()
  );

  // ── Public methods ────────────────────────────────────────────────────────
  toggleRow(row: DataTableRow): void {
    this._sel.update(s => {
      const n = new Set(s);
      n.has(row) ? n.delete(row) : n.add(row);
      return n;
    });
    this.selectionChange.emit(this._activeRows().filter(r => this._sel().has(r)));
  }

  toggleAll(selectAll: boolean): void {
    this._sel.set(selectAll ? new Set(this._activeRows()) : new Set());
    this.selectionChange.emit(this._activeRows().filter(r => this._sel().has(r)));
  }

  handleSort(key: string, next: 'none' | 'ascending' | 'descending'): void {
    if (next === 'none') { this._sortColKey.set(null); }
    else { this._sortColKey.set(key); this._sortDir.set(next); }
    this.sortChange.emit({ key: next === 'none' ? null : key, direction: next });
  }

  deleteSelected(): void {
    const sel = new Set([...this._sel()].filter(r => this._activeRows().includes(r)));
    if (sel.size === 0) return;

    // Measure actual rendered row height before marking rows as leaving.
    // All rows are homogenous so any wrapper gives the right value.
    const wrapper = this._el.nativeElement.querySelector<HTMLElement>('.row-wrapper');
    const measuredHeight = wrapper?.getBoundingClientRect().height ?? 0;

    // Pin the measured height so the CSS transition has a concrete "from" value
    // (height: auto cannot transition). Both signals update before CD runs,
    // so the leaving rows render at measuredHeight first.
    this._leavingRowHeight.set(measuredHeight);
    this._leavingRows.set(sel);

    // Next paint: collapse to 0 — transition fires
    requestAnimationFrame(() => this._leavingRowHeight.set(0));

    setTimeout(() => {
      this._deletedRows.update(d => { const n = new Set(d); sel.forEach(r => n.add(r)); return n; });
      this._sel.update(s => { const n = new Set(s); sel.forEach(r => n.delete(r)); return n; });
      this._leavingRows.set(new Set());
      this.selectionChange.emit([]);
    }, 240);
  }

  reset(): void {
    this._deletedRows.set(new Set());
    this._sel.set(new Set());
    this._leavingRows.set(new Set());
    this._sortColKey.set(null);
    this.selectionChange.emit([]);
  }

  isRowSelected(row: DataTableRow): boolean {
    return this._sel().has(row);
  }

  isRowLeaving(row: DataTableRow): boolean {
    return this._leavingRows().has(row);
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  _onKeyActivate(e: KeyboardEvent): void {
    // Row-level keyboard handling is on the table-row host via template bindings
    e.preventDefault();
  }
}
