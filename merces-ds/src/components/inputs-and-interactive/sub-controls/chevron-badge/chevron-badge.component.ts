import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  HostBinding,
  HostListener,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';
import { IconName } from '../../../../assets/icon/icon.types';

export type ChevronBadgeSize      = 'huge' | 'large' | 'base';
export type ChevronBadgeDirection  = 'up' | 'down' | 'left' | 'right';
export type ChevronBadgeState      = 'default' | 'active' | 'disabled' | 'hidden';

const DIRECTION_ICON_MAP: Record<ChevronBadgeDirection, IconName> = {
  up:    'chevron-up',
  down:  'chevron-down',
  left:  'chevron-left',
  right: 'chevron-right',
};

@Component({
  selector: 'merces-chevron-badge',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './chevron-badge.component.html',
  styleUrl: './chevron-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.cb--huge]':      'size() === "huge"',
    '[class.cb--large]':     'size() === "large"',
    '[class.cb--base]':      'size() === "base"',
    '[class.cb--active]':    'state() === "active"',
    '[class.cb--disabled]':  'state() === "disabled"',
    '[class.cb--hidden]':    'state() === "hidden"',
    '[attr.aria-disabled]':  'state() === "disabled" ? "true" : null',
    'role': 'button',
    '[tabindex]': 'state() === "disabled" || state() === "hidden" ? -1 : 0',
  },
})
export class ChevronBadgeComponent {
  /* ── Inputs ── */
  readonly size      = input<ChevronBadgeSize>('huge');
  readonly direction = input<ChevronBadgeDirection>('down');
  readonly state     = input<ChevronBadgeState>('default');

  /* ── Output ── */
  readonly pressed = output<void>();

  /* ── Computed ── */
  readonly iconName = computed<IconName>(() => DIRECTION_ICON_MAP[this.direction()]);

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;

  @HostBinding('class.cb--keyboard-focused')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

  @HostListener('keydown.enter') onEnter(): void { this._emitIfEnabled(); }
  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    this._emitIfEnabled();
  }
  @HostListener('click') onClick(): void { this._emitIfEnabled(); }
  @HostListener('blur') onBlur(): void { this._keyboardFocused = false; }
  @HostListener('mousedown') onMouseDown(): void {
    this._keyboardFocused = false;
  }

  @HostListener('document:keydown.tab')
  @HostListener('document:keydown.shift.tab')
  onTabKey(): void { this._keyboardFocused = true; }

  private _emitIfEnabled(): void {
    if (this.state() !== 'disabled' && this.state() !== 'hidden') {
      this.pressed.emit();
    }
  }
}
