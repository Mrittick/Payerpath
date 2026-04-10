/* Figma: Accordion (4089:42266)
   VERTICAL auto-layout · no padding · gap/md between header and entries
   Entries frame: paddingLeft gap/4xl · itemSpacing gap/1xs
   Open/close: SMART_ANIMATE 450ms cubic-bezier(0.5, 0, 0, 1) */

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { AccordionHeaderComponent } from './accordion-dependencies/accordion-header/accordion-header.component';
import { AccordionEntryComponent } from './accordion-dependencies/accordion-entry/accordion-entry.component';
import type { AccordionHeaderFlavour, AccordionHeaderHierarchy } from './accordion-dependencies/accordion-header/accordion-header.types';
import type { AccordionMode, AccordionEntryEditMode, AccordionEntrySelection } from './accordion.types';
import type { AccordionHeaderCheckboxState } from './accordion-dependencies/accordion-header/accordion-header.types';
import { ACCORDION_GROUP } from './accordion-group.token';

@Component({
  selector: 'merces-accordion',
  standalone: true,
  imports: [AccordionHeaderComponent, AccordionEntryComponent],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.accordion--open]': 'isOpen()',
  },
})
export class AccordionComponent {
  /* ── Inputs ── */
  readonly label     = input<string>('Accordion Header');
  readonly flavour   = input<AccordionHeaderFlavour>('brand');
  readonly hierarchy = input<AccordionHeaderHierarchy>('base');
  readonly mode      = input<AccordionMode>('read-only');
  readonly entries   = input<string[]>([]);

  /* ── Two-way open state ── */
  readonly isOpen = model<boolean>(false);

  /* ── Outputs ── */
  readonly entryClicked    = output<number>();
  readonly entryEdited     = output<number>();
  readonly entryRemoved    = output<number>();
  readonly selectionChange = output<Set<number>>();

  /* ── Batch-edit selection state ── */
  private readonly _selectedIndices = signal(new Set<number>());

  readonly entryEditMode = computed<AccordionEntryEditMode>(() => {
    if (this.mode() === 'editable')    return 'rename';
    if (this.mode() === 'delete-only') return 'delete';
    if (this.mode() === 'read-write')  return 'rename-delete';
    if (this.mode() === 'batch-edit')  return 'batch-edit';
    return 'na';
  });

  readonly entrySelections = computed<AccordionEntrySelection[]>(() => {
    if (this.mode() !== 'batch-edit') return [];
    const sel = this._selectedIndices();
    return this.entries().map((_, i) => sel.has(i) ? 'checked' : 'na');
  });

  readonly headerCheckboxState = computed<AccordionHeaderCheckboxState>(() => {
    const sel = this._selectedIndices();
    const total = this.entries().length;
    if (sel.size === 0)     return 'unchecked';
    if (sel.size === total) return 'checked';
    return 'mixed';
  });

  /* ── Optional group coordination ── */
  private readonly _group = inject(ACCORDION_GROUP, { optional: true });

  constructor() {
    if (this._group) {
      this._group.register(this.isOpen);
      inject(DestroyRef).onDestroy(() => this._group!.unregister(this.isOpen));
    }
  }

  toggle(): void {
    if (this._group) {
      this._group.requestOpen(this.isOpen);
    } else {
      this.isOpen.set(!this.isOpen());
    }
  }

  onEntryRowClick(index: number): void {
    if (this.mode() === 'batch-edit') {
      this._toggleSelection(index);
    } else {
      this.entryClicked.emit(index);
    }
  }

  onHeaderCheckboxChange(): void {
    const next = this.headerCheckboxState() === 'checked'
      ? new Set<number>()
      : new Set(this.entries().map((_, i) => i));
    this._selectedIndices.set(next);
    this.selectionChange.emit(next);
  }

  onEntryEdit(index: number): void   { this.entryEdited.emit(index); }
  onEntryRemove(index: number): void { this.entryRemoved.emit(index); }

  onEntrySelectionChange(index: number): void { this._toggleSelection(index); }

  private _toggleSelection(index: number): void {
    const next = new Set(this._selectedIndices());
    if (next.has(index)) { next.delete(index); } else { next.add(index); }
    this._selectedIndices.set(next);
    this.selectionChange.emit(next);
  }
}
