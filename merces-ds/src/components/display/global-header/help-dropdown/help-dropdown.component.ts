import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  viewChild,
  HostListener,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';
import { DropdownComponent } from '../../../inputs-and-interactive/dropdown/dropdown-standalone/dropdown.component';
import { DropdownItemComponent } from '../../../inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-item/dropdown-item.component';

@Component({
  selector: 'merces-help-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, DropdownComponent, DropdownItemComponent],
  templateUrl: './help-dropdown.component.html',
  styleUrl: './help-dropdown.component.css',
  host: {
    'role':                'button',
    '[attr.aria-expanded]': '_isOpen()',
    '[attr.aria-haspopup]': '"menu"',
    '[tabindex]':           '0',
    '[class.help-dropdown--hovered]': '_isHovered()',
    '[class.help-dropdown--pressed]': '_isPressed()',
    '[class.help-dropdown--open]':    '_isOpen()',
  },
})
export class HelpDropdownComponent {

  /* ── Panel reference ── */
  private readonly _dropdown = viewChild.required(DropdownComponent);

  readonly helpHref = input<string>('https://veradigm.com/support/');
  readonly contactSupportHref = input<string>('mailto:mrittick.choudhury@veradigm.com');

  protected readonly _isHovered = signal(false);
  protected readonly _isPressed = signal(false);
  protected readonly _isOpen    = signal(false);

  /* ── Mouse interaction ── */
  @HostListener('mouseenter')
  onMouseEnter(): void { this._isHovered.set(true); }

  @HostListener('mouseleave')
  onMouseLeave(): void { this._isHovered.set(false); this._isPressed.set(false); }

  @HostListener('mousedown')
  onMouseDown(): void { this._isPressed.set(true); }

  @HostListener('mouseup')
  onMouseUp(): void {
    this._isPressed.set(false);
    this._dropdown().toggle();
  }

  /* ── Keyboard interaction ── */
  @HostListener('keydown.enter', ['$event'])
  onEnter(e: Event): void { e.preventDefault(); this._dropdown().toggle(); }

  @HostListener('keydown.space', ['$event'])
  onSpace(e: Event): void { e.preventDefault(); this._dropdown().toggle(); }

  @HostListener('keydown.escape')
  onEscape(): void { this._dropdown().close(); }

  protected onHelp(): void {
    window.open(this.helpHref(), '_blank', 'noopener,noreferrer');
  }

  protected onContactSupport(): void {
    window.open(this.contactSupportHref(), '_blank', 'noopener,noreferrer');
  }
}
