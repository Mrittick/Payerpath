import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';

export type MinMaxModalGroupLayout = 'vertical' | 'horizontal';

@Component({
  selector: 'merces-min-max-modal-group',
  standalone: true,
  templateUrl: './min-max-modal-group.component.html',
  styleUrl: './min-max-modal-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.minmax--vertical]': 'layout() === "vertical"',
    '[class.minmax--horizontal]': 'layout() === "horizontal"',
    '[class.minmax--span]': 'span()',
  },
})
export class MinMaxModalGroupComponent {
  readonly layout = input<MinMaxModalGroupLayout>('vertical');
  readonly span = input<boolean>(false);
  readonly label = input<string>('Label Text');
}
