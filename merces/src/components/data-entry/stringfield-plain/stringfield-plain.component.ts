import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  signal,
  computed,
  HostBinding,
  HostListener,
  viewChild,
  ElementRef,
} from '@angular/core';
import { ClearComponent } from '../../inputs-and-interactive/sub-controls/clear/clear.component';
import { StringfieldMessageComponent } from './stringfield-plain-message/stringfield-plain-message.component';
import type { StringfieldValidationState } from './stringfield-plain.types';

@Component({
  selector: 'merces-stringfield-plain',
  standalone: true,
  imports: [ClearComponent, StringfieldMessageComponent],
  templateUrl: './stringfield-plain.component.html',
  styleUrl: './stringfield-plain.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sf--empty]': 'isEmpty()',
    '[class.sf--filled]': '!isEmpty()',
    '[class.sf--disabled]': 'disabled()',
    '[class.sf--valid]': 'validationState() === "valid"',
    '[class.sf--warning]': 'validationState() === "warning"',
    '[class.sf--error]': 'validationState() === "error"',
    '[class.sf--active]': 'isFocused()',
    '[class.sf--has-message]': 'showMessage()',
  },
})
export class StringfieldPlainComponent {
  /* ── Inputs ── */
  readonly placeholder = input<string>('Text Field');
  readonly value = model<string>('');
  readonly type = input<'text' | 'password' | 'email'>('text');
  readonly validationState = input<StringfieldValidationState>('valid');
  readonly disabled = input<boolean>(false);
  readonly message = input<string>('');

  /* ── Internal state ── */
  readonly isFocused = signal(false);

  /* ── Derived ── */
  readonly isEmpty = computed(() => this.value() === '');
  readonly showMessage = computed(
    () => this.validationState() !== 'valid' && this.message().length > 0
  );
  readonly clearState = computed(() =>
    this.disabled() ? 'disabled' : 'default'
  );

  /* ── Template ref ── */
  readonly inputEl = viewChild.required<ElementRef<HTMLInputElement>>('inputEl');

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;
  private _focusFromMouse = false;

  @HostBinding('class.sf--keyboard-focus')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

  /* Focus the native input when frame area (padding) is clicked */
  onFrameClick(): void {
    if (!this.disabled()) this.inputEl().nativeElement.focus();
  }

  @HostListener('mousedown') onMouseDown(): void {
    this._focusFromMouse = true;
    this._keyboardFocused = false;
  }

  onInputFocus(): void {
    this.isFocused.set(true);
    this._keyboardFocused = !this._focusFromMouse;
    this._focusFromMouse = false;
  }

  onInputBlur(): void {
    this.isFocused.set(false);
    this._keyboardFocused = false;
  }

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  onClear(): void {
    if (this.disabled()) return;
    this.value.set('');
    this.inputEl().nativeElement.focus();
  }
}
