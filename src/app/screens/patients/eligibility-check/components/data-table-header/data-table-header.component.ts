import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  HostListener,
  computed,
  input,
  output,
} from '@angular/core';
import { IconComponent } from '@merces/assets/icon/icon.component';
import { CheckboxTableComponent } from '@merces/components/inputs-and-interactive/checkboxes/checkbox-table/checkbox-table.component';

export type EcHeaderType      = 'checkbox' | 'text';
export type EcSortOrder       = 'none' | 'ascending' | 'descending';
export type EcSelectionState  = 'none' | 'all' | 'mixed';

@Component({
  selector: 'payerpath-ec-table-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, CheckboxTableComponent],
  templateUrl: './data-table-header.component.html',
  styleUrl: './data-table-header.component.css',
  host: {
    '[attr.role]':       'type() === "checkbox" ? "checkbox" : "columnheader"',
    '[attr.aria-sort]':  'type() === "text" ? sortOrder() : null',
    '[attr.aria-checked]':
      'type() === "checkbox" ? (selectionState() === "mixed" ? "mixed" : selectionState() === "all" ? "true" : "false") : null',
    'tabindex': '0',
    '[class.th--checkbox]': 'type() === "checkbox"',
    '[class.th--text]':     'type() === "text"',
  },
})
export class EcTableHeaderComponent {
  /* ── Inputs ── */
  readonly type           = input<EcHeaderType>('text');
  readonly label          = input<string>('');
  readonly sortOrder      = input<EcSortOrder>('none');
  readonly selectionState = input<EcSelectionState>('none');
  readonly resizable      = input<boolean>(true);

  /* ── Outputs ── */
  readonly sortOrderChange = output<'ascending' | 'descending'>();
  readonly selectionChange = output<boolean>();
  readonly resizeStart     = output<MouseEvent>();
  readonly resizeReset     = output<void>();

  /* ── Derived ── */
  readonly _isChecked       = computed(() => this.selectionState() === 'all');
  readonly _isIndeterminate = computed(() => this.selectionState() === 'mixed');
  readonly _showSortIcon    = computed(() => this.sortOrder() !== 'none');
  readonly _sortIconName    = computed(() =>
    this.sortOrder() === 'descending' ? 'chevron-down' : 'chevron-up'
  );

  /* ── Keyboard focus (keyboard-only ring) ── */
  private _keyboardFocused   = false;
  private _focusFromMouse    = false;
  private _suppressNextClick = false;

  @HostBinding('class.th--keyboard-focus')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

  @HostListener('mousedown') onMouseDown(): void {
    this._focusFromMouse = true;
    this._keyboardFocused = false;
    this._suppressNextClick = false;
  }

  onResizeMousedown(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this._suppressNextClick = true;
    this.resizeStart.emit(e);
  }

  onResizeDblClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.resizeReset.emit();
  }

  @HostListener('focus') onFocus(): void {
    this._keyboardFocused = !this._focusFromMouse;
    this._focusFromMouse = false;
  }

  @HostListener('blur') onBlur(): void {
    this._keyboardFocused = false;
  }

  @HostListener('click') onClick(): void {
    if (this._suppressNextClick) { this._suppressNextClick = false; return; }
    if (this.type() === 'text') {
      this.sortOrderChange.emit(this._nextSortOrder());
    } else {
      this.selectionChange.emit(this.selectionState() !== 'all');
    }
  }

  @HostListener('keydown.enter', ['$event']) onEnter(e: Event): void {
    e.stopPropagation();
    this.onClick();
  }

  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.onClick();
  }

  private _nextSortOrder(): 'ascending' | 'descending' {
    return this.sortOrder() === 'ascending' ? 'descending' : 'ascending';
  }
}
