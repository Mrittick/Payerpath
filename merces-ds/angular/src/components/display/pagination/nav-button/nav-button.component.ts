import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  HostListener,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';
import type { IconName } from '../../../../assets/icon/icon.types';

export type NavButtonType = 'start' | 'previous' | 'next' | 'end';

const ICON_MAP: Record<NavButtonType, IconName> = {
  start:    'chevron-left-strong',
  previous: 'chevron-left',
  next:     'chevron-right',
  end:      'chevron-right-strong',
};

const LABEL_MAP: Record<NavButtonType, string> = {
  start:    'First page',
  previous: 'Previous page',
  next:     'Next page',
  end:      'Last page',
};

@Component({
  selector: 'merces-nav-button',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './nav-button.component.html',
  styleUrl: './nav-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]':         '"button"',
    '[attr.tabindex]':     'disabled() ? "-1" : "0"',
    '[attr.aria-label]':   'ariaLabel()',
    '[attr.aria-disabled]':'disabled() ? "true" : null',
    '[class.nav-button--disabled]':        'disabled()',
    '[class.nav-button--keyboard-focused]':'_keyboardFocused',
    '[class.nav-button--pressed]':         '_pressed',
  },
})
export class NavButtonComponent {
  readonly type     = input<NavButtonType>('next');
  readonly disabled = input<boolean>(false);
  readonly label    = input<string | undefined>(undefined);

  readonly pressed = output<void>();

  readonly iconName  = computed<IconName>(() => ICON_MAP[this.type()]);
  readonly ariaLabel = computed(() => this.label() ?? LABEL_MAP[this.type()]);

  _keyboardFocused = false;
  _pressed = false;

  @HostListener('click') onClick(): void {
    if (!this.disabled()) this.pressed.emit();
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKey(e: Event): void {
    if (!this.disabled()) { e.preventDefault(); this.pressed.emit(); }
  }

  @HostListener('mousedown') onMousedown(): void { if (!this.disabled()) this._pressed = true; }
  @HostListener('mouseup')   onMouseup():   void { this._pressed = false; }
  @HostListener('mouseleave') onLeave():    void { this._pressed = false; }

  @HostListener('focus')
  onFocus(): void { }

  @HostListener('blur')
  onBlur(): void { this._keyboardFocused = false; }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Tab') return;
    this._keyboardFocused = true;
  }

  @HostListener('mousedown', ['$event'])
  onMousedownCapture(): void { this._keyboardFocused = false; }
}
