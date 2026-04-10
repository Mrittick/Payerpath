import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { IconComponent } from '../../../../../assets/icon/icon.component';

@Component({
  selector: 'merces-dropdown-no-results',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './dropdown-no-results.component.html',
  styleUrl: './dropdown-no-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownNoResultsComponent {}
