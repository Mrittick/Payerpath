import { Routes } from '@angular/router';

export const analyticsRoutes: Routes = [
  { path: 'remittances', loadComponent: () =>
    import('./remittances/remittances.component').then(m => m.AnalyticsRemittancesComponent) },
  { path: 'account-receivables', loadComponent: () =>
    import('./account-receivables/account-receivables.component').then(m => m.AccountReceivablesComponent) },
  { path: 'appointment-productivity', loadComponent: () =>
    import('./appointment-productivity/appointment-productivity.component').then(m => m.AppointmentProductivityComponent) },
];
