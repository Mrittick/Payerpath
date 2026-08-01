import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  signal,
  computed,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NavButtonComponent } from '../nav-button/nav-button.component';
import { PagerButtonComponent } from '../pager-button/pager-button.component';
import { ItemsPerPageComponent } from '../items-per-page/items-per-page.component';
import { JumperComponent } from '../jumper/jumper.component';
import { StringfieldPlainComponent } from '../../../data-entry/stringfield-plain/stringfield-plain.component';
import { IconComponent } from '../../../../assets/icon/icon.component';

export type PagesVariant = 'default' | 'long' | 'hybrid';

export interface JumperSlot { jumper: true; from: number; to: number; }
export type PageSlot = number | JumperSlot;

export function buildPageSlots(page: number, total: number): PageSlot[] {
  if (total <= 0) return [];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (page <= 4)           return [1, 2, 3, 4, 5, { jumper: true, from: 6,       to: total - 1 }, total];
  if (page >= total - 3)   return [1, { jumper: true, from: 2, to: total - 5 }, total - 4, total - 3, total - 2, total - 1, total];
  return [1, { jumper: true, from: 2, to: page - 2 }, page - 1, page, page + 1, { jumper: true, from: page + 2, to: total - 1 }, total];
}

@Component({
  selector: 'merces-paginator',
  standalone: true,
  imports: [NavButtonComponent, PagerButtonComponent, ItemsPerPageComponent, JumperComponent, StringfieldPlainComponent, IconComponent, DecimalPipe],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.paginator--hybrid]': 'pagesVariant() === "hybrid"',
  },
})
export class PaginatorComponent {
  readonly totalItems       = input.required<number>();
  readonly page             = model<number>(1);
  readonly pageSize         = model<number>(10);
  readonly pageSizeOptions  = input<number[]>([10, 25, 50, 100]);
  readonly showPages        = input<boolean>(true);
  readonly showItemsPerPage = input<boolean>(true);
  readonly pagesVariant     = input<PagesVariant>('default');

  readonly longInput = signal('');

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.pageSize()))
  );

  readonly startItem = computed(() =>
    this.totalItems() === 0 ? 0 : (this.page() - 1) * this.pageSize() + 1
  );

  readonly endItem = computed(() =>
    Math.min(this.page() * this.pageSize(), this.totalItems())
  );

  readonly pageSlots = computed(() =>
    buildPageSlots(this.page(), this.totalPages())
  );

  prevPage(): void { this.page.update(p => p - 1); }
  nextPage(): void { this.page.update(p => p + 1); }

  jumpToPage(): void {
    const p = parseInt(this.longInput(), 10);
    if (!isNaN(p)) {
      this.page.set(Math.max(1, Math.min(p, this.totalPages())));
      this.longInput.set('');
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
  }

  isJumperSlot(slot: PageSlot): slot is JumperSlot { return typeof slot === 'object'; }
  asNumber(slot: PageSlot): number { return slot as number; }
  asJumper(slot: PageSlot): JumperSlot { return slot as JumperSlot; }
  slotKey(slot: PageSlot): string { return typeof slot === 'object' ? `j${slot.from}` : `${slot}`; }
}
