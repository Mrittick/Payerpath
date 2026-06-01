import { Routes } from '@angular/router';

export const patientsRoutes: Routes = [
  { path: 'appointment-reminders', loadComponent: () =>
    import('./appointment-reminders/appointment-reminders.component').then(m => m.AppointmentRemindersComponent) },
  { path: 'eligibility-check', loadComponent: () =>
    import('./eligibility-check/eligibility-check.component').then(m => m.EligibilityCheckComponent) },
  { path: 'checkin-payment-collection', loadComponent: () =>
    import('./checkin-payment-collection/checkin-payment-collection.component').then(m => m.CheckinPaymentCollectionComponent) },
  { path: 'patient-demographics', loadComponent: () =>
    import('./patient-demographics/patient-demographics.component').then(m => m.PatientDemographicsComponent) },
  { path: 'payment-portal', loadComponent: () =>
    import('./payment-portal/payment-portal.component').then(m => m.PaymentPortalComponent) },
  { path: 'payment-assurance', loadComponent: () =>
    import('./payment-assurance/payment-assurance.component').then(m => m.PaymentAssuranceComponent) },
];
