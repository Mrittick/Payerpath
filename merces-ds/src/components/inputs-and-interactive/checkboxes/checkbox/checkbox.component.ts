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
import type { CheckboxSize, CheckboxState, CheckboxOrientation, CheckboxTheme } from './checkbox.types';

@Component({
  selector: 'merces-checkbox',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'checkbox',
    '[class.checkbox--base]': 'size() === "base"',
    '[class.checkbox--mini]': 'size() === "mini"',
    '[class.checkbox--group]': 'group()',
    '[class.checkbox--standalone]': '!group()',
    '[class.checkbox--left]': 'orientation() === "left"',
    '[class.checkbox--right]': 'orientation() === "right"',
    '[class.checkbox--checked]': 'checked() && !indeterminate()',
    '[class.checkbox--mixed]': 'indeterminate()',
    '[class.checkbox--unchecked]': '!checked() && !indeterminate()',
    '[class.checkbox--pressed]': 'pressed()',
    '[class.checkbox--brand]': 'theme() === "brand"',
    '[class.checkbox--neutral]': 'theme() === "neutral"',
    '[class.checkbox--disabled]': 'isDisabled()',
    '[attr.aria-checked]': 'indeterminate() ? "mixed" : checked() ? "true" : "false"',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[tabindex]': 'isDisabled() ? -1 : 0',
  },
})
export class CheckboxComponent {
  /* ── Inputs ── */
  readonly size = input<CheckboxSize>('base');
  readonly state = input<CheckboxState>('default');
  readonly orientation = input<CheckboxOrientation>('left');
  readonly theme = input<CheckboxTheme>('brand');
  readonly group = input<boolean>(false);
  readonly checked = input<boolean>(false);
  readonly indeterminate = input<boolean>(false);
  readonly label = input<string>('Checkbox');
  readonly pressed = input<boolean>(false);

  /* ── Outputs ── */
  readonly changed = output<void>();

  /* ── Derived ── */
  readonly isDisabled = computed(() => this.state() === 'disabled');
  readonly iconName = computed(() => this.indeterminate() ? 'dash' : 'tick');
  readonly iconType = computed(() => this.indeterminate() ? 'regular' : 'bold');
  readonly iconSize = computed(() => this.size() === 'mini' ? 'tiny' : 'mini');

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;
  private _focusFromMouse = false;

  @HostBinding('class.checkbox--keyboard-focus')
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
    if (!this.isDisabled()) this.changed.emit();
  }

  @HostListener('keydown.enter', ['$event']) onEnter(e: Event): void {
    e.stopPropagation();
    if (!this.isDisabled()) this.changed.emit();
  }

  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this.isDisabled()) this.changed.emit();
  }
}
