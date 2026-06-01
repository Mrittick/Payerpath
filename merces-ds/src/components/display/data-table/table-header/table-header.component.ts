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
import { CheckboxTableComponent } from '../../../inputs-and-interactive/checkboxes/checkbox-table/checkbox-table.component';
import type {
  TableHeaderVariant,
  TableHeaderType,
  TableHeaderSize,
  TableHeaderSortOrder,
  TableHeaderSelectionState,
} from './table-header.types';

@Component({
  selector: 'merces-table-header',
  standalone: true,
  imports: [IconComponent, CheckboxTableComponent],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]':        'type() === "checker" ? "checkbox" : "columnheader"',
    '[attr.aria-sort]':   'type() === "string" ? sortOrder() : null',
    '[attr.aria-checked]':
      'type() === "checker" ? (isIndeterminate() ? "mixed" : isChecked() ? "true" : "false") : null',
    'tabindex': '0',
    '[class.th--single]':  'variant() === "single"',
    '[class.th--dual]':    'variant() === "dual"',
    '[class.th--string]':  'type() === "string"',
    '[class.th--checker]': 'type() === "checker"',
    '[class.th--base]':    'size() === "base"',
    '[class.th--mini]':    'size() === "mini"',
  },
})
export class TableHeaderComponent {
  /* ── Inputs ── */
  readonly variant        = input<TableHeaderVariant>('single');
  readonly type           = input<TableHeaderType>('string');
  readonly size           = input<TableHeaderSize>('base');
  readonly sortOrder      = input<TableHeaderSortOrder>('none');
  readonly selectionState = input<TableHeaderSelectionState>('none');
  readonly mainText       = input<string>('');
  readonly extraText      = input<string>('');

  /* ── Outputs ── */
  readonly sortOrderChange = output<TableHeaderSortOrder>();
  readonly selectionChange = output<boolean>();
  readonly resizeStart     = output<MouseEvent>();
  readonly resizeReset     = output<void>();

  /* ── Resize input ── */
  readonly resizable = input<boolean>(false);

  /* ── Derived ── */
  readonly isChecked       = computed(() => this.selectionState() === 'all');
  readonly isIndeterminate = computed(() => this.selectionState() === 'mixed');
  readonly showSortIcon    = computed(() => this.sortOrder() !== 'none');
  readonly sortIconName    = computed(() =>
    this.sortOrder() === 'descending' ? 'chevron-down' : 'chevron-up'
  );
  readonly sortIconSize    = computed(() =>
    this.size() === 'mini' ? 'mini' : 'base'
  );

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused    = false;
  private _focusFromMouse     = false;
  /** Set by resize handle mousedown; suppresses the click that follows. */
  private _suppressNextClick  = false;

  @HostBinding('class.th--keyboard-focus')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

  @HostListener('mousedown') onMouseDown(): void {
    this._focusFromMouse = true;
    this._keyboardFocused = false;
    // Clear any stale suppress flag from a prior drag (mousedown bubbles up
    // from direct header clicks but NOT from the resize handle, which calls
    // stopPropagation — so this only fires for genuine header interactions).
    this._suppressNextClick = false;
  }

  onResizeMousedown(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation(); // prevents this mousedown from reaching @HostListener('mousedown')
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
    if (this.type() === 'string') {
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

  private _nextSortOrder(): TableHeaderSortOrder {
    if (this.sortOrder() === 'none')      return 'ascending';
    if (this.sortOrder() === 'ascending') return 'descending';
    return 'none';
  }
}
