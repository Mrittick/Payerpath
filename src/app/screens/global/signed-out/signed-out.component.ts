import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '@merces/assets/icon/icon.component';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'payerpath-signed-out',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './signed-out.component.html',
  styleUrl: './signed-out.component.css',
})
export class SignedOutComponent {
  private readonly auth   = inject(AuthService);
  private readonly users  = inject(UserService);
  private readonly router = inject(Router);

  protected onSignIn(): void {
    this.auth.logout();
    this.users.clearUser();
    this.router.navigate(['/login']);
  }
}
