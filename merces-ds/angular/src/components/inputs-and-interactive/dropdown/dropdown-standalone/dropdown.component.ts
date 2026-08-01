import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  HostBinding,
  HostListener,
  ElementRef,
  OnDestroy,
  inject,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';
import type { DropdownState, DropdownMode } from './dropdown.types';

@Component({
  selector: 'merces-dropdown',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]':          '!panelOnly() ? "combobox" : null',
    '[class.dropdown--unselected]':   'unselected()',
    '[class.dropdown--selected]':     '!unselected()',
    '[class.dropdown--disabled]':     'isDisabled()',
    '[class.dropdown--open]':         'open()',
    '[class.dropdown--panel-only]':   'panelOnly()',
    '[class.dropdown--open-above]':   'openAbove() || _computedOpenAbove()',
    '[class.dropdown--align-right]':  'panelAlign() === "right"',
    '[attr.aria-expanded]': '!panelOnly() ? open() : null',
    '[attr.aria-haspopup]': '!panelOnly() ? "listbox" : null',
    '[attr.aria-disabled]': '!panelOnly() && isDisabled() ? "true" : null',
  },
})
export class DropdownComponent implements OnDestroy {
  private readonly _el = inject(ElementRef);

  /* ── Inputs ── */
  readonly mode         = input<DropdownMode>('single-select');
  readonly unselected   = input<boolean>(true);
  readonly state        = input<DropdownState>('default');
  readonly placeholder  = input<string>('Select');
  readonly selectionText = input<string>('Selection');

  /** Hides the built-in trigger button. Host becomes position:absolute inset:0 so
   *  the parent component acts as the trigger and this component owns only the panel. */
  readonly panelOnly  = input<boolean>(false);
  /** Open the panel above the host instead of below (panel-only mode). */
  readonly openAbove  = input<boolean>(false);
  /** Panel horizontal alignment in panel-only mode. */
  readonly panelAlign = input<'stretch' | 'right'>('stretch');

  /* ── Outputs ── */
  readonly opened = output<void>();
  readonly closed = output<void>();

  /* ── Internal state ── */
  readonly open = signal<boolean>(false);
  readonly isDisabled = computed(() => this.state() === 'disabled');

  /** Computed in _positionPanel() — true when the panel should open upward. */
  readonly _computedOpenAbove = signal(false);

  readonly displayText = computed(() =>
    this.unselected() ? this.placeholder() : this.selectionText()
  );

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;
  private _focusFromMouse = false;

  @HostBinding('class.dropdown--keyboard-focus')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

  /* ── Trigger interactions ── */

  onTriggerClick(): void {
    this._toggle();
  }

  @HostListener('keydown.escape') onEscape(): void {
    if (this.open()) {
      this.open.set(false);
      this.closed.emit();
    }
  }

  @HostListener('mousedown') onMouseDown(): void {
    this._focusFromMouse = true;
    this._keyboardFocused = false;
  }

  @HostListener('focus') onFocus(): void {
    this._keyboardFocused = !this._focusFromMouse;
    this._focusFromMouse = false;
  }

  @HostListener('blur') onBlur(): void {
    this._keyboardFocused = false;
  }

  /** Close panel when clicking outside the component.
   *  In panel-only mode the host is invisible (inset:0 on the parent trigger),
   *  so we use the parent element as the boundary — clicking the trigger itself
   *  must NOT auto-close here; the parent's mouseup handler calls toggle(). */
  @HostListener('document:pointerdown', ['$event.target'])
  onDocumentPointerDown(target: HTMLElement): void {
    const boundary = this.panelOnly()
      ? this._el.nativeElement.parentElement
      : this._el.nativeElement;
    if (this.open() && !boundary?.contains(target)) {
      this.open.set(false);
      document.removeEventListener('scroll', this._onAncestorScroll, true);
      this.closed.emit();
    }
  }

  /** Panel content click — auto-close for single-select when a non-disabled item is clicked. */
  onContentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const item = target.closest('merces-dropdown-item');
    if (item && !item.classList.contains('dropdown-item--disabled') && (this.mode() === 'single-select' || this.mode() === 'choice')) {
      setTimeout(() => {
        this.open.set(false);
        this.closed.emit();
      });
    }
  }

  /** Public toggle — for parent components that own the trigger. */
  toggle(): void { this._toggle(); }

  /** Public close — for parent components that need to close on action. */
  close(): void {
    if (this.open()) {
      this.open.set(false);
      this.closed.emit();
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('scroll', this._onAncestorScroll, true);
  }

  /** Close panel when any scrollable ancestor scrolls (capture phase catches all).
   *  Ignores scroll events that originate from within the dropdown panel itself —
   *  scrolling the panel content must not close the panel. */
  private readonly _onAncestorScroll = (event: Event): void => {
    if (this.open() && !this.panelOnly()) {
      if ((this._el.nativeElement as HTMLElement).contains(event.target as Node)) return;
      this.open.set(false);
      this.closed.emit();
    }
  };

  private _toggle(): void {
    if (this.isDisabled()) return;
    const next = !this.open();
    if (next && !this.panelOnly()) {
      this._positionPanel();
    }
    this.open.set(next);
    if (next) {
      document.addEventListener('scroll', this._onAncestorScroll, true);
      this.opened.emit();
      // Scroll the checked item into view after Angular updates the DOM.
      // rAF fires after the current rendering pass — panel is visible by then.
      requestAnimationFrame(() => this._scrollCheckedIntoView());
    } else {
      document.removeEventListener('scroll', this._onAncestorScroll, true);
      this.closed.emit();
    }
  }

  /**
   * Scrolls the panel content so the currently checked item is centred in the
   * visible area. Called once on open — no effect if nothing is checked.
   * Uses offsetTop rather than scrollIntoView() to keep scroll contained to the
   * panel and not bubble up to the page.
   */
  private _scrollCheckedIntoView(): void {
    const el      = this._el.nativeElement as HTMLElement;
    const content = el.querySelector('.dropdown-panel__content') as HTMLElement | null;
    const checked = el.querySelector('.dropdown-item--checked') as HTMLElement | null;
    if (!content || !checked) return;

    const targetScroll =
      checked.offsetTop - (content.clientHeight / 2) + (checked.clientHeight / 2);
    content.scrollTop = Math.max(0, targetScroll);
  }

  /**
   * Reads the trigger's viewport rect and exposes it as raw CSS custom properties.
   * CSS applies the Figma inset (var(--gap-lg)) on left/right/top so the panel
   * overlaps the trigger — keeping all design logic in tokens, not in TS.
   *
   * Also detects whether the panel would overflow its usable overlay boundary
   * and sets _computedOpenAbove so the panel opens upward instead.
   * Token values are read from computed styles so no px values are hardcoded here.
   */
  private _positionPanel(): void {
    const trigger = (this._el.nativeElement as HTMLElement)
      .querySelector('.dropdown-trigger') as HTMLElement | null;
    const rect = (trigger ?? this._el.nativeElement).getBoundingClientRect();
    const el = this._el.nativeElement as HTMLElement;

    // Read token values from CSS at runtime — no hardcoded pixels
    const gapLg = this._readPxToken('--gap-lg');      // inset
    const gapMd = this._readPxToken('--gap-md');      // boundary margin
    const minHeight = this._readPxToken('--gap-3xbig');
    const defaultMaxHeight = this._readPxToken('--gap-4xhuge');

    const boundary = this._overlayBoundary();
    const safeTop = boundary.top + gapMd;
    const safeBottom = boundary.bottom - gapMd;

    // Space available below: from (trigger top + inset) to safe overlay bottom.
    const spaceBelow = safeBottom - (rect.top + gapLg);
    // Space available above: from safe overlay top to (trigger bottom - inset).
    const spaceAbove = (rect.top + rect.height - gapLg) - safeTop;

    // Read the panel's CSS max-height (cascaded — respects per-instance overrides).
    // Only flip above when the panel genuinely won't fit below; prefer below otherwise.
    const panelMaxHeight =
      parseFloat(getComputedStyle(el).getPropertyValue('--dropdown-panel-max-height')) || defaultMaxHeight;
    const openAbove = spaceBelow < panelMaxHeight;
    const availableHeight = openAbove ? spaceAbove : spaceBelow;
    const panelHeight = Math.max(minHeight, Math.min(panelMaxHeight, availableHeight));
    this._computedOpenAbove.set(openAbove);

    el.style.setProperty('--_trigger-top',            `${rect.top}px`);
    el.style.setProperty('--_trigger-bottom-from-top', `${rect.top + rect.height}px`);
    el.style.setProperty('--_trigger-left',            `${rect.left}px`);
    el.style.setProperty('--_trigger-width',           `${rect.width}px`);
    el.style.setProperty('--_dropdown-panel-max-height', `${panelHeight}px`);
  }

  private _readPxToken(name: string): number {
    const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(value) ? value : 0;
  }

  /**
   * Standard dropdown panels use fixed positioning so card-level overflow does
   * not clip them. They still need to respect the outer app surface, though:
   * in Payerpath the shell body starts below the global header, so viewport-top
   * is not a safe overlay boundary.
   */
  private _overlayBoundary(): { top: number; bottom: number } {
    const viewport = { top: 0, bottom: window.innerHeight };
    let boundary = viewport;
    let ancestor = (this._el.nativeElement as HTMLElement).parentElement;

    while (ancestor && ancestor !== document.documentElement) {
      const style = getComputedStyle(ancestor);
      const overflow = `${style.overflow} ${style.overflowX} ${style.overflowY}`;
      if (/(auto|scroll|hidden|clip)/.test(overflow)) {
        const rect = ancestor.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          boundary = {
            top: Math.max(viewport.top, rect.top),
            bottom: Math.min(viewport.bottom, rect.bottom),
          };
        }
      }
      ancestor = ancestor.parentElement;
    }

    return boundary.bottom > boundary.top ? boundary : viewport;
  }
}
