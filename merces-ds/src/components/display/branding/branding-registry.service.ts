import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of, map, catchError, shareReplay } from 'rxjs';
import { BrandingProduct, BrandingStacking, BrandingType } from './branding.types';

@Injectable({ providedIn: 'root' })
export class BrandingRegistryService {
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cache = new Map<string, Observable<SafeHtml>>();

  getBranding(
    product: BrandingProduct,
    stacking: BrandingStacking,
    type: BrandingType,
  ): Observable<SafeHtml> {
    const variant = type === 'default' ? 'default' : 'mono';
    const key = `${product}/${stacking}-${variant}`;

    const cached = this.cache.get(key);
    if (cached) return cached;

    const url = `assets/motifs/${product}/${stacking}-${variant}.svg`;
    const request$ = this.http.get(url, { responseType: 'text' }).pipe(
      map((svg) => this.sanitizer.bypassSecurityTrustHtml(svg)),
      catchError(() => {
        console.warn(`[merces-branding] Failed to load branding asset: ${key}`);
        return of(this.sanitizer.bypassSecurityTrustHtml(''));
      }),
      shareReplay(1),
    );

    this.cache.set(key, request$);
    return request$;
  }
}
