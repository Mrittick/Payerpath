import { Routes } from '@angular/router';

export const resourcesRoutes: Routes = [
  { path: 'client-portal', loadComponent: () =>
    import('./client-portal/client-portal.component').then(m => m.ClientPortalComponent) },
  { path: 'elearning', loadComponent: () =>
    import('./elearning/elearning.component').then(m => m.ElearningComponent) },
  { path: 'knowledge-center', loadComponent: () =>
    import('./knowledge-center/knowledge-center.component').then(m => m.KnowledgeCenterComponent) },
  { path: 'user-guide', loadComponent: () =>
    import('./user-guide/user-guide.component').then(m => m.UserGuideComponent) },
];
