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
import type { CheckboxTableSize, CheckboxTableHierarchy, CheckboxTableTheme, CheckboxTableState } from './checkbox-table.types';

@Component({
  selector: 'merces-checkbox-table',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './checkbox-table.component.html',
  styleUrl: './checkbox-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'checkbox',
    '[class.cb-table--base]':    'size() === "base"',
    '[class.cb-table--mini]':    'size() === "mini"',
    '[class.cb-table--header]':  'hierarchy() === "header"',
    '[class.cb-table--entry]':   'hierarchy() === "entry"',
    '[class.cb-table--brand]':   'theme() === "brand"',
    '[class.cb-table--neutral]': 'theme() === "neutral"',
    '[class.cb-table--checked]':    'checked() && !indeterminate()',
    '[class.cb-table--mixed]':      'indeterminate()',
    '[class.cb-table--unchecked]':  '!checked() && !indeterminate()',
    '[class.cb-table--disabled]':   'isDisabled()',
    '[attr.aria-checked]':   'indeterminate() ? "mixed" : checked() ? "true" : "false"',
    '[attr.aria-disabled]':  'isDisabled() ? "true" : null',
    '[tabindex]':            'isDisabled() ? -1 : 0',
  },
})
export class CheckboxTableComponent {
  /* ── Inputs ── */
  readonly size      = input<CheckboxTableSize>('base');
  readonly hierarchy = input<CheckboxTableHierarchy>('entry');
  readonly theme     = input<CheckboxTableTheme>('brand');
  readonly checked      = input<boolean>(false);
  readonly indeterminate = input<boolean>(false);
  readonly state     = input<CheckboxTableState>('default');

  /* ── Outputs ── */
  readonly changed = output<void>();

  /* ── Derived ── */
  readonly isDisabled = computed(() => this.state() === 'disabled');
  readonly iconName   = computed(() => this.indeterminate() ? 'dash' : 'tick');
  readonly iconType   = computed(() => this.indeterminate() ? 'regular' : 'bold');
  readonly iconSize   = computed(() => this.size() === 'mini' ? 'tiny' : 'mini');

  /* ── Keyboard focus (keyboard-only ring) ── */
  private _keyboardFocused = false;
  private _focusFromMouse  = false;

  @HostBinding('class.cb-table--keyboard-focus')
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
