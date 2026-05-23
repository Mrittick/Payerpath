import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';
import type { DropdownItemMode, DropdownItemOrientation } from '../dropdown-item/dropdown-item.types';

@Component({
  selector: 'merces-dropdown-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropdown-section.component.html',
  styleUrl: './dropdown-section.component.css',
  host: {
    'role': 'presentation',
    '[class.section--single-left]':  'mode() === "single-select" && orientation() === "left"',
    '[class.section--single-right]': 'mode() === "single-select" && orientation() === "right"',
    '[class.section--multi-left]':   'mode() === "multi-select"  && orientation() === "left"',
    '[class.section--multi-right]':  'mode() === "multi-select"  && orientation() === "right"',
    '[class.section--choice]':       'mode() === "choice"',
  },
})
export class DropdownSectionComponent {
  readonly mode = input<DropdownItemMode>('single-select');
  readonly orientation = input<DropdownItemOrientation>('left');
  readonly label = input<string>('Section');
}
