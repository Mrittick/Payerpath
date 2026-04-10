import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  HostListener,
  input,
} from '@angular/core';
import type { TableRowSize } from './table-row.types';

@Component({
  selector: 'merces-table-row',
  standalone: true,
  imports: [],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.tr--alternating]': 'alternating()',
    '[class.tr--base]':        'size() === "base"',
    '[class.tr--mini]':        'size() === "mini"',
    'tabindex': '0',
  },
})
export class TableRowComponent {
  /* ── Inputs ── */
  readonly alternating = input<boolean>(false);
  readonly size        = input<TableRowSize>('base');

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;
  private _focusFromMouse  = false;

  @HostBinding('class.tr--keyboard-focus')
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
}
