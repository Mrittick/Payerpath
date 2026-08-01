import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  HostBinding,
  HostListener,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';
import { IconName } from '../../../../assets/icon/icon.types';

export type CopierBehaviour = 'contextual' | 'minimal';
export type CopierStyle = 'primary' | 'secondary' | 'tertiary';

@Component({
  selector: 'merces-copier',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './copier.component.html',
  styleUrl: './copier.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.copier--contextual]': 'behaviour() === "contextual"',
    '[class.copier--minimal]':    'behaviour() === "minimal"',
    '[class.copier--primary]':    'variant() === "primary"',
    '[class.copier--secondary]':  'variant() === "secondary"',
    '[class.copier--tertiary]':   'variant() === "tertiary"',
    '[class.copier--confirmed]':  'confirmed()',
    '[class.copier--exiting]':    'exiting()',
    'role': 'button',
    '[tabindex]': '0',
    '[attr.aria-label]': '"Copy to clipboard"',
  },
})
export class CopierComponent {
  /* ── Inputs ── */
  readonly behaviour = input<CopierBehaviour>('contextual');
  readonly variant   = input<CopierStyle>('primary');
  readonly value     = input<string>('');

  /* ── Outputs ── */
  readonly copied = output<void>();

  /* ── State ── */
  readonly confirmed = signal(false);
  readonly exiting   = signal(false);
  private _timeoutId: ReturnType<typeof setTimeout> | null = null;

  /* ── Icon name (reactive) ── */
  get iconName(): IconName {
    if (this.confirmed() && this.behaviour() === 'minimal') return 'tick-circle';
    return 'copy';
  }

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;

  @HostBinding('class.copier--keyboard-focused')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

  @HostListener('keydown.enter') onEnter(): void { this.copy(); }
  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    this.copy();
  }
  @HostListener('click') onClick(): void { this.copy(); }
  @HostListener('blur') onBlur(): void { this._keyboardFocused = false; }
  @HostListener('mousedown') onMouseDown(): void { this._keyboardFocused = false; }

  @HostListener('document:keydown.tab')
  @HostListener('document:keydown.shift.tab')
  onTabKey(): void { this._keyboardFocused = true; }

  /* ── Copy action ── */
  async copy(): Promise<void> {
    if (this.confirmed() || this.exiting()) return;

    try {
      await navigator.clipboard.writeText(this.value());
    } catch {
      /* Fallback: silent fail — clipboard may be blocked in iframes */
    }

    this.confirmed.set(true);
    this.copied.emit();

    const dwell = this.behaviour() === 'minimal' ? 600 : 1200;
    this._timeoutId = setTimeout(() => {
      /* Phase 2: exit — text slides UP and out, width collapses */
      this.confirmed.set(false);
      this.exiting.set(true);

      /* Phase 3: after exit transition (300ms), snap back to idle */
      setTimeout(() => {
        this.exiting.set(false);
      }, 300);

      this._timeoutId = null;
    }, dwell);
  }
}
