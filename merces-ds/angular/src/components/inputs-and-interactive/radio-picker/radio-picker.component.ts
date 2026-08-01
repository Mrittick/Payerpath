import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  HostBinding,
  HostListener,
} from '@angular/core';
import type {
  RadioPickerSize,
  RadioPickerState,
  RadioPickerOrientation,
  RadioPickerTheme,
} from './radio-picker.types';

@Component({
  selector: 'merces-radio-picker',
  standalone: true,
  imports: [],
  templateUrl: './radio-picker.component.html',
  styleUrl: './radio-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'radio',
    '[class.radio-picker--base]': 'size() === "base"',
    '[class.radio-picker--mini]': 'size() === "mini"',
    '[class.radio-picker--group]': 'group()',
    '[class.radio-picker--standalone]': '!group()',
    '[class.radio-picker--left]': 'orientation() === "left"',
    '[class.radio-picker--right]': 'orientation() === "right"',
    '[class.radio-picker--selected]': 'selected()',
    '[class.radio-picker--unselected]': '!selected()',
    '[class.radio-picker--brand]': 'theme() === "brand"',
    '[class.radio-picker--neutral]': 'theme() === "neutral"',
    '[class.radio-picker--disabled]': 'isDisabled()',
    '[attr.aria-checked]': 'selected()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[tabindex]': 'isDisabled() ? -1 : 0',
  },
})
export class RadioPickerComponent {
  /* ── Inputs ── */
  readonly size = input<RadioPickerSize>('base');
  readonly state = input<RadioPickerState>('default');
  readonly orientation = input<RadioPickerOrientation>('left');
  readonly theme = input<RadioPickerTheme>('brand');
  readonly group = input<boolean>(false);
  readonly selected = input<boolean>(false);
  readonly label = input<string>('Radio');

  /* ── Outputs ── */
  readonly clicked = output<void>();

  /* ── Derived ── */
  readonly isDisabled = computed(() => this.state() === 'disabled');

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;
  private _focusFromMouse = false;

  @HostBinding('class.radio-picker--keyboard-focus')
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
}
