/* Figma: Toggle (large) — 967:3267
   Full-height collapse/expand strip on the right edge of the global navbar.
   Payerpath: 24px wide, square.
   eChart Coder: 28px wide, 12px radius, dark purple fills. */

import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';
import { IconComponent } from '../../../../../assets/icon/icon.component';
import { NavbarProduct } from '../../global-navbar.types';

@Component({
  selector: 'merces-toggle-large',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './toggle-large.component.html',
  styleUrl: './toggle-large.component.css',
  host: {
    'role': 'button',
    '[attr.aria-label]': 'action() === "toCollapse" ? "Collapse navigation" : "Expand navigation"',
    '[tabindex]': '0',
    '[class.toggle-large--to-collapse]': 'action() === "toCollapse"',
    '[class.toggle-large--to-expand]': 'action() === "toExpand"',
    '[class.toggle-large--payerpath]': 'product() === "payerpath"',
    '[class.toggle-large--echart-coder]': 'product() === "echart-coder"',
    '[class.toggle-large--hovered]': '_isHovered()',
    '[class.toggle-large--pressed]': '_isPressed()',
    '[class.toggle-large--keyboard-focus]': '_keyboardFocused()',
  },
})
export class ToggleLargeComponent {

  /* ── Inputs ── */
  readonly action  = input<'toCollapse' | 'toExpand'>('toCollapse');
  readonly product = input<NavbarProduct>('payerpath');

  /* ── Output ── */
  readonly toggleClick = output<void>();

  /* ── Internal state ── */
  protected readonly _isHovered       = signal(false);
  protected readonly _isPressed       = signal(false);
  protected readonly _keyboardFocused = signal(false);

  private _focusFromMouse = false;

  /* ── Host listeners ── */
  @HostListener('mouseenter')
  onMouseEnter(): void { this._isHovered.set(true); }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this._isHovered.set(false);
    this._isPressed.set(false);
  }

  @HostListener('mousedown')
  onMouseDown(): void {
    this._focusFromMouse = true;
    this._isPressed.set(true);
  }

  @HostListener('mouseup')
  onMouseUp(): void { this._isPressed.set(false); }

  @HostListener('focus')
  onFocus(): void {
    this._keyboardFocused.set(!this._focusFromMouse);
    this._focusFromMouse = false;
  }

  @HostListener('blur')
  onBlur(): void {
    this._keyboardFocused.set(false);
    this._isPressed.set(false);
  }

  @HostListener('click')
  onClick(): void { this.toggleClick.emit(); }

  @HostListener('keydown.enter')
  onEnter(): void { this.toggleClick.emit(); }

  @HostListener('keydown.space', ['$event'])
  onSpace(event: Event): void {
    event.preventDefault();
    this.toggleClick.emit();
  }
}
