import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';

@Component({
  selector: 'merces-table-no-data',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './table-no-data.component.html',
  styleUrl: './table-no-data.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableNoDataComponent {}
