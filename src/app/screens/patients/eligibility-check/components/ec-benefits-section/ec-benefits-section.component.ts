import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { AccordionHeaderComponent } from '@merces/components/display/accordion/accordion-dependencies/accordion-header/accordion-header.component';
import { EcEligibilityTableComponent } from '../ec-eligibility-table/ec-eligibility-table.component';
import type { BenefitGroup } from '../data-table-entryrow/data-table-entryrow.types';

@Component({
  selector: 'payerpath-ec-benefits-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccordionHeaderComponent, EcEligibilityTableComponent],
  templateUrl: './ec-benefits-section.component.html',
  styleUrl: './ec-benefits-section.component.css',
  host: {
    '[class.benefits-section--open]': 'open()',
  },
})
export class EcBenefitsSectionComponent {
  readonly label  = input.required<string>();
  readonly groups = input<BenefitGroup[]>([]);

  readonly open = model(false);

  toggle(): void {
    this.open.set(!this.open());
  }
}
