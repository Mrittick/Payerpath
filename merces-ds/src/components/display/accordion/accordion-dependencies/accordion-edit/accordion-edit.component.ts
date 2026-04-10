import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  input,
  output,
} from '@angular/core';
import { IconComponent } from '../../../../../assets/icon/icon.component';

@Component({
  selector: 'merces-accordion-edit',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './accordion-edit.component.html',
  styleUrl: './accordion-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'button',
    '[attr.aria-label]': '"Rename entry"',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[tabindex]': 'disabled() ? -1 : 0',
    '[class.accordion-edit--disabled]': 'disabled()',
  },
})
export class AccordionEditComponent {
  readonly disabled = input<boolean>(false);
  readonly clicked = output<void>();

  private _keyFocused  = false;
  private _fromMouse   = false;
  private _keyPressed  = false;

  @HostBinding('class.accordion-edit--keyboard-focus')
  get keyFocused(): boolean { return this._keyFocused; }

  @HostBinding('class.accordion-edit--key-pressed')
  get keyPressed(): boolean { return this._keyPressed; }

  @HostListener('mousedown') onMouseDown(): void {
    this._fromMouse = true;
    this._keyFocused = false;
  }

  @HostListener('focus') onFocus(): void {
    this._keyFocused = !this._fromMouse;
    this._fromMouse = false;
  }

  @HostListener('blur') onBlur(): void {
    this._keyFocused = false;
    this._keyPressed = false;
  }

  @HostListener('click') onClick(): void { this._emit(); }

  @HostListener('keydown.enter', ['$event']) onEnter(e: Event): void {
    e.stopPropagation();
    this._emit();
  }

  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this._keyPressed = true;
    this._emit();
  }

  @HostListener('keyup.space') onSpaceUp(): void { this._keyPressed = false; }

  private _emit(): void {
    if (!this.disabled()) this.clicked.emit();
  }
}
