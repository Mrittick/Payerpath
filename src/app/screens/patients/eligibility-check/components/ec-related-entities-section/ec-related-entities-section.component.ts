import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { AccordionHeaderComponent } from '@merces/components/display/accordion/accordion-dependencies/accordion-header/accordion-header.component';
import type { RelatedEntityEntry } from '../data-table-entryrow/data-table-entryrow.types';

@Component({
  selector: 'payerpath-ec-related-entities-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccordionHeaderComponent],
  templateUrl: './ec-related-entities-section.component.html',
  styleUrl: './ec-related-entities-section.component.css',
  host: {
    '[class.related-entities-section--open]': 'open()',
  },
})
export class EcRelatedEntitiesSectionComponent {
  readonly label    = input.required<string>();
  readonly entities = input<RelatedEntityEntry[]>([]);

  readonly open = model(false);

  toggle(): void {
    this.open.set(!this.open());
  }
}
