import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { MoreInfoComponent } from '../../sub-controls/more-info/more-info.component';

export type DropdownGroupLayout = 'vertical' | 'horizontal';

@Component({
  selector: 'merces-dropdown-group',
  standalone: true,
  imports: [MoreInfoComponent],
  templateUrl: './dropdown-group.component.html',
  styleUrl: './dropdown-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.group--vertical]': 'layout() === "vertical"',
    '[class.group--horizontal]': 'layout() === "horizontal"',
    '[class.group--span]': 'span()',
  },
})
export class DropdownGroupComponent {
  readonly layout = input<DropdownGroupLayout>('vertical');
  readonly span = input<boolean>(false);
  readonly moreInfo = input<boolean>(false);
  readonly label = input<string>('Label Text');
  readonly moreInfoLabel = input<string>('More Info');

  readonly moreInfoClicked = output<void>();
}
