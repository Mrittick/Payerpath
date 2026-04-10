import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withViewTransitions } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { AuthService } from './services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideRouter(routes, withViewTransitions()),
    {
      provide:    APP_INITIALIZER,
      useFactory: (auth: AuthService) => () => lastValueFrom(auth.initialize()),
      deps:       [AuthService],
      multi:      true,
    },
  ],
};
