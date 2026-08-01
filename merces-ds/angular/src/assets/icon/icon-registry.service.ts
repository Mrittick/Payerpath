import { Injectable, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICON_SVG_MAP } from './icon-map';
import { IconName, IconType } from './icon.types';

@Injectable({ providedIn: 'root' })
export class IconRegistryService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cache = new Map<string, SafeHtml>();

  getIcon(name: IconName, type: IconType): SafeHtml {
    const key = `${name}/${type}`;

    const cached = this.cache.get(key);
    if (cached) return cached;

    const svg = ICON_SVG_MAP[key];
    if (!svg) {
      console.warn(`[merces-icon] Icon not found: "${name}/${type}"`);
      const empty = this.sanitizer.bypassSecurityTrustHtml('');
      this.cache.set(key, empty);
      return empty;
    }

    const safe = this.sanitizer.bypassSecurityTrustHtml(svg);
    this.cache.set(key, safe);
    return safe;
  }
}
