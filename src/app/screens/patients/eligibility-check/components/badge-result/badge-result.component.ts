import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { IconComponent } from '@merces/assets/icon/icon.component';
import type { IconName, IconSize, IconType } from '@merces/assets/icon/icon.types';

export type BadgeResultOutcome = 'active' | 'cannot-process' | 'inactive' | 'invalid-response' | 'unknown';
export type BadgeResultType   = 'symbol' | 'group' | 'card';

@Component({
  selector: 'payerpath-badge-result',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './badge-result.component.html',
  styleUrl: './badge-result.component.css',
  host: {
    '[class.type--symbol]': 'type() === "symbol"',
    '[class.type--group]':  'type() === "group"',
    '[class.type--card]':   'type() === "card"',
    '[class.outcome--active]':           'outcome() === "active"',
    '[class.outcome--cannot-process]':   'outcome() === "cannot-process"',
    '[class.outcome--inactive]':         'outcome() === "inactive"',
    '[class.outcome--invalid-response]': 'outcome() === "invalid-response"',
    '[class.outcome--unknown]':          'outcome() === "unknown"',
  },
})
export class BadgeResultComponent {
  readonly outcome = input.required<BadgeResultOutcome>();
  readonly type    = input<BadgeResultType>('symbol');

  readonly _iconName = computed<IconName>(() => {
    switch (this.outcome()) {
      case 'active':           return 'tick';
      case 'cannot-process':   return 'cross';
      case 'inactive':         return 'exclamation';
      case 'invalid-response': return 'dash';
      case 'unknown':          return 'question';
    }
  });

  // Active + Cannot Process use Filled; others use Bold (no Filled variant exists for exclamation/dash/question)
  readonly _iconType = computed<IconType>(() =>
    (this.outcome() === 'active' || this.outcome() === 'cannot-process') ? 'filled' : 'bold'
  );

  // Inactive uses exclamation which is Mini; all others use Tiny
  readonly _iconSize = computed<IconSize>(() =>
    this.outcome() === 'inactive' ? 'mini' : 'tiny'
  );

  readonly _label = computed(() => {
    switch (this.outcome()) {
      case 'active':           return 'Active';
      case 'cannot-process':   return 'Cannot Process';
      case 'inactive':         return 'Inactive';
      case 'invalid-response': return 'Invalid Response';
      case 'unknown':          return 'Unknown';
    }
  });
}
