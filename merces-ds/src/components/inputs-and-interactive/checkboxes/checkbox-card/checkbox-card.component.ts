import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  HostListener,
  computed,
  input,
  model,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';

@Component({
  selector: 'merces-checkbox-card',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './checkbox-card.component.html',
  styleUrl: './checkbox-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'checkbox',
    '[class.cb-card--base]':     'size() === "base"',
    '[class.cb-card--mini]':     'size() === "mini"',
    '[class.cb-card--checked]':  'checked()',
    '[class.cb-card--unchecked]':'!checked()',
    '[class.cb-card--disabled]': 'isDisabled()',
    '[attr.aria-checked]':  'checked() ? "true" : "false"',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[tabindex]':           'isDisabled() ? -1 : 0',
  },
})
export class CheckboxCardComponent {
  /* ── Inputs ── */
  readonly size     = input<'base' | 'mini'>('base');
  readonly disabled = input<boolean>(false);

  /* ── Two-way checked state ── */
  readonly checked = model<boolean>(false);

  /* ── Derived ── */
  readonly isDisabled = computed(() => this.disabled());
  readonly iconSize   = computed(() => this.size() === 'mini' ? 'tiny' : 'mini');

  /* ── Keyboard focus (keyboard-only ring) ── */
  private _keyboardFocused = false;
  private _focusFromMouse  = false;

  @HostBinding('class.cb-card--keyboard-focus')
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
    if (!this.isDisabled()) this.checked.set(!this.checked());
  }

  @HostListener('keydown.enter', ['$event']) onEnter(e: Event): void {
    e.stopPropagation();
    if (!this.isDisabled()) this.checked.set(!this.checked());
  }

  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this.isDisabled()) this.checked.set(!this.checked());
  }
}
