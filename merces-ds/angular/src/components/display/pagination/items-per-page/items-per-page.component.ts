import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  effect,
  HostListener,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';
import { DropdownItemComponent } from '../../../inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-item/dropdown-item.component';

@Component({
  selector: 'merces-items-per-page',
  standalone: true,
  imports: [IconComponent, DropdownItemComponent],
  templateUrl: './items-per-page.component.html',
  styleUrl: './items-per-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ipp--open]':             '_open()',
    '[class.ipp--disabled]':         'disabled()',
    '[class.ipp--keyboard-focused]': '_keyboardFocused()',
    '[attr.role]':                   '"combobox"',
    '[attr.aria-expanded]':          '_open()',
    '[attr.aria-haspopup]':          '"listbox"',
    '[attr.aria-disabled]':          'disabled() ? "true" : null',
    '[attr.tabindex]':               'disabled() ? "-1" : "0"',
  },
})
export class ItemsPerPageComponent implements OnDestroy {
  private readonly _el = inject(ElementRef);

  readonly value    = input.required<number>();
  readonly options  = input<number[]>([10, 25, 50, 100]);
  readonly disabled = input<boolean>(false);

  readonly valueChange = output<number>();

  /** Logical open state — drives the CSS transition class. */
  readonly _open            = signal(false);
  /** DOM gate — panel stays mounted during the exit transition. */
  readonly _rendered        = signal(false);
  readonly _keyboardFocused = signal(false);

  _panelPos = signal<{ bottom: number; left: number; width: number } | null>(null);

  private _docListener: (() => void) | null = null;
  private _closeTimer: ReturnType<typeof setTimeout> | null = null;
  private _openRafId: number | null = null;

  constructor() {
    effect(() => {
      if (this.disabled()) {
        this._keyboardFocused.set(false);
        // Instant close (no animation) when disabled externally.
        if (this._openRafId !== null) { cancelAnimationFrame(this._openRafId); this._openRafId = null; }
        if (this._closeTimer !== null) { clearTimeout(this._closeTimer); this._closeTimer = null; }
        this._open.set(false);
        this._rendered.set(false);
        this._panelPos.set(null);
        this._detachDocListener();
      }
    });
  }

  private _openPanel(): void {
    if (this._closeTimer !== null) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
    const gap1xs = this._readPxToken('--gap-1xs');
    const rect: DOMRect = this._el.nativeElement.getBoundingClientRect();
    this._panelPos.set({
      bottom: window.innerHeight - rect.top + gap1xs,
      left:   rect.left,
      width:  rect.width,
    });
    // Mount the hidden panel and let that state paint before toggling open.
    // Without the extra frame, the enter transition can be coalesced away.
    this._rendered.set(true);
    this._openRafId = requestAnimationFrame(() => {
      this._openRafId = requestAnimationFrame(() => {
        this._openRafId = null;
        this._open.set(true);
      });
    });
    this._attachDocListener();
  }

  private _closePanel(): void {
    // Cancel a pending open rAF so rapid open→close never leaves _open=true.
    if (this._openRafId !== null) {
      cancelAnimationFrame(this._openRafId);
      this._openRafId = null;
    }
    this._open.set(false);
    this._detachDocListener();
    this._closeTimer = setTimeout(() => {
      this._rendered.set(false);
      this._panelPos.set(null);
      this._closeTimer = null;
    }, 200);
  }

  toggle(): void {
    if (this.disabled()) return;
    this._open() ? this._closePanel() : this._openPanel();
  }

  select(opt: number): void {
    if (opt !== this.value()) this.valueChange.emit(opt);
    this._closePanel();
  }

  private _readPxToken(name: string): number {
    const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(value) ? value : 0;
  }

  private _attachDocListener(): void {
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

  private _detachDocListener(): void {
    this._docListener?.();
    this._docListener = null;
  }

  ngOnDestroy(): void {
    this._detachDocListener();
    if (this._closeTimer !== null) clearTimeout(this._closeTimer);
    if (this._openRafId !== null) cancelAnimationFrame(this._openRafId);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') this._keyboardFocused.set(true);
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(); }
    if (e.key === 'Escape') this._closePanel();
  }

  @HostListener('mousedown') onMousedown(): void { this._keyboardFocused.set(false); }
  @HostListener('blur')      onBlur():      void { this._keyboardFocused.set(false); }
  @HostListener('click')     onClick():     void { this.toggle(); }
}
