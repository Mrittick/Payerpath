import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';

export type MaskToggleSize  = 'base' | 'mini';
export type MaskToggleLevel = 'primary' | 'secondary' | 'tertiary';
export type MaskToggleState = 'hidden' | 'default' | 'disabled';

@Component({
  selector: 'merces-mask-toggle',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './mask-toggle.component.html',
  styleUrl: './mask-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.mask-toggle--base]':      'size() === "base"',
    '[class.mask-toggle--mini]':      'size() === "mini"',
    '[class.mask-toggle--primary]':   'level() === "primary"',
    '[class.mask-toggle--secondary]': 'level() === "secondary"',
    '[class.mask-toggle--tertiary]':  'level() === "tertiary"',
    '[class.mask-toggle--hidden]':    'state() === "hidden"',
    '[class.mask-toggle--disabled]':  'state() === "disabled"',
    '[class.mask-toggle--pressed]':   'isPressed()',
  },
})
export class MaskToggleComponent {
  /* ── Inputs ── */
  readonly size     = input<MaskToggleSize>('base');
  readonly level    = input<MaskToggleLevel>('primary');
  readonly state    = input<MaskToggleState>('default');
  readonly isMasked = input<boolean>(true);

  /* ── Output — enables [(isMasked)] two-way binding ── */
  readonly isMaskedChange = output<boolean>();

  /* ── JS-driven pressed state — ensures transition has time to complete ── */
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
    this._pressTimeout = setTimeout(() => {
      this.isPressed.set(false);
      this._pressTimeout = null;
    }, 250);
  }

  toggle(): void {
    if (this.state() !== 'disabled' && this.state() !== 'hidden') {
      this.isMaskedChange.emit(!this.isMasked());
    }
  }
}
