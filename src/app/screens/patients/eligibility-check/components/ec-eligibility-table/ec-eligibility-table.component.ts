import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import type { BenefitGroup } from '../data-table-entryrow/data-table-entryrow.types';

@Component({
  selector: 'payerpath-ec-eligibility-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ec-eligibility-table.component.html',
  styleUrl: './ec-eligibility-table.component.css',
})
export class EcEligibilityTableComponent {
  readonly groups = input<BenefitGroup[]>([]);
}
