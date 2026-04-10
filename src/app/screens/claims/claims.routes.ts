import { Routes } from '@angular/router';

export const claimsRoutes: Routes = [
  { path: 'claim-attachments', loadComponent: () =>
    import('./claim-attachments/claim-attachments.component').then(m => m.ClaimAttachmentsComponent) },
  { path: 'codecheck-defaults', loadComponent: () =>
    import('./codecheck-defaults/codecheck-defaults.component').then(m => m.CodeCheckDefaultsComponent) },
  { path: 'reconcile-batch', loadComponent: () =>
    import('./reconcile-batch/reconcile-batch.component').then(m => m.ReconcileBatchComponent) },
  { path: 'upload-claims', loadComponent: () =>
    import('./upload-claims/upload-claims.component').then(m => m.UploadClaimsComponent) },
  { path: 'view-claims', loadComponent: () =>
    import('./view-claims/view-claims.component').then(m => m.ViewClaimsComponent) },
  { path: 'workers-comp', loadComponent: () =>
    import('./workers-comp/workers-comp.component').then(m => m.WorkersCompComponent) },
];
