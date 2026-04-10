import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';

export type StringfieldMessageType = 'warning' | 'error';

@Component({
  selector: 'merces-stringfield-message',
  standalone: true,
  templateUrl: './stringfield-plain-message.component.html',
  styleUrl: './stringfield-plain-message.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sf-message--warning]': 'type() === "warning"',
    '[class.sf-message--error]': 'type() === "error"',
    '[class.sf-message--padded]': 'padding()',
  },
})
export class StringfieldMessageComponent {
  readonly type = input.required<StringfieldMessageType>();
  readonly text = input<string>('');
  readonly padding = input<boolean>(false);
}
