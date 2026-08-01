/* Figma: Hide / Show (toggle-small) — 282:2876
   40×40px compact collapse/expand button.
   Payerpath hover/pressed uses neutral greys.
   eChart Coder hover/pressed uses white-alpha primitives. */

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
  selector: 'merces-toggle-small',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './toggle-small.component.html',
  styleUrl: './toggle-small.component.css',
  host: {
    'role': 'button',
    '[attr.aria-label]': 'isCollapsed() ? "Expand navigation" : "Collapse navigation"',
    '[attr.aria-pressed]': 'isCollapsed()',
    '[tabindex]': '0',
    '[class.toggle-small--collapsed]': 'isCollapsed()',
    '[class.toggle-small--payerpath]': 'product() === "payerpath"',
    '[class.toggle-small--echart-coder]': 'product() === "echart-coder"',
    '[class.toggle-small--hovered]': '_isHovered()',
    '[class.toggle-small--pressed]': '_isPressed()',
    '[class.toggle-small--keyboard-focus]': '_keyboardFocused()',
  },
})
export class ToggleSmallComponent {

  /* ── Inputs ── */
  readonly isCollapsed = input<boolean>(false);
  readonly product     = input<NavbarProduct>('payerpath');

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
