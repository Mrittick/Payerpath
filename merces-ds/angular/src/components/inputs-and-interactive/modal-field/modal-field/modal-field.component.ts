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
import { ClearComponent } from '../../sub-controls/clear/clear.component';
import type { ModalFieldState } from './modal-field.types';

@Component({
  selector: 'merces-modal-field',
  standalone: true,
  imports: [IconComponent, ClearComponent],
  templateUrl: './modal-field.component.html',
  styleUrl: './modal-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'button',
    '[class.modal-field--selected]': 'selected()',
    '[class.modal-field--unselected]': '!selected()',
    '[class.modal-field--disabled]': 'isDisabled()',
    '[class.modal-field--clearing]': 'clearing()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[tabindex]': 'isDisabled() ? -1 : 0',
  },
})
export class ModalFieldComponent {
  /* ── Inputs ── */
  readonly state = input<ModalFieldState>('default');
  readonly selected = input<boolean>(false);
  readonly placeholder = input<string>('Select');
  readonly selectionText = input<string>('Selection');

  /* ── Outputs ── */
  readonly clicked = output<void>();
  readonly cleared = output<void>();

  /* ── Internal state ── */
  readonly clearing = signal(false);

  /* ── Derived ── */
  readonly isDisabled = computed(() => this.state() === 'disabled');
  readonly displayText = computed(() =>
    this.selected() ? this.selectionText() : this.placeholder()
  );

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;
  private _focusFromMouse = false;

  @HostBinding('class.modal-field--keyboard-focus')
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

  @HostListener('click') onClick(): void {
    if (!this.isDisabled()) this.clicked.emit();
  }

  @HostListener('keydown.enter') onEnter(): void {
    if (!this.isDisabled()) this.clicked.emit();
  }

  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    if (!this.isDisabled()) this.clicked.emit();
  }

  onClear(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    // Phase 1: fade out (150ms)
    this.clearing.set(true);
    setTimeout(() => {
      // Phase 2: swap content while still invisible
      this.cleared.emit();
      // Phase 3: fade back in on next frame
      requestAnimationFrame(() => this.clearing.set(false));
    }, 150);
  }
}
