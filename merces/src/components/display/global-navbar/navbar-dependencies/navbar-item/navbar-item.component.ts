/* Figma: Navbar Item — 957:14560
   Hover and pressed states use native CSS :hover / :active pseudo-classes so that
   browser-managed state transitions always fire smoothly. Only keyboard-focus state
   requires JS (to distinguish mouse-triggered focus from keyboard-triggered focus). */

import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';
import { IconComponent } from '../../../../../assets/icon/icon.component';
import type { IconName } from '../../../../../assets/icon/icon.types';

@Component({
  selector: 'merces-navbar-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './navbar-item.component.html',
  styleUrl: './navbar-item.component.css',
  host: {
    'role': 'button',
    '[class.navbar-item--item]': 'hierarchy() === "item"',
    '[class.navbar-item--subitem]': 'hierarchy() === "subitem"',
    '[class.navbar-item--category]': 'isCategory()',
    '[class.navbar-item--standalone]': 'type() === "standalone"',
    '[class.navbar-item--collapsed]': 'type() === "collapsed"',
    '[class.navbar-item--expanded]': 'type() === "expanded"',
    '[class.navbar-item--current]': 'isCurrent()',
    '[class.navbar-item--disabled]': 'disabled()',
    '[class.navbar-item--keyboard-focus]': '_keyboardFocused()',
    '[attr.aria-current]': 'isCurrent() ? "page" : null',
    '[attr.aria-expanded]': 'isCategory() && type() !== "standalone" ? type() === "expanded" : null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[tabindex]': 'disabled() ? -1 : 0',
  },
})
export class NavbarItemComponent {

  /* ── Inputs ── */
  readonly label      = input.required<string>();
  readonly hierarchy  = input<'item' | 'subitem'>('item');
  readonly isCategory = input<boolean>(false);
  /** Applies only to category items: standalone = no children. */
  readonly type       = input<'standalone' | 'collapsed' | 'expanded'>('standalone');
  readonly isCurrent  = input<boolean>(false);
  readonly disabled   = input<boolean>(false);
  /** merces-icon name — provided only for category items. */
  readonly icon       = input<IconName | undefined>(undefined);
  /** Icon style variant — switches regular → filled when category is expanded. */
  readonly iconType   = input<'regular' | 'filled'>('regular');

  /* ── Output ── */
  readonly itemClick = output<void>();

  /* ── Internal state ── */
  /** Keyboard-focus ring is JS-driven to suppress it on mouse clicks. */
  protected readonly _keyboardFocused = signal(false);

  /** Transient flag — suppresses keyboard-focus ring when focus arrives via mouse. */
  private _focusFromMouse = false;

  /* ── Host listeners ── */
  @HostListener('mousedown')
  onMouseDown(): void {
    // Only track that focus is arriving via mouse — visual pressed state is CSS :active.
    this._focusFromMouse = true;
  }

  @HostListener('focus')
  onFocus(): void {
    this._keyboardFocused.set(!this._focusFromMouse);
    this._focusFromMouse = false;
  }

  @HostListener('blur')
  onBlur(): void {
    this._keyboardFocused.set(false);
  }

  @HostListener('click')
  onClick(): void {
    this._emitIfEnabled();
  }

  @HostListener('keydown.enter')
  onEnter(): void {
    this._emitIfEnabled();
  }

  @HostListener('keydown.space', ['$event'])
  onSpace(event: Event): void {
    event.preventDefault();
    this._emitIfEnabled();
  }

  private _emitIfEnabled(): void {
    if (!this.disabled()) {
      this.itemClick.emit();
    }
  }
}
