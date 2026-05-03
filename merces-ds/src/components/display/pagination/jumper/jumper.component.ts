import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DropdownItemComponent } from '../../../inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-item/dropdown-item.component';

@Component({
  selector: 'merces-jumper',
  standalone: true,
  imports: [DropdownItemComponent, DecimalPipe],
  templateUrl: './jumper.component.html',
  styleUrl: './jumper.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.jumper--open]':   '_open()',
    '[attr.role]':            '"button"',
    '[attr.tabindex]':        '"0"',
    '[attr.aria-label]':      '"Jump to page"',
    '[attr.aria-expanded]':   '_open()',
    '[attr.aria-haspopup]':   '"listbox"',
  },
})
export class JumperComponent implements OnDestroy {
  readonly from    = input.required<number>();
  readonly to      = input.required<number>();
  readonly pressed = output<number>();

  /** Logical open state — drives the CSS transition class. */
  readonly _open     = signal(false);
  /** DOM gate — panel stays mounted during the exit transition. */
  readonly _rendered = signal(false);

  readonly pageCount = computed(() =>
    this.from() <= this.to() ? this.to() - this.from() + 1 : 0
  );

  _panelPos = signal<{ bottom: number; left: number; maxHeight: number } | null>(null);
  _scrollTop = signal(0);
  _itemHeight = signal(0);
  _panelPaddingY = signal(0);

  readonly _visibleWindow = computed(() => {
    const total = this.pageCount();
    const pos = this._panelPos();
    const itemHeight = this._itemHeight();
    const paddingY = this._panelPaddingY();

    if (total <= 0 || itemHeight <= 0) {
      return { topSpacer: 0, bottomSpacer: 0, pages: [] as number[] };
    }

    const scrollTop = Math.max(0, this._scrollTop() - paddingY);
    const firstVisibleIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = pos ? Math.ceil(pos.maxHeight / itemHeight) : 0;
    const overscan = 4;
    const startIndex = Math.max(0, firstVisibleIndex - overscan);
    const endIndex = Math.min(total, firstVisibleIndex + visibleCount + overscan);

    return {
      topSpacer: paddingY + startIndex * itemHeight,
      bottomSpacer: paddingY + (total - endIndex) * itemHeight,
      pages: Array.from(
        { length: endIndex - startIndex },
        (_, i) => this.from() + startIndex + i
      ),
    };
  });

  private readonly _el = inject(ElementRef);
  private _docListener: (() => void) | null = null;
  private _closeTimer: ReturnType<typeof setTimeout> | null = null;
  private _openRafId: number | null = null;

  private _openPanel(): void {
    // Cancel any in-progress close so re-opening is instant.
    if (this._closeTimer !== null) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
    const gapMd = this._readPxToken('--gap-md');
    const gap3xBig = this._readPxToken('--gap-3xbig');
    const gap4xHuge = this._readPxToken('--gap-4xhuge');

    this._itemHeight.set(gap3xBig);
    this._panelPaddingY.set(gapMd);

    const rect: DOMRect = this._el.nativeElement.getBoundingClientRect();
    const availableHeight = rect.top - gapMd - gapMd;
    this._panelPos.set({
      bottom:    window.innerHeight - rect.top + gapMd,
      left:      rect.left + rect.width / 2 - gap3xBig,
      maxHeight: Math.max(gap3xBig, Math.min(gap4xHuge, availableHeight)),
    });
    this._scrollTop.set(0);
    // Mount panel first, then wait for one painted hidden frame so the
    // drop-up enter transition is visible even when the page range is large.
    this._rendered.set(true);
    this._openRafId = requestAnimationFrame(() => {
      this._openRafId = requestAnimationFrame(() => {
        this._openRafId = null;
        this._open.set(true);
      });
    });
    this._attachListeners();
  }

  private _closePanel(): void {
    // Cancel a pending open rAF so rapid open→close never leaves _open=true.
    if (this._openRafId !== null) {
      cancelAnimationFrame(this._openRafId);
      this._openRafId = null;
    }
    // Start CSS exit transition immediately.
    this._open.set(false);
    this._detachListeners();
    // Unmount from DOM after the transition completes (200ms).
    this._closeTimer = setTimeout(() => {
      this._rendered.set(false);
      this._panelPos.set(null);
      this._closeTimer = null;
    }, 200);
  }

  toggle(): void {
    this._open() ? this._closePanel() : this._openPanel();
  }

  select(page: number): void {
    this._closePanel();
    this.pressed.emit(page);
  }

  onPanelScroll(event: Event): void {
    this._scrollTop.set((event.target as HTMLElement).scrollTop);
  }

  private _readPxToken(name: string): number {
    const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(value) ? value : 0;
  }

  private _attachListeners(): void {
    const mouseHandler = (e: MouseEvent) => {
      if (!this._el.nativeElement.contains(e.target)) this._closePanel();
    };
    const scrollHandler = (e: Event) => {
      if (this._el.nativeElement.contains(e.target as Node)) return;
      this._closePanel();
    };
    document.addEventListener('mousedown', mouseHandler);
    window.addEventListener('scroll', scrollHandler, { capture: true });
    this._docListener = () => {
      document.removeEventListener('mousedown', mouseHandler);
      window.removeEventListener('scroll', scrollHandler, { capture: true });
    };
  }

  private _detachListeners(): void {
    this._docListener?.();
    this._docListener = null;
  }

  ngOnDestroy(): void {
    this._detachListeners();
    if (this._closeTimer !== null) clearTimeout(this._closeTimer);
    if (this._openRafId !== null) cancelAnimationFrame(this._openRafId);
  }

  @HostListener('click') onClick(): void { this.toggle(); }
  @HostListener('keydown.enter', ['$event']) onEnter(e: Event): void { e.preventDefault(); this.toggle(); }
  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void { e.preventDefault(); this.toggle(); }
  @HostListener('keydown.escape') onEscape(): void { this._closePanel(); }
}
