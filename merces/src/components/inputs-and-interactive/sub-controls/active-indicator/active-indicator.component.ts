import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';

export type ActiveIndicatorState = 'default' | 'hover' | 'invoked';

@Component({
  selector: 'merces-active-indicator',
  standalone: true,
  template: '',
  styleUrl: './active-indicator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ai--default]': 'state() === "default"',
    '[class.ai--hover]':   'state() === "hover"',
    '[class.ai--invoked]': 'state() === "invoked"',
    'aria-hidden': 'true',
  },
})
export class ActiveIndicatorComponent {
  readonly state = input<ActiveIndicatorState>('default');
}
