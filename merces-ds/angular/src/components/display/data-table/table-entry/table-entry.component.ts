import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  HostListener,
  computed,
  input,
  output,
} from '@angular/core';
import type { IconName } from '../../../../assets/icon/icon.types';
import { CheckboxTableComponent } from '../../../inputs-and-interactive/checkboxes/checkbox-table/checkbox-table.component';
import { CtaButtonComponent } from '../../../inputs-and-interactive/cta-button/cta-button.component';
import type {
  TableEntryType,
  TableEntrySize,
  TableEntrySelectionState,
} from './table-entry.types';

@Component({
  selector: 'merces-table-entry',
  standalone: true,
  imports: [CheckboxTableComponent, CtaButtonComponent],
  templateUrl: './table-entry.component.html',
  styleUrl: './table-entry.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.te--string]':    'type() === "string"',
    '[class.te--action]':    'type() === "action"',
    '[class.te--selection]': 'type() === "selection"',
    '[class.te--base]':      'size() === "base"',
    '[class.te--mini]':      'size() === "mini"',
    '[attr.role]':           'type() === "selection" && interactive() ? "checkbox" : null',
    '[attr.aria-checked]':
      'type() === "selection" && interactive() ? (isIndeterminate() ? "mixed" : isChecked() ? "true" : "false") : null',
    '[attr.tabindex]':       'type() === "selection" && interactive() ? "0" : null',
  },
})
export class TableEntryComponent {
  /* ── Inputs ── */
  readonly type           = input<TableEntryType>('string');
  readonly size           = input<TableEntrySize>('base');
  readonly text           = input<string>('');
  readonly buttonLabel    = input<string>('Button');
  readonly buttonIcon     = input<IconName | undefined>(undefined);
  readonly selectionState = input<TableEntrySelectionState>('none');
  /** When false the parent row owns interaction — no tabindex, role, or event handling. */
  readonly interactive    = input<boolean>(true);

  /* ── Outputs ── */
  readonly selectionChange = output<boolean>();

  /* ── Derived ── */
  readonly isChecked       = computed(() => this.selectionState() === 'all');
  readonly isIndeterminate = computed(() => this.selectionState() === 'mixed');

  /* ── Keyboard focus tracking (selection type only) ── */
  private _keyboardFocused = false;
  private _focusFromMouse  = false;

  @HostBinding('class.te--keyboard-focus')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

  @HostListener('mousedown') onMouseDown(): void {
    if (this.type() !== 'selection' || !this.interactive()) return;
    this._focusFromMouse = true;
    this._keyboardFocused = false;
  }

  @HostListener('focus') onFocus(): void {
    if (this.type() !== 'selection' || !this.interactive()) return;
    this._keyboardFocused = !this._focusFromMouse;
    this._focusFromMouse = false;
  }

  @HostListener('blur') onBlur(): void {
    this._keyboardFocused = false;
  }

  @HostListener('click') onClick(): void {
    if (this.type() !== 'selection' || !this.interactive()) return;
    this.selectionChange.emit(this.selectionState() !== 'all');
  }

  @HostListener('keydown.enter', ['$event']) onEnter(e: Event): void {
    if (!this.interactive()) return;
    e.stopPropagation();
    this.onClick();
  }

  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    if (!this.interactive()) return;
    e.preventDefault();
    e.stopPropagation();
    this.onClick();
  }
}
