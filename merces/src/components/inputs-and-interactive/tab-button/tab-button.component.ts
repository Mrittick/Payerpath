import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';

import type { TabButtonSize, TabButtonHierarchy } from './tab-button.types';

@Component({
  selector: 'merces-tab-button',
  standalone: true,
  imports: [],
  templateUrl: './tab-button.component.html',
  styleUrl: './tab-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.tab-button--size-base]': 'size() === "base"',
    '[class.tab-button--size-mini]': 'size() === "mini"',
    '[class.tab-button--hierarchy-level-01]': 'hierarchy() === "level-01"',
    '[class.tab-button--hierarchy-level-02]': 'hierarchy() === "level-02"',
    '[class.tab-button--current]': 'isCurrent()',
    '[class.tab-button--pressed]': '_visuallyPressed()',
    '[class.tab-button--disabled]': 'disabled()',
    '[attr.role]': '"tab"',
    '[attr.aria-selected]': 'isCurrent()',
    '[attr.tabindex]': '0',
  },
})
export class TabButtonComponent {

  /* ── Inputs ── */

  readonly size = input<TabButtonSize>('base');
  readonly hierarchy = input<TabButtonHierarchy>('level-01');
  readonly label = input<string>('Tab item');
  readonly isCurrent = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  /* ── Output ── */

  readonly pressed = output<void>();

  /* ── Press state (minimum visual duration) ── */

  readonly _visuallyPressed = signal(false);
  private _pressTimer: ReturnType<typeof setTimeout> | null = null;
  private _pressStart = 0;
  private static readonly MIN_PRESS_MS = 200;

  onPointerDown(): void {
    if (this.disabled() || this.isCurrent()) return;
    this._pressStart = Date.now();
    if (this._pressTimer) {
      clearTimeout(this._pressTimer);
      this._pressTimer = null;
    }
    this._visuallyPressed.set(true);
  }

  onPointerUp(): void {
    if (!this._visuallyPressed()) return;
    const elapsed = Date.now() - this._pressStart;
    const remaining = TabButtonComponent.MIN_PRESS_MS - elapsed;
    if (remaining > 0) {
      this._pressTimer = setTimeout(() => this._visuallyPressed.set(false), remaining);
    } else {
      this._visuallyPressed.set(false);
    }
  }

  onClick(): void {
    if (this.disabled()) return;
    this.pressed.emit();
  }

  /* ── Keyboard ── */

  @HostListener('keydown.enter')
  @HostListener('keydown.space', ['$event'])
  onKeyActivate(event?: Event): void {
    event?.preventDefault();
    if (this.disabled()) return;
    this.pressed.emit();
  }
}
