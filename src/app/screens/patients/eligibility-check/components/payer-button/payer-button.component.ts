import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
} from '@angular/core';
import { IconComponent } from '@merces/assets/icon/icon.component';
import { BadgeConfidenceComponent } from '../badge-confidence/badge-confidence.component';
import type { BadgeConfidenceType } from '../badge-confidence/badge-confidence.component';
import { BadgeResultComponent } from '../badge-result/badge-result.component';
import type { BadgeResultOutcome, BadgeResultType } from '../badge-result/badge-result.component';

export type PayerButtonType = 'unsolicited' | 'solicited';

@Component({
  selector: 'payerpath-payer-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, BadgeConfidenceComponent, BadgeResultComponent],
  templateUrl: './payer-button.component.html',
  styleUrl: './payer-button.component.css',
  host: {
    '[class.payer-button--active]':    'isActive()',
    '[class.payer-button--disabled]':  'isDisabled()',
    '[class.payer-button--solicited]': 'type() === "solicited"',
    role: 'button',
    '[attr.aria-pressed]': 'isActive()',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[tabindex]': 'isDisabled() ? -1 : 0',
    '(click)': '_onPress()',
    '(keydown.enter)': '_onKeyActivate($event)',
    '(keydown.space)': '_onKeyActivate($event)',
  },
})
export class PayerButtonComponent {
  // ── Inputs ──────────────────────────────────────────────────────────────

  /** Drives badge variant and active background token. */
  readonly type = input<PayerButtonType>('unsolicited');

  /** Bold header label text (e.g. "Core", "Button Label"). */
  readonly label = input.required<string>();

  /** Insurance provider name chips stacked below the header. */
  readonly entries = input<string[]>([]);

  /**
   * For `type='solicited'` — drives badge-result.
   * @default 'active'
   */
  readonly outcome = input<BadgeResultOutcome>('active');

  /**
   * For `type='unsolicited'` — drives badge-confidence visibility.
   * `false` hides the badge and triggers the Disabled entry styling.
   * @default true
   */
  readonly found = input<boolean>(true);

  /** When true the button shows in its Active/selected state. */
  readonly isActive = input<boolean>(false);

  /** When true the button is non-interactive. */
  readonly isDisabled = input<boolean>(false);

  // ── Outputs ─────────────────────────────────────────────────────────────

  /** Emitted when the button is activated via click or keyboard. */
  readonly select = output<void>();

  // ── Derived badge props ──────────────────────────────────────────────────

  /** Confidence badge type — 'active' when button is selected, 'symbol' otherwise. */
  readonly _confidenceType = computed<BadgeConfidenceType>(
    () => this.isActive() ? 'active' : 'symbol',
  );

  /** Result badge type — 'card' when button is selected, 'symbol' otherwise. */
  readonly _resultType = computed<BadgeResultType>(
    () => this.isActive() ? 'card' : 'symbol',
  );

  // ── Internal ─────────────────────────────────────────────────────────────

  _onPress(): void {
    if (!this.isDisabled()) this.select.emit();
  }

  _onKeyActivate(event: Event): void {
    event.preventDefault();
    this._onPress();
  }
}
