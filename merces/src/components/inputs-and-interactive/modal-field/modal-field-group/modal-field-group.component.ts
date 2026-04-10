import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';

export type ModalFieldGroupLayout = 'vertical' | 'horizontal';

@Component({
  selector: 'merces-modal-field-group',
  standalone: true,
  templateUrl: './modal-field-group.component.html',
  styleUrl: './modal-field-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.group--vertical]': 'layout() === "vertical"',
    '[class.group--horizontal]': 'layout() === "horizontal"',
    '[class.group--span]': 'span()',
  },
})
export class ModalFieldGroupComponent {
  readonly layout = input<ModalFieldGroupLayout>('vertical');
  readonly span = input<boolean>(false);
  readonly label = input<string>('Label Text');
}
