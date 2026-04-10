import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';

import { IconComponent } from '../../../assets/icon/icon.component';

@Component({
  selector: 'merces-selection-chip',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './selection-chip.component.html',
  styleUrl: './selection-chip.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.selection-chip--wrap]': 'wrap()',
    '[class.selection-chip--no-wrap]': '!wrap()',
    '[attr.role]': '"option"',
    '[attr.aria-selected]': '"true"',
  },
})
export class SelectionChipComponent {

  /* ── Inputs ── */

  readonly label = input<string>('Selection');
  readonly wrap = input<boolean>(true);

  /* ── Output ── */

  readonly deselected = output<void>();

  /* ── Click handler ── */

  onClick(): void {
    this.deselected.emit();
  }
}
