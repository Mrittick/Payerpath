import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  HostListener,
  ElementRef,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { IconComponent } from '@merces/assets/icon/icon.component';
import { StringfieldPlainComponent } from '@merces/components/data-entry/stringfield-plain/stringfield-plain.component';
import { StringfieldPlainGroupComponent } from '@merces/components/data-entry/stringfield-plain/stringfield-plain-group/stringfield-plain-group.component';
import type { StringfieldValidationState } from '@merces/components/data-entry/stringfield-plain/stringfield-plain.types';
import { StringfieldSecureComponent } from '@merces/components/data-entry/stringfield-secure/stringfield-secure.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'payerpath-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, StringfieldPlainComponent, StringfieldPlainGroupComponent, StringfieldSecureComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);
  private readonly _el    = inject(ElementRef);

  protected readonly email    = signal('');
  protected readonly username = signal('');
  protected readonly password = signal('');
  protected readonly loading  = signal(false);

  protected readonly emailValidation    = signal<StringfieldValidationState>('valid');
  protected readonly usernameValidation = signal<StringfieldValidationState>('valid');
  protected readonly passwordValidation = signal<StringfieldValidationState>('valid');
  protected readonly emailMessage       = signal('');
  protected readonly usernameMessage    = signal('');
  protected readonly passwordMessage    = signal('');
  protected readonly formValidationText = signal('');

  // Fire submit when Enter is pressed and focus is outside the form
  @HostListener('document:keydown.enter')
  onGlobalEnter(): void {
    if (this.loading()) return;
    const active = document.activeElement;
    if (!this._el.nativeElement.contains(active)) {
      this.onSubmit();
    }
  }

  protected onSubmit(): void {
    if (this.loading()) return;

    this.emailValidation.set('valid');
    this.usernameValidation.set('valid');
    this.passwordValidation.set('valid');
    this.emailMessage.set('');
    this.usernameMessage.set('');
    this.passwordMessage.set('');
    this.formValidationText.set('');

    const emailBlank    = !this.email();
    const usernameBlank = !this.username();
    const passwordBlank = !this.password();

    if (emailBlank) {
      this.emailValidation.set('error');
      this.emailMessage.set('Email cannot be blank.');
    }
    if (usernameBlank) {
      this.usernameValidation.set('error');
      this.usernameMessage.set('Username cannot be blank.');
    }
    if (passwordBlank) {
      this.passwordValidation.set('error');
      this.passwordMessage.set('Password cannot be blank.');
    }
    if (emailBlank || usernameBlank || passwordBlank) {
      this.formValidationText.set('Please fill out all fields to continue.');
      return;
    }

    this.loading.set(true);
    this.auth.login(this.email(), this.username(), this.password()).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err: HttpErrorResponse) => {
        const code: string   = err.error?.code   ?? '';
        const fields: Record<string, string> = err.error?.fields ?? {};

        if (err.status === 0 || err.status >= 500) {
          this.formValidationText.set('Our systems are experiencing a temporary hiccup, we\'ll be back shortly.\nAny inconvenience is deeply regretted.');
        } else if (code === 'FIELD_ERRORS') {
          if (fields['email']) {
            this.emailValidation.set('error');
            this.emailMessage.set(
              "Email isn't registered, or is blocked.\nPlease contact your admin, or support team."
            );
          }
          if (fields['username']) {
            this.usernameValidation.set('error');
            this.usernameMessage.set(
              "User doesn't exist, or is disabled.\nPlease contact your admin, or support team."
            );
          }
        } else {
          this.passwordValidation.set('error');
          this.passwordMessage.set('Unable to verify credentials, please try again.');
        }
        this.loading.set(false);
      },
    });
  }
}
