/* Figma: Section Connector — Fu2tcEQrSrhZZvhGw1aGZ5 node 990:3502
   A 10px-tall horizontal bridge element that visually connects two stacked
   white panels. Left and Right caps are 10×10 SVG concave-arc shapes;
   Middle fills the remaining width between them.

   Sizes: min (no middle, ~20px total hug), 24 / 32 / 36 / 40 / 48 (fixed px) */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type SectionConnectorSize = 'min' | 24 | 32 | 36 | 40 | 48;

@Component({
  selector: 'merces-section-connector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-connector.component.html',
  styleUrl: './section-connector.component.css',
  host: {
    'aria-hidden': 'true',
    '[class.section-connector--min]': 'size() === "min"',
    '[class.section-connector--24]':  'size() === 24',
    '[class.section-connector--32]':  'size() === 32',
    '[class.section-connector--36]':  'size() === 36',
    '[class.section-connector--40]':  'size() === 40',
    '[class.section-connector--48]':  'size() === 48',
  },
})
export class SectionConnectorComponent {
  readonly size = input<SectionConnectorSize>(48);

  protected readonly hasMiddle = computed(() => this.size() !== 'min');
}
