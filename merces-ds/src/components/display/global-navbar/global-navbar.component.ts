/* Figma: Global Navbar — 967:3420
   Payerpath expanded: 264px | Collapsed: 24px
   eChart Coder expanded: 320px | Collapsed: 28px
   Product theming via [data-theme] propagates CSS token mode to all children. */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  ECHART_CODER_CATEGORIES,
  NAVBAR_CATEGORIES,
  NavbarCategoryDef,
  NavbarCategoryId,
  NavbarPage,
  NavbarProduct,
} from './global-navbar.types';
import { NavbarItemComponent } from './navbar-dependencies/navbar-item/navbar-item.component';
import { ToggleLargeComponent } from './navbar-dependencies/toggle-large/toggle-large.component';
import { ToggleSmallComponent } from './navbar-dependencies/toggle-small/toggle-small.component';
import { UacComponent } from '../uac/uac.component';
import type { UserRole } from '../uac/uac.types';
import { BrandingComponent } from '../branding/branding.component';
import { OverlayScrollComponent } from '../overlay-scroll/overlay-scroll.component';

/** Internal resolved shape: a category merged with its matching registered pages. */
interface NavbarGroupedItem extends NavbarCategoryDef {
  pages: NavbarPage[];
  hasCurrentPage: boolean;
}

@Component({
  selector: 'merces-global-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavbarItemComponent, ToggleLargeComponent, ToggleSmallComponent, UacComponent, BrandingComponent, OverlayScrollComponent],
  templateUrl: './global-navbar.component.html',
  styleUrl: './global-navbar.component.css',
  host: {
    /** Propagates the correct CSS token mode to every descendant. */
    '[attr.data-theme]': 'product() === "echart-coder" ? "echart-coder" : null',
    '[class.global-navbar--collapsed]': 'collapsed()',
  },
})
export class GlobalNavbarComponent {

  /* ── Inputs ── */
  readonly product  = input<NavbarProduct>('payerpath');
  /**
   * All pages registered for this navbar. The component automatically
   * groups them under the correct category — no template changes needed
   * when pages are added or removed.
   */
  readonly navPages = input<NavbarPage[]>([]);
  /**
   * ID of the currently active page or standalone category.
   * Drives `hasCurrentPage` for standalone categories (e.g. Dashboard)
   * which have no registered sub-pages.
   */
  readonly currentPageId = input<string>('');
  /**
   * Two-way bindable collapsed state.
   * Parent usage: <merces-global-navbar [(collapsed)]="isCollapsed" />
   */
  readonly collapsed = model<boolean>(false);

  /* ── UAC inputs (eChart Coder only — UAC lives inside the navbar) ── */
  readonly uacUserName   = input<string>('');
  readonly uacUserRole   = input<UserRole | undefined>(undefined);
  readonly uacUserAvatar = input<string | undefined>(undefined);

  /* ── Output ── */
  /** Emits the id of the selected page when a sub-item is clicked. */
  readonly pageSelected = output<string>();

  /* ── Internal state ── */
  /** Set of category IDs whose sub-item lists are currently visible. */
  protected readonly _expandedCategories = signal(new Set<NavbarCategoryId>());

  constructor() {
    // Auto-expand any category whose sub-item becomes current (deep-link, back/forward, initial load).
    // Does not collapse other categories — manual expansions are preserved.
    effect(() => {
      const active = this._groupedItems()
        .filter(c => c.pages.length > 0 && c.hasCurrentPage)
        .map(c => c.id);
      if (active.length === 0) return;
      this._expandedCategories.update(prev => {
        const next = new Set(prev);
        active.forEach(id => next.add(id));
        return next;
      });
    });
  }

  /* ── Computed ── */
  /** Selects the correct category set for the current product. */
  protected readonly _activeCategories = computed<readonly NavbarCategoryDef[]>(() =>
    this.product() === 'echart-coder' ? ECHART_CODER_CATEGORIES : NAVBAR_CATEGORIES
  );

  /** Merges the active category set with their dynamically registered pages. */
  protected readonly _groupedItems = computed<NavbarGroupedItem[]>(() => {
    const pageMap = new Map<NavbarCategoryId, NavbarPage[]>();
    for (const page of this.navPages()) {
      const existing = pageMap.get(page.categoryId) ?? [];
      pageMap.set(page.categoryId, [...existing, page]);
    }
    const currentId = this.currentPageId();
    return this._activeCategories().map(cat => {
      const pages = pageMap.get(cat.id) ?? [];
      const hasCurrentPage = pages.length === 0
        ? currentId === cat.id                  // standalone: match by category ID
        : pages.some(p => p.isCurrent);         // with sub-items: match via navPages isCurrent
      return { ...cat, pages, hasCurrentPage };
    });
  });

  /* ── Template helpers ── */
  protected _getIconType(cat: NavbarGroupedItem): 'regular' | 'filled' {
    const isStandalone = cat.pages.length === 0;
    if (isStandalone) {
      // Standalone category (e.g. Dashboard): filled only when it is the current page
      return cat.hasCurrentPage ? 'filled' : 'regular';
    }
    // Category with sub-items: filled whenever it contains the current page, regardless of expanded/collapsed
    return cat.hasCurrentPage ? 'filled' : 'regular';
  }

  protected _getCategoryType(cat: NavbarGroupedItem): 'standalone' | 'collapsed' | 'expanded' {
    if (cat.pages.length === 0) return 'standalone';
    return this._expandedCategories().has(cat.id) ? 'expanded' : 'collapsed';
  }

  protected _isExpanded(id: NavbarCategoryId): boolean {
    return this._expandedCategories().has(id);
  }

  /* ── Event handlers ── */
  protected _onCategoryClick(id: NavbarCategoryId): void {
    const cat = this._groupedItems().find(c => c.id === id)!;
    if (cat.pages.length === 0) {
      // Standalone category — treat as a direct page navigation
      this.pageSelected.emit(id);
      return;
    }
    const current = new Set(this._expandedCategories());
    current.has(id) ? current.delete(id) : current.add(id);
    this._expandedCategories.set(current);
  }

  protected _onPageClick(pageId: string, categoryId: NavbarCategoryId): void {
    // Emit compound 'categoryId/pageId' so consumers can navigate to the correct
    // URL even when the same page ID appears under multiple categories.
    this.pageSelected.emit(`${categoryId}/${pageId}`);
  }

  protected _onToggle(): void {
    this.collapsed.set(!this.collapsed());
  }
}
