import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { BrandingComponent } from '../branding/branding.component';
import { DropdownComponent } from '../../inputs-and-interactive/dropdown/dropdown-standalone/dropdown.component';
import { DropdownItemComponent } from '../../inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-item/dropdown-item.component';
import { UacComponent } from '../uac/uac.component';
import { DateDisplayComponent } from './date-display/date-display.component';
import { HelpDropdownComponent } from './help-dropdown/help-dropdown.component';
import { UserRole } from '../uac/uac.types';

@Component({
  selector: 'merces-global-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BrandingComponent,
    DropdownComponent,
    DropdownItemComponent,
    UacComponent,
    DateDisplayComponent,
    HelpDropdownComponent,
  ],
  templateUrl: './global-header.component.html',
  styleUrl: './global-header.component.css',
})
export class GlobalHeaderComponent {

  /* ── UAC inputs ── */
  readonly name      = input.required<string>();
  readonly role      = input.required<UserRole>();
  readonly avatarUrl = input<string | undefined>(undefined);

  /* ── Module dropdown ── */
  readonly moduleText       = input<string>('Financial');
  readonly moduleUnselected = input<boolean>(false);

  /* ── Outputs (forwarded from UAC) ── */
  readonly accountSettingsClick = output<void>();
  readonly signOutClick         = output<void>();
}
