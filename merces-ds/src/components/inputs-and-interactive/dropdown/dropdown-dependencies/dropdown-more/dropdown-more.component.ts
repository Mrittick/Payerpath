import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  HostBinding,
  HostListener,
} from '@angular/core';
import { IconComponent } from '../../../../../assets/icon/icon.component';

export type DropdownMoreState = 'default' | 'hover' | 'pressed' | 'disabled';

@Component({
  selector: 'merces-dropdown-more',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './dropdown-more.component.html',
  styleUrl: './dropdown-more.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'button',
    '[class.more--hover]': 'state() === "hover"',
    '[class.more--pressed]': 'state() === "pressed"',
    '[class.more--disabled]': 'state() === "disabled"',
    '[attr.aria-disabled]': 'state() === "disabled" ? "true" : null',
    '[tabindex]': 'state() === "disabled" ? -1 : 0',
  },
})
export class DropdownMoreComponent {
  readonly state = input<DropdownMoreState>('default');
  readonly label = input<string>('More...');

  readonly pressed = output<void>();

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;

  @HostBinding('class.more--keyboard-focus')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

  @HostListener('click') onClick(): void { this._emitIfEnabled(); }
  @HostListener('keydown.enter') onEnter(): void { this._emitIfEnabled(); }
  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    this._emitIfEnabled();
  }
  @HostListener('blur') onBlur(): void { this._keyboardFocused = false; }
  @HostListener('mousedown') onMouseDown(): void {
    this._keyboardFocused = false;
  }

  @HostListener('document:keydown.tab')
  @HostListener('document:keydown.shift.tab')
  onTabKey(): void { this._keyboardFocused = true; }

  private _emitIfEnabled(): void {
    if (this.state() !== 'disabled') {
      this.pressed.emit();
    }
  }
}
