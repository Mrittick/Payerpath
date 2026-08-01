import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  signal,
  effect,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SafeHtml } from '@angular/platform-browser';
import { BrandingRegistryService } from './branding-registry.service';
import { BrandingProduct, BrandingStacking, BrandingType } from './branding.types';

@Component({
  selector: 'merces-branding',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './branding.component.html',
  styleUrl: './branding.component.css',
  host: {
    '[attr.aria-label]': 'label() || null',
    '[attr.aria-hidden]': 'label() ? null : "true"',
    'role': 'img',
    /* ── Stacking ── */
    '[class.branding--horizontal]': 'stacking() === "horizontal"',
    '[class.branding--vertical]': 'stacking() === "vertical"',
    /* ── Type ── */
    '[class.branding--default]': 'type() === "default"',
    '[class.branding--black]': 'type() === "black"',
    '[class.branding--white]': 'type() === "white"',
    '[class.branding--purple]': 'type() === "purple"',
  },
})
export class BrandingComponent {
  readonly product = input<BrandingProduct>('payerpath');
  readonly stacking = input<BrandingStacking>('horizontal');
  readonly type = input<BrandingType>('default');
  readonly label = input<string | undefined>(undefined);

  private readonly registry = inject(BrandingRegistryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly svgContent = signal<SafeHtml>('');

  constructor() {
    effect(() => {
      const product = this.product();
      const stacking = this.stacking();
      const type = this.type();

      this.registry
        .getBranding(product, stacking, type)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((svg) => this.svgContent.set(svg));
    });
  }
}
