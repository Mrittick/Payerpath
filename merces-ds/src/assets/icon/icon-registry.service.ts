import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of, tap, map, catchError, shareReplay } from 'rxjs';
import { IconName, IconType, ICON_TYPE_MAP } from './icon.types';

@Injectable({ providedIn: 'root' })
export class IconRegistryService {
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cache = new Map<string, Observable<SafeHtml>>();

  getIcon(name: IconName, type: IconType): Observable<SafeHtml> {
    const key = `${name}/${type}`;

    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    const availableTypes = ICON_TYPE_MAP[name];
    if (!availableTypes?.includes(type)) {
      console.warn(
        `[merces-icon] Icon "${name}" does not have type "${type}". Available: ${availableTypes?.join(', ') ?? 'none'}`
      );
      return of(this.sanitizer.bypassSecurityTrustHtml(''));
    }

    const url = `assets/icon/svg/${name}/${type}.svg`;
    const request$ = this.http.get(url, { responseType: 'text' }).pipe(
      map((svg) => this.sanitizer.bypassSecurityTrustHtml(svg)),
      catchError(() => {
        console.warn(`[merces-icon] Failed to load icon: ${key}`);
        return of(this.sanitizer.bypassSecurityTrustHtml(''));
      }),
      shareReplay(1)
    );

    this.cache.set(key, request$);
    return request$;
  }
}
