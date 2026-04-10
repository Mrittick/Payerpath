import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./screens/global/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'signed-out',
    loadComponent: () =>
      import('./screens/global/signed-out/signed-out.component').then(m => m.SignedOutComponent),
  },
  {
    // Authenticated app shell — header + navbar + router-outlet for all sections.
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./screens/global/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        pathMatch: 'full',
        loadComponent: () =>
          import('./screens/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'claims',
        loadChildren: () =>
          import('./screens/claims/claims.routes').then(m => m.claimsRoutes),
      },
      {
        path: 'patients',
        loadChildren: () =>
          import('./screens/patients/patients.routes').then(m => m.patientsRoutes),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./screens/reports/reports.routes').then(m => m.reportsRoutes),
      },
      {
        path: 'maintenance',
        loadChildren: () =>
          import('./screens/maintenance/maintenance.routes').then(m => m.maintenanceRoutes),
      },
      {
        path: 'resources',
        loadChildren: () =>
          import('./screens/resources/resources.routes').then(m => m.resourcesRoutes),
      },
      {
        path: 'analytics',
        loadChildren: () =>
          import('./screens/analytics/analytics.routes').then(m => m.analyticsRoutes),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
