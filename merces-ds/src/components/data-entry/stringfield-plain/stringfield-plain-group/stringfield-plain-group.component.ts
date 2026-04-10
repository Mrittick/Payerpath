import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';

export type StringfieldGroupLayout = 'vertical' | 'horizontal';
export type StringfieldGroupPadding = 'default' | 'span';

@Component({
  selector: 'merces-stringfield-plain-group',
  standalone: true,
  templateUrl: './stringfield-plain-group.component.html',
  styleUrl: './stringfield-plain-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sfg--vertical]': 'layout() === "vertical"',
    '[class.sfg--horizontal]': 'layout() === "horizontal"',
    '[class.sfg--span]': 'padding() === "span"',
  },
})
export class StringfieldPlainGroupComponent {
  readonly label = input<string>('Label Text');
  readonly layout = input<StringfieldGroupLayout>('vertical');
  readonly padding = input<StringfieldGroupPadding>('default');
}
