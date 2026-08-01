import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  HostBinding,
  HostListener,
} from '@angular/core';
import { IconComponent } from '../../../../../assets/icon/icon.component';
import { IconName } from '../../../../../assets/icon/icon.types';

export type DropdownActionState = 'default' | 'hover' | 'pressed';

@Component({
  selector: 'merces-dropdown-action',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './dropdown-action.component.html',
  styleUrl: './dropdown-action.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.action--hover]': 'state() === "hover"',
    '[class.action--pressed]': 'state() === "pressed"',
  },
})
export class DropdownActionComponent {
  readonly state = input<DropdownActionState>('default');
  readonly label = input<string>('Done');
  readonly icon  = input<IconName>('tick');

  readonly pressed = output<void>();

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;

  @HostBinding('class.action--keyboard-focus')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

  @HostListener('click') onClick(): void { this.pressed.emit(); }
  @HostListener('keydown.enter') onEnter(): void { this.pressed.emit(); }
  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    this.pressed.emit();
  }
  @HostListener('blur') onBlur(): void { this._keyboardFocused = false; }
  @HostListener('mousedown') onMouseDown(): void {
    this._keyboardFocused = false;
  }

  @HostListener('document:keydown.tab')
  @HostListener('document:keydown.shift.tab')
  onTabKey(): void { this._keyboardFocused = true; }
}
