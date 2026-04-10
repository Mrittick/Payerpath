import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { StringfieldMessageComponent } from '../stringfield-plain-message/stringfield-plain-message.component';

export type MinMaxGroupLayout = 'vertical' | 'horizontal';
export type MinMaxGroupPadding = 'default' | 'span';
export type MinMaxGroupValidation = 'default' | 'warning' | 'error';

@Component({
  selector: 'merces-stringfield-plain-minmax-group',
  standalone: true,
  imports: [StringfieldMessageComponent],
  templateUrl: './stringfield-plain-minmax-group.component.html',
  styleUrl: './stringfield-plain-minmax-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.mmg--vertical]': 'layout() === "vertical"',
    '[class.mmg--horizontal]': 'layout() === "horizontal"',
    '[class.mmg--span]': 'padding() === "span"',
    '[class.mmg--has-message]': 'showMessage()',
  },
})
export class StringfieldPlainMinMaxGroupComponent {
  readonly label = input<string>('Label Text');
  readonly layout = input<MinMaxGroupLayout>('vertical');
  readonly padding = input<MinMaxGroupPadding>('default');
  readonly validationState = input<MinMaxGroupValidation>('default');
  readonly message = input<string>('');

  readonly showMessage = computed(
    () => this.validationState() !== 'default' && this.message().length > 0
  );

  readonly messageType = computed(() =>
    this.validationState() === 'warning' ? 'warning' as const : 'error' as const
  );
}
