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
import { StringfieldMessageComponent } from '../stringfield-plain/stringfield-plain-message/stringfield-plain-message.component';
import { MaskToggleComponent } from '../../inputs-and-interactive/sub-controls/mask-toggle/mask-toggle.component';
import type { StringfieldSecureValidationState } from './stringfield-secure.types';

@Component({
  selector: 'merces-stringfield-secure',
  standalone: true,
  imports: [ClearComponent, StringfieldMessageComponent, MaskToggleComponent],
  templateUrl: './stringfield-secure.component.html',
  styleUrl: './stringfield-secure.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ssf--empty]': 'isEmpty()',
    '[class.ssf--filled]': '!isEmpty()',
    '[class.ssf--disabled]': 'disabled()',
    '[class.ssf--valid]': 'validationState() === "valid"',
    '[class.ssf--warning]': 'validationState() === "warning"',
    '[class.ssf--error]': 'validationState() === "error"',
    '[class.ssf--active]': 'isFocused()',
    '[class.ssf--has-message]': 'showMessage()',
    '[class.ssf--masked]': 'isMasked()',
    '[class.ssf--unmasked]': '!isMasked()',
  },
})
export class StringfieldSecureComponent {
  /* ── Inputs ── */
  readonly placeholder = input<string>('Password');
  readonly value = model<string>('');
  readonly validationState = input<StringfieldSecureValidationState>('valid');
  readonly disabled = input<boolean>(false);
  readonly message = input<string>('');

  /* ── Internal state ── */
  readonly isFocused = signal(false);
  readonly isMasked = signal(true);

  /* ── Derived ── */
  readonly isEmpty = computed(() => this.value() === '');
  readonly showMessage = computed(
    () => this.validationState() !== 'valid' && this.message().length > 0
  );
  readonly clearState = computed(() =>
    this.disabled() || this.isEmpty() ? 'hidden' : 'default'
  );
  readonly maskToggleState = computed(() =>
    this.disabled() || this.isEmpty() ? 'hidden' : 'default'
  );

  /* ── Template ref ── */
  readonly inputEl = viewChild.required<ElementRef<HTMLInputElement>>('inputEl');

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;
  private _focusFromMouse = false;

  @HostBinding('class.ssf--keyboard-focus')
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

  onMaskToggle(newVal: boolean): void {
    if (this.disabled()) return;
    this.isMasked.set(newVal);
    this.inputEl().nativeElement.focus();
  }
}
