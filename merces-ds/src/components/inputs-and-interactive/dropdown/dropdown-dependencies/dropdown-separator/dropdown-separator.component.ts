import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';
import type { DropdownItemMode, DropdownItemOrientation } from '../dropdown-item/dropdown-item.types';

@Component({
  selector: 'merces-dropdown-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropdown-separator.component.html',
  styleUrl: './dropdown-separator.component.css',
  host: {
    'role': 'separator',
    '[class.separator--single-left]':  'mode() === "single-select" && orientation() === "left"',
    '[class.separator--single-right]': 'mode() === "single-select" && orientation() === "right"',
    '[class.separator--multi-left]':   'mode() === "multi-select"  && orientation() === "left"',
    '[class.separator--multi-right]':  'mode() === "multi-select"  && orientation() === "right"',
  },
})
export class DropdownSeparatorComponent {
  readonly mode = input<DropdownItemMode>('single-select');
  readonly orientation = input<DropdownItemOrientation>('left');
}
