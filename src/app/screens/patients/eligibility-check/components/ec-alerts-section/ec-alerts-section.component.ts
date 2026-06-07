import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { AccordionHeaderComponent } from '@merces/components/display/accordion/accordion-dependencies/accordion-header/accordion-header.component';
import type { AlertRow } from '../data-table-entryrow/data-table-entryrow.types';

@Component({
  selector: 'payerpath-ec-alerts-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccordionHeaderComponent],
  templateUrl: './ec-alerts-section.component.html',
  styleUrl: './ec-alerts-section.component.css',
  host: {
    '[class.alerts-section--open]': 'open()',
  },
})
export class EcAlertsSectionComponent {
  readonly label  = input.required<string>();
  readonly alerts = input<AlertRow[]>([]);

  readonly open = model(false);

  toggle(): void {
    this.open.set(!this.open());
  }
}
