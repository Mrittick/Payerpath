import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  HostListener,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'merces-pager-button',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './pager-button.component.html',
  styleUrl: './pager-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]':          '"button"',
    '[attr.tabindex]':      '"0"',
    '[attr.aria-label]':    '"Page " + page()',
    '[attr.aria-current]':  'active() ? "page" : null',
    '[class.pager-button--active]':         'active()',
    '[class.pager-button--keyboard-focused]':'_keyboardFocused',
  },
})
export class PagerButtonComponent {
  readonly page   = input.required<number>();
  readonly active = input<boolean>(false);

  readonly pressed = output<void>();

  _keyboardFocused = false;

  @HostListener('click') onClick(): void {
    this.pressed.emit();
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKey(e: Event): void {
    e.preventDefault();
    this.pressed.emit();
  }

  @HostListener('blur') onBlur(): void { this._keyboardFocused = false; }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') this._keyboardFocused = true;
  }

  @HostListener('mousedown') onMousedown(): void { this._keyboardFocused = false; }
}
