import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  input,
  signal,
  effect,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IconRegistryService } from './icon-registry.service';
import { IconName, IconType, IconSize } from './icon.types';
import { SafeHtml } from '@angular/platform-browser';

const SIZE_PRESETS: readonly string[] = ['huge', 'large', 'base', 'mini', 'tiny'];

@Component({
  selector: 'merces-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
  host: {
    '[attr.aria-label]': 'label() || null',
    '[attr.aria-hidden]': 'label() ? null : "true"',
    'role': 'img',
  },
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly type = input<IconType>('regular');
  readonly size = input<IconSize | number>('base');
  readonly label = input<string | undefined>(undefined);

  private readonly registry = inject(IconRegistryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly svgContent = signal<SafeHtml>('');

  readonly sizeClass = computed(() => {
    const s = this.size();
    return typeof s === 'string' && SIZE_PRESETS.includes(s)
      ? `icon-size-${s}`
      : 'icon-size-custom';
  });

  readonly customSizeStyle = computed(() => {
    const s = this.size();
    return typeof s === 'number' ? `${s}px` : null;
  });

  constructor() {
    effect(() => {
      const name = this.name();
      const type = this.type();

      this.registry
        .getIcon(name, type)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((svg) => this.svgContent.set(svg));
    });
  }
}
