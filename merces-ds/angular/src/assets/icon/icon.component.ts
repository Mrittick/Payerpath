import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  input,
} from '@angular/core';
import { IconRegistryService } from './icon-registry.service';
import { IconName, IconType, IconSize } from './icon.types';

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

  readonly svgContent = computed(() => this.registry.getIcon(this.name(), this.type()));

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
}
