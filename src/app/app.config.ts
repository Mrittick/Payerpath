import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation, withViewTransitions } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { mockInterceptor } from './interceptors/mock.interceptor';
import { AuthService } from './services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // mockInterceptor must come first — it short-circuits all /api/* requests
    // on GitHub Pages before tokenInterceptor attempts to attach Bearer tokens.
    provideHttpClient(withInterceptors([mockInterceptor, tokenInterceptor])),
    provideRouter(routes, withViewTransitions()),
    {
      provide:    APP_INITIALIZER,
      useFactory: (auth: AuthService) => () => lastValueFrom(auth.initialize()),
      deps:       [AuthService],
      multi:      true,
    },
  ],
};
