import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  model,
} from '@angular/core';
import { SearchComponent } from '../../../sub-controls/search/search.component';
import { FilterComponent } from '../../../sub-controls/filter/filter.component';
import type { FilterMode } from '../../../sub-controls/filter/filter.component';

@Component({
  selector: 'merces-dropdown-filter',
  standalone: true,
  imports: [SearchComponent, FilterComponent],
  templateUrl: './dropdown-filter.component.html',
  styleUrl: './dropdown-filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.dropdown-filter--has-filter]': 'hasFilter()',
  },
})
export class DropdownFilterComponent {
  /** Whether to show the filter button alongside search. */
  readonly hasFilter = input<boolean>(false);

  /** Search placeholder text. */
  readonly placeholder = input<string>('Search');

  /** Two-way bound search value. */
  readonly searchValue = model<string>('');

  /** Current filter mode. */
  readonly filterMode = input<FilterMode>('default');

  /** Whether the filter is active. */
  readonly filterActive = input<boolean>(false);

  /** Emitted when user submits a search. */
  readonly searched = output<string>();

  /** Emitted when the filter button is toggled. */
  readonly filterToggled = output<void>();
}
