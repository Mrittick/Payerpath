import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  HostListener,
  computed,
  input,
  output,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';
import type { CheckboxDatavizSeries, CheckboxDatavizState } from './checkbox-dataviz.types';

@Component({
  selector: 'merces-checkbox-dataviz',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './checkbox-dataviz.component.html',
  styleUrl: './checkbox-dataviz.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'checkbox',
    '[attr.data-series]':          'series()',
    '[class.cdataviz--checked]':   'checked()',
    '[class.cdataviz--unchecked]': '!checked()',
    '[class.cdataviz--disabled]':  'isDisabled()',
    '[attr.aria-checked]':  'checked() ? "true" : "false"',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[tabindex]':           'isDisabled() ? -1 : 0',
  },
})
export class CheckboxDatavizComponent {
  /* ── Inputs ── */
  readonly series  = input<CheckboxDatavizSeries>('01');
  readonly checked = input<boolean>(false);
  readonly state   = input<CheckboxDatavizState>('default');
  readonly label   = input<string>('Series');

  /* ── Outputs ── */
  readonly changed = output<void>();

  /* ── Derived ── */
  readonly isDisabled = computed(() => this.state() === 'disabled');

  /* ── Keyboard focus (keyboard-only ring) ── */
  private _keyboardFocused = false;
  private _focusFromMouse  = false;

  @HostBinding('class.cdataviz--keyboard-focus')
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
