import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { IconComponent } from '@merces/assets/icon/icon.component';

export type BadgeConfidenceType = 'symbol' | 'group' | 'active';

@Component({
  selector: 'payerpath-badge-confidence',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './badge-confidence.component.html',
  styleUrl: './badge-confidence.component.css',
  host: {
    '[class.type--symbol]': 'type() === "symbol"',
    '[class.type--group]':  'type() === "group"',
    '[class.type--active]': 'type() === "active"',
    // found=false → host invisible; Figma False variant is empty by design
    '[style.display]': 'found() ? null : "none"',
  },
})
export class BadgeConfidenceComponent {
  readonly found = input<boolean>(true);
  readonly type  = input<BadgeConfidenceType>('symbol');
}
