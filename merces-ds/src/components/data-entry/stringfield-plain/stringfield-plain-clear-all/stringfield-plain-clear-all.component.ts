import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  HostBinding,
  HostListener,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';

@Component({
  selector: 'merces-stringfield-clear-all',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './stringfield-plain-clear-all.component.html',
  styleUrl: './stringfield-plain-clear-all.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.clear-all--disabled]': 'disabled()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[tabindex]': 'disabled() ? -1 : 0',
    'role': 'button',
  },
})
export class StringfieldClearAllComponent {
  readonly disabled = input<boolean>(false);
  readonly label = input<string>('Clear all');

  readonly cleared = output<void>();

  /* ── Press state for release animation ── */
  readonly isPressed = signal(false);

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;
  private _focusFromMouse = false;

  @HostBinding('class.clear-all--keyboard-focus')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

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

  @HostListener('pointerdown') onPointerDown(): void {
    if (this.disabled()) return;
    this.isPressed.set(true);
    // Release back to default after 800ms (Figma AFTER_TIMEOUT)
    setTimeout(() => this.isPressed.set(false), 800);
  }

  @HostListener('click') onClick(): void {
    if (!this.disabled()) this.cleared.emit();
  }

  @HostListener('keydown.enter') onEnter(): void {
    if (!this.disabled()) this.cleared.emit();
  }

  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    if (!this.disabled()) this.cleared.emit();
  }

  readonly isActive = computed(() => this.isPressed());
}
