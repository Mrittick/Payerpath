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
  selector: 'merces-accordion-remove',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './accordion-remove.component.html',
  styleUrl: './accordion-remove.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'button',
    '[attr.aria-label]': '"Remove entry"',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[tabindex]': 'disabled() ? -1 : 0',
    '[class.accordion-remove--disabled]': 'disabled()',
  },
})
export class AccordionRemoveComponent {
  readonly disabled = input<boolean>(false);
  readonly clicked = output<void>();

  private _keyFocused  = false;
  private _fromMouse   = false;
  private _keyPressed  = false;

  @HostBinding('class.accordion-remove--keyboard-focus')
  get keyFocused(): boolean { return this._keyFocused; }

  @HostBinding('class.accordion-remove--key-pressed')
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
