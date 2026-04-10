import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  input,
  output,
  viewChild,
  HostListener,
} from '@angular/core';
import { IconComponent } from '../../../assets/icon/icon.component';
import { DropdownComponent } from '../../inputs-and-interactive/dropdown/dropdown-standalone/dropdown.component';
import { DropdownActionComponent } from '../../inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-action/dropdown-action.component';
import { UserRole, USER_ROLE_LABELS } from './uac.types';

@Component({
  selector: 'merces-uac',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, DropdownComponent, DropdownActionComponent],
  templateUrl: './uac.component.html',
  styleUrl: './uac.component.css',
  host: {
    'role': 'button',
    '[attr.aria-expanded]': '_isOpen()',
    '[attr.aria-haspopup]': '"menu"',
    '[tabindex]': '0',
    '[class.uac--hovered]':      '_isHovered()',
    '[class.uac--pressed]':      '_isPressed()',
    '[class.uac--open]':         '_isOpen()',
    '[class.uac--payerpath]':    'product() === "payerpath"',
    '[class.uac--echart-coder]': 'product() === "echart-coder"',
  },
})
export class UacComponent {

  /* ── Inputs ── */
  readonly name      = input.required<string>();
  readonly role      = input.required<UserRole>();
  readonly avatarUrl = input<string | undefined>(undefined);
  readonly product   = input<'payerpath' | 'echart-coder'>('payerpath');

  /* ── Outputs ── */
  readonly accountSettingsClick = output<void>();
  readonly signOutClick         = output<void>();

  /* ── Panel reference ── */
  private readonly _dropdown = viewChild.required(DropdownComponent);

  /* ── Internal state ── */
  private readonly _EXTS = ['.jpeg', '.jpg', '.png'];

  protected readonly _isHovered  = signal(false);
  protected readonly _isPressed  = signal(false);
  protected readonly _isOpen     = signal(false);
  protected readonly _extIndex   = signal(0);

  /* ── Computed ── */
  protected readonly _avatarError = computed(() => this._extIndex() >= this._EXTS.length);

  readonly avatarSrc = computed(() => {
    const url = this.avatarUrl();
    if (!url || this._avatarError()) return null;
    if (url.startsWith('blob:')) return url;
    const base = url.replace(/\.(jpe?g|png)$/i, '');
    return base + this._EXTS[this._extIndex()];
  });

  readonly roleLabel       = computed(() => USER_ROLE_LABELS[this.role()]);
  readonly chevronIconName = computed(() =>
    this.product() === 'echart-coder' ? 'chevron-up' : 'chevron-down'
  );
  readonly dropdownAbove   = computed(() => this.product() === 'echart-coder');

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

  /* ── Avatar error — try next extension, then fall back to icon ── */
  onAvatarError(): void {
    this._extIndex.update(i => i + 1);
  }

  /* ── Dropdown actions ── */
  onAccountSettings(): void {
    this._dropdown().close();
    this.accountSettingsClick.emit();
  }

  onSignOut(): void {
    this._dropdown().close();
    this.signOutClick.emit();
  }
}
