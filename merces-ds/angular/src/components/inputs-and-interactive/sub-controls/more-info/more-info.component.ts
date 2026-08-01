import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  HostBinding,
  HostListener,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';

@Component({
  selector: 'merces-more-info',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './more-info.component.html',
  styleUrl: './more-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'button',
    '[tabindex]': '0',
  },
})
export class MoreInfoComponent {
  /* ── Inputs ── */
  readonly label = input<string>('More Info');

  /* ── Output ── */
  readonly clicked = output<void>();

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;

  @HostBinding('class.mi--keyboard-focused')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

  @HostListener('keydown.enter') onEnter(): void { this.clicked.emit(); }
  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    this.clicked.emit();
  }
  @HostListener('click') onClick(): void { this.clicked.emit(); }
  @HostListener('blur') onBlur(): void { this._keyboardFocused = false; }
  @HostListener('mousedown') onMouseDown(): void {
    this._keyboardFocused = false;
  }

  @HostListener('document:keydown.tab')
  @HostListener('document:keydown.shift.tab')
  onTabKey(): void { this._keyboardFocused = true; }
}
