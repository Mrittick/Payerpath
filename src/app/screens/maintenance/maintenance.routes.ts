import { Routes } from '@angular/router';

export const maintenanceRoutes: Routes = [
  { path: 'edit-claim-defaults', loadComponent: () =>
    import('./edit-claim-defaults/edit-claim-defaults.component').then(m => m.EditClaimDefaultsComponent) },
  { path: 'integrated-edits', loadComponent: () =>
    import('./integrated-edits/integrated-edits.component').then(m => m.IntegratedEditsComponent) },
  { path: 'payer-table', loadComponent: () =>
    import('./payer-table/payer-table.component').then(m => m.PayerTableComponent) },
  { path: 'profile-maintenance', loadComponent: () =>
    import('./profile-maintenance/profile-maintenance.component').then(m => m.ProfileMaintenanceComponent) },
  { path: 'user-maintenance', loadComponent: () =>
    import('./user-maintenance/user-maintenance.component').then(m => m.UserMaintenanceComponent) },
  { path: 'provider-maintenance', loadComponent: () =>
    import('./provider-maintenance/provider-maintenance.component').then(m => m.ProviderMaintenanceComponent) },
  { path: 'master-payer-list', loadComponent: () =>
    import('./master-payer-list/master-payer-list.component').then(m => m.MasterPayerListComponent) },
  { path: 'view-messages', loadComponent: () =>
    import('./view-messages/view-messages.component').then(m => m.ViewMessagesComponent) },
];
