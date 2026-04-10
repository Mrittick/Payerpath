import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';

export type ClearSize = 'base' | 'mini';
export type ClearLevel = 'primary' | 'secondary' | 'tertiary';
export type ClearState = 'default' | 'disabled' | 'hidden';

@Component({
  selector: 'merces-clear',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './clear.component.html',
  styleUrl: './clear.component.css',
  host: {
    '[class.clear--base]': 'size() === "base"',
    '[class.clear--mini]': 'size() === "mini"',
    '[class.clear--primary]': 'level() === "primary"',
    '[class.clear--secondary]': 'level() === "secondary"',
    '[class.clear--tertiary]': 'level() === "tertiary"',
    '[class.clear--disabled]': 'state() === "disabled"',
    '[class.clear--hidden]': 'state() === "hidden"',
    '[class.clear--pressed]': 'isPressed()',
  },
})
export class ClearComponent {
  /** Size variant. */
  readonly size = input<ClearSize>('base');

  /** Visual prominence level. */
  readonly level = input<ClearLevel>('primary');

  /** Interaction state. */
  readonly state = input<ClearState>('default');

  /** Accessible label for the button. */
  readonly label = input<string>('Clear');

  /** Emitted when the clear button is clicked. */
  readonly pressed = output<void>();

  /** JS-driven pressed state — ensures transition has time to complete */
  readonly isPressed = signal(false);

  private _pressTimeout: ReturnType<typeof setTimeout> | null = null;

  @HostListener('mousedown')
  onMouseDown(): void {
    if (this.state() === 'disabled' || this.state() === 'hidden') return;
    if (this._pressTimeout) clearTimeout(this._pressTimeout);
    requestAnimationFrame(() => this.isPressed.set(true));
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  onRelease(): void {
    if (!this.isPressed()) return;
    // Hold pressed state for 250ms so the transition completes
    this._pressTimeout = setTimeout(() => {
      this.isPressed.set(false);
      this._pressTimeout = null;
    }, 250);
  }

  onClick(): void {
    if (this.state() === 'disabled' || this.state() === 'hidden') return;
    this.pressed.emit();
  }
}
