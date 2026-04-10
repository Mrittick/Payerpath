import { Routes } from '@angular/router';

export const patientsRoutes: Routes = [
  { path: 'patient-demographics', loadComponent: () =>
    import('./patient-demographics/patient-demographics.component').then(m => m.PatientDemographicsComponent) },
];
