import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  computed,
  input,
  output,
} from '@angular/core';
import { IconComponent } from '../../../../../assets/icon/icon.component';
import { AccordionEditComponent } from '../accordion-edit/accordion-edit.component';
import { AccordionRemoveComponent } from '../accordion-remove/accordion-remove.component';
import { CheckboxComponent } from '../../../../inputs-and-interactive/checkboxes/checkbox/checkbox.component';
import type {
  AccordionEntryState,
  AccordionEntryEditMode,
  AccordionEntrySelection,
} from './accordion-entry.types';

@Component({
  selector: 'merces-accordion-entry',
  standalone: true,
  imports: [IconComponent, AccordionEditComponent, AccordionRemoveComponent, CheckboxComponent],
  templateUrl: './accordion-entry.component.html',
  styleUrl: './accordion-entry.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.accordion-entry--disabled]':    'state() === "disabled"',
    '[class.accordion-entry--edit-mode]':   'editMode() !== "na"',
    '[class.accordion-entry--rename]':      'editMode() === "rename"',
    '[class.accordion-entry--delete]':      'editMode() === "delete"',
    '[class.accordion-entry--rename-del]':  'editMode() === "rename-delete"',
    '[class.accordion-entry--batch]':       'editMode() === "batch-edit"',
    '[class.accordion-entry--checked]':     'selection() === "checked"',
    '[class.accordion-entry--mixed]':       'selection() === "mixed"',
    '[tabindex]':                           'isDisabled() ? -1 : 0',
    '[attr.role]':                          '"listitem"',
    '[attr.aria-disabled]':                 'isDisabled() ? "true" : null',
  },
})
export class AccordionEntryComponent {
  /* ── Inputs ── */
  readonly label     = input<string>('Accordion Entry');
  readonly state     = input<AccordionEntryState>('default');
  readonly editMode  = input<AccordionEntryEditMode>('na');
  readonly selection = input<AccordionEntrySelection>('na');

  /* ── Outputs ── */
  readonly rowClicked       = output<void>();
  readonly editClicked      = output<void>();
  readonly removeClicked    = output<void>();
  readonly selectionChanged = output<void>();

  /* ── Derived ── */
  readonly isDisabled   = computed(() => this.state() === 'disabled');
  readonly showEdit     = computed(() => this.editMode() === 'rename' || this.editMode() === 'rename-delete');
  readonly showRemove   = computed(() => this.editMode() === 'rename-delete' || this.editMode() === 'delete');
  readonly showCheckbox = computed(() => this.editMode() === 'batch-edit');
  readonly isChecked    = computed(() => this.selection() === 'checked');
  readonly isMixed      = computed(() => this.selection() === 'mixed');

  /* ── Keyboard focus tracking ── */
  private _keyFocused  = false;
  private _fromMouse   = false;
  private _pressed     = false;
  private _keyPressed  = false;

  @HostBinding('class.accordion-entry--keyboard-focus')
  get keyFocused(): boolean { return this._keyFocused; }

  @HostBinding('class.accordion-entry--pressed')
  get pressed(): boolean { return this._pressed; }

  @HostBinding('class.accordion-entry--key-pressed')
  get keyPressed(): boolean { return this._keyPressed; }

  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent): void {
    this._fromMouse = true;
    this._keyFocused = false;
    /* CSS :active propagates unconditionally to all ancestors — use a JS flag
       instead and skip setting it when the press originates inside .actions or .checkbox-wrapper */
    if ((e.target as Element).closest('.actions, .checkbox-wrapper')) return;
    this._pressed = true;
  }

  @HostListener('mouseup')    onMouseUp():    void { this._pressed = false; }
  @HostListener('mouseleave') onMouseLeave(): void { this._pressed = false; }

  @HostListener('focus') onFocus(): void {
    this._keyFocused = !this._fromMouse;
    this._fromMouse = false;
  }

  @HostListener('blur') onBlur(): void {
    this._keyFocused = false;
    this._keyPressed = false;
  }

  @HostListener('click') onClick(): void {
    if (!this.isDisabled()) this.rowClicked.emit();
  }

  @HostListener('keydown.enter', ['$event']) onEnter(e: Event): void {
    e.stopPropagation();
    if (!this.isDisabled()) {
      this._keyPressed = true;
      this.rowClicked.emit();
    }
  }

  @HostListener('keyup.enter') onEnterUp(): void { this._keyPressed = false; }

  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this.isDisabled()) {
      this._keyPressed = true;
      if (this.showCheckbox()) {
        this.selectionChanged.emit();
      } else {
        this.rowClicked.emit();
      }
    }
  }

  @HostListener('keyup.space') onSpaceUp(): void { this._keyPressed = false; }

  /* stopPropagation is handled by the (click) on the .actions / .checkbox-wrapper containers in the template */
  onEditClick(): void   { this.editClicked.emit(); }
  onRemoveClick(): void { this.removeClicked.emit(); }
}
