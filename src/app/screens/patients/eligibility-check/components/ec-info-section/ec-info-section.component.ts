import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { AccordionHeaderComponent } from '@merces/components/display/accordion/accordion-dependencies/accordion-header/accordion-header.component';

export interface EcInfoRow {
  label: string;
  value: string | null;
}

@Component({
  selector: 'payerpath-ec-info-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccordionHeaderComponent],
  templateUrl: './ec-info-section.component.html',
  styleUrl: './ec-info-section.component.css',
  host: {
    '[class.info-section--open]': 'open()',
  },
})
export class EcInfoSectionComponent {
  readonly label = input.required<string>();
  readonly rows  = input<EcInfoRow[]>([]);

  readonly open = model(false);

  toggle(): void {
    this.open.set(!this.open());
  }
}
