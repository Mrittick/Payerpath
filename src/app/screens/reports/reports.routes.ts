import { Routes } from '@angular/router';

export const reportsRoutes: Routes = [
  { path: 'audit-trail', loadComponent: () =>
    import('./audit-trail/audit-trail.component').then(m => m.AuditTrailComponent) },
  { path: 'billing-summary', loadComponent: () =>
    import('./billing-summary/billing-summary.component').then(m => m.BillingSummaryComponent) },
  { path: 'claim-age', loadComponent: () =>
    import('./claim-age/claim-age.component').then(m => m.ClaimAgeComponent) },
  { path: 'era-optimisation', loadComponent: () =>
    import('./era-optimisation/era-optimisation.component').then(m => m.EraOptimisationComponent) },
  { path: 'error-trend', loadComponent: () =>
    import('./error-trend/error-trend.component').then(m => m.ErrorTrendComponent) },
  { path: 'offline-reports', loadComponent: () =>
    import('./offline-reports/offline-reports.component').then(m => m.OfflineReportsComponent) },
  { path: 'payer-rejects', loadComponent: () =>
    import('./payer-rejects/payer-rejects.component').then(m => m.PayerRejectsComponent) },
  { path: 'payer-rejects-workflow', loadComponent: () =>
    import('./payer-rejects-workflow/payer-rejects-workflow.component').then(m => m.PayerRejectsWorkflowComponent) },
  { path: 'payer-responses', loadComponent: () =>
    import('./payer-responses/payer-responses.component').then(m => m.PayerResponsesComponent) },
  { path: 'remittances', loadComponent: () =>
    import('./remittances/remittances.component').then(m => m.RemittancesComponent) },
  { path: 'transmitted-claim', loadComponent: () =>
    import('./transmitted-claim/transmitted-claim.component').then(m => m.TransmittedClaimComponent) },
  { path: 'upload-detail', loadComponent: () =>
    import('./upload-detail/upload-detail.component').then(m => m.UploadDetailComponent) },
  { path: 'upload-reconciliation', loadComponent: () =>
    import('./upload-reconciliation/upload-reconciliation.component').then(m => m.UploadReconciliationComponent) },
  { path: 'upload-summary', loadComponent: () =>
    import('./upload-summary/upload-summary.component').then(m => m.UploadSummaryComponent) },
];
