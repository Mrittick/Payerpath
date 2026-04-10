import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  HostBinding,
  HostListener,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';
import { ActiveIndicatorComponent, ActiveIndicatorState } from '../active-indicator/active-indicator.component';

export type FilterMode = 'hidden' | 'default' | 'invoked' | 'disabled';

@Component({
  selector: 'merces-filter',
  standalone: true,
  imports: [IconComponent, ActiveIndicatorComponent],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.filter--default]':  'mode() === "default"',
    '[class.filter--invoked]':  'mode() === "invoked"',
    '[class.filter--disabled]': 'mode() === "disabled"',
    '[class.filter--hidden]':   'mode() === "hidden"',
    '[class.filter--active]':   'isActive()',
    '[attr.aria-disabled]':     'mode() === "disabled" ? "true" : null',
    '[attr.aria-pressed]':      'mode() === "invoked" ? "true" : null',
    'role': 'button',
    '[tabindex]': 'mode() === "disabled" || mode() === "hidden" ? -1 : 0',
  },
})
export class FilterComponent {
  /* ── Inputs ── */
  readonly mode     = input<FilterMode>('default');
  readonly isActive = input<boolean>(false);

  /* ── Outputs ── */
  readonly toggled = output<void>();

  /* ── Computed: ActiveIndicator state syncs with parent ── */
  readonly indicatorState = computed<ActiveIndicatorState>(() => {
    if (this.mode() === 'invoked') return 'invoked';
    return 'default';
  });

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;
  private _hovered = false;

  @HostBinding('class.filter--keyboard-focused')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

  /** Expose hover state to template for ActiveIndicator sync */
  get indicatorEffectiveState(): ActiveIndicatorState {
    if (this.mode() === 'invoked') return 'invoked';
    if (this._hovered) return 'hover';
    return 'default';
  }

  @HostListener('keydown.enter') onEnter(): void { this._emitIfEnabled(); }
  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    this._emitIfEnabled();
  }
  @HostListener('click') onClick(): void { this._emitIfEnabled(); }
  @HostListener('blur') onBlur(): void { this._keyboardFocused = false; }
  @HostListener('mousedown') onMouseDown(): void {
    this._keyboardFocused = false;
  }
  @HostListener('mouseenter') onMouseEnter(): void { this._hovered = true; }
  @HostListener('mouseleave') onMouseLeave(): void {
    this._hovered = false;
  }

  @HostListener('document:keydown.tab')
  @HostListener('document:keydown.shift.tab')
  onTabKey(): void { this._keyboardFocused = true; }

  private _emitIfEnabled(): void {
    if (this.mode() !== 'disabled' && this.mode() !== 'hidden') {
      this.toggled.emit();
    }
  }
}
