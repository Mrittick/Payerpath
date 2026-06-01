import { Component, ChangeDetectionStrategy, OnInit, inject, computed, signal, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { GlobalHeaderComponent } from '@merces/components/display/global-header/global-header.component';
import { GlobalNavbarComponent } from '@merces/components/display/global-navbar/global-navbar.component';
import type { NavbarPage } from '@merces/components/display/global-navbar/global-navbar.types';
import { UserRole } from '@merces/components/display/uac/uac.types';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'payerpath-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, GlobalHeaderComponent, GlobalNavbarComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent implements OnInit {
  private readonly auth       = inject(AuthService);
  private readonly router     = inject(Router);
  private readonly userSvc    = inject(UserService);
  private readonly http       = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly user     = this.userSvc.currentUser;
  protected readonly userName = computed(() => this.user()?.name  ?? '');
  protected readonly userRole = computed(() => (this.user()?.role ?? 'admin') as UserRole);

  protected readonly navCollapsed = signal(false);

  // Derive the active page ID from the URL — the router is the single source of truth.
  private readonly _url = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects.split('?')[0]),
      startWith(this.router.url.split('?')[0]),
    ),
    { initialValue: this.router.url.split('?')[0] },
  );

  protected readonly currentPageId = computed(() => {
    const parts = this._url().split('/').filter(Boolean);
    // '/dashboard'            → 'dashboard'
    // '/:categoryId/:pageId'  → 'categoryId/pageId'  e.g. 'reports/remittances'
    if (parts[0] === 'dashboard' || parts.length < 2) return 'dashboard';
    return `${parts[0]}/${parts[1]}`;
  });

  private static readonly ALL_PAGES: Omit<NavbarPage, 'isCurrent'>[] = [
    // Claims
    { id: 'claim-attachments',       label: 'Claim Attachments',         categoryId: 'claims'      },
    { id: 'codecheck-defaults',      label: 'CodeCheck Defaults',        categoryId: 'claims'      },
    { id: 'reconcile-batch',         label: 'Reconcile by Batch',        categoryId: 'claims'      },
    { id: 'upload-claims',           label: 'Upload Claims',             categoryId: 'claims'      },
    { id: 'view-claims',             label: 'View Claims',               categoryId: 'claims'      },
    { id: 'workers-comp',            label: "Workers' Comp",             categoryId: 'claims'      },
    // Patients
    { id: 'appointment-reminders',        label: 'Appointment Reminders',         categoryId: 'patients' },
    { id: 'eligibility-check',            label: 'Eligibility Check',             categoryId: 'patients' },
    { id: 'checkin-payment-collection',   label: 'Check-in / Payment Collection', categoryId: 'patients' },
    { id: 'patient-demographics',         label: 'Patient Demographics',          categoryId: 'patients' },
    { id: 'payment-portal',               label: 'Payment Portal',                categoryId: 'patients' },
    { id: 'payment-assurance',            label: 'Payment Assurance',             categoryId: 'patients' },
    // Reports
    { id: 'audit-trail',             label: 'Audit Trail Report',        categoryId: 'reports'     },
    { id: 'billing-summary',         label: 'Billing Summary',           categoryId: 'reports'     },
    { id: 'claim-age',               label: 'Claim Age',                 categoryId: 'reports'     },
    { id: 'era-optimisation',        label: 'ERA Optimisation',          categoryId: 'reports'     },
    { id: 'error-trend',             label: 'Error Trend',               categoryId: 'reports'     },
    { id: 'offline-reports',         label: 'Offline Reports List',      categoryId: 'reports'     },
    { id: 'payer-rejects',           label: 'Payer Rejects',             categoryId: 'reports'     },
    { id: 'payer-rejects-workflow',  label: 'Payer Rejects Workflow',    categoryId: 'reports'     },
    { id: 'payer-responses',         label: 'Payer Responses',           categoryId: 'reports'     },
    { id: 'remittances',             label: 'Remittances',               categoryId: 'reports'     },
    { id: 'transmitted-claim',       label: 'Transmitted Claim',         categoryId: 'reports'     },
    { id: 'upload-detail',           label: 'Upload Detail',             categoryId: 'reports'     },
    { id: 'upload-reconciliation',   label: 'Upload Reconciliation',     categoryId: 'reports'     },
    { id: 'upload-summary',          label: 'Upload Summary',            categoryId: 'reports'     },
    // Maintenance
    { id: 'edit-claim-defaults',     label: 'Edit Claim Defaults',       categoryId: 'maintenance' },
    { id: 'integrated-edits',        label: 'Integrated Edits Password', categoryId: 'maintenance' },
    { id: 'payer-table',             label: 'Payer Table',               categoryId: 'maintenance' },
    { id: 'profile-maintenance',     label: 'Profile Maintenance',       categoryId: 'maintenance' },
    { id: 'user-maintenance',        label: 'User Maintenance',          categoryId: 'maintenance' },
    { id: 'provider-maintenance',    label: 'Provider Maintenance',      categoryId: 'maintenance' },
    { id: 'master-payer-list',       label: 'View Master Payer List',    categoryId: 'maintenance' },
    { id: 'view-messages',           label: 'View Messages',             categoryId: 'maintenance' },
    // Resources
    { id: 'client-portal',           label: 'Client Portal',             categoryId: 'resources'   },
    { id: 'elearning',               label: 'eLearning',                 categoryId: 'resources'   },
    { id: 'knowledge-center',        label: 'Knowledge Center',          categoryId: 'resources'   },
    { id: 'user-guide',              label: 'User Guide — Professional', categoryId: 'resources'   },
    // Analytics
    { id: 'remittances',             label: 'Remittances',               categoryId: 'analytics'   },
    { id: 'account-receivables',     label: 'Account Receivables',       categoryId: 'analytics'   },
    { id: 'appointment-productivity', label: 'Appointment Productivity',  categoryId: 'analytics'   },
  ];

  protected readonly navPages = computed<NavbarPage[]>(() =>
    ShellComponent.ALL_PAGES.map(p => ({
      ...p,
      isCurrent: `${p.categoryId}/${p.id}` === this.currentPageId(),
    }))
  );

  protected onPageSelected(compound: string): void {
    // Standalone categories (e.g. Dashboard) emit just the categoryId.
    // Sub-pages emit 'categoryId/pageId' (from _onPageClick in the navbar).
    if (compound === 'dashboard') {
      this.router.navigate(['/dashboard']);
      return;
    }
    const [categoryId, pageId] = compound.split('/');
    if (categoryId && pageId) {
      this.router.navigate(['/', categoryId, pageId]);
    }
  }

  // Blob URL created from an authenticated avatar fetch — never a raw API URL
  private readonly _avatarBlobUrl = signal<string | undefined>(undefined);
  protected readonly userAvatar   = this._avatarBlobUrl.asReadonly();

  ngOnInit(): void {
    this.userSvc.loadCurrentUser().subscribe({
      next: user => {
        if (!user.avatarUrl) {
          console.warn('[ShellComponent] No avatarUrl in user response — backend may need a restart.');
          return;
        }
        // HttpClient includes the Bearer token via the token interceptor,
        // so the avatar endpoint is called with full authentication.
        this.http.get(user.avatarUrl, { responseType: 'blob' }).subscribe({
          next: blob => {
            const prev = this._avatarBlobUrl();
            if (prev) URL.revokeObjectURL(prev);
            this._avatarBlobUrl.set(URL.createObjectURL(blob));
          },
          error: err => console.error('[ShellComponent] Avatar fetch failed:', err),
        });
      },
      error: err => console.error('[ShellComponent] loadCurrentUser failed:', err),
    });

    // Release the blob URL when this screen is destroyed to avoid memory leaks.
    this.destroyRef.onDestroy(() => {
      const url = this._avatarBlobUrl();
      if (url) URL.revokeObjectURL(url);
    });
  }

  protected onSignOut(): void {
    this.auth.logout();
    this.router.navigate(['/signed-out']);
  }
}
