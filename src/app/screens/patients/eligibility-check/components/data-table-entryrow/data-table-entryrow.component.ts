import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  HostListener,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { CheckboxTableComponent } from '@merces/components/inputs-and-interactive/checkboxes/checkbox-table/checkbox-table.component';
import { BadgeResultComponent } from '../badge-result/badge-result.component';
import { BadgeConfidenceComponent } from '../badge-confidence/badge-confidence.component';
import type { EcRowData } from './data-table-entryrow.types';

@Component({
  selector: 'payerpath-ec-entry-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxTableComponent, BadgeResultComponent, BadgeConfidenceComponent],
  templateUrl: './data-table-entryrow.component.html',
  styleUrl: './data-table-entryrow.component.css',
  host: {
    'role':                  '"row"',
    '[attr.aria-selected]':  'selected() ? "true" : "false"',
    'tabindex':              '0',
    '[class.row--alternating]': 'alternating()',
    '[class.row--selected]':    'selected()',
    '[class.row--disabled]':    'disabled()',
  },
})
export class EcEntryRowComponent {
  /* ── Inputs ── */
  readonly row         = input.required<EcRowData>();
  readonly selected    = input<boolean>(false);
  readonly alternating = input<boolean>(false);
  readonly disabled    = input<boolean>(false);

  /* ── Outputs ── */
  readonly namePress = output<EcRowData>();

  /* ── Derived ── */
  readonly _alertsText = computed(() => {
    const a = this.row().alerts;
    return a.length ? a.join(', ') : '-';
  });

  /* ── Hover state — drives badge-result type (symbol ↔ group) ── */
  protected readonly hovered = signal(false);

  @HostListener('mouseenter') _onEnter(): void { this.hovered.set(true); }
  @HostListener('mouseleave') _onLeave(): void { this.hovered.set(false); }

  /* ── Keyboard focus (keyboard-only) ── */
  private _keyboardFocused = false;
  private _focusFromMouse  = false;

  @HostBinding('class.row--keyboard-focus')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

  @HostListener('mousedown') onMouseDown(): void {
    this._focusFromMouse = true;
    this._keyboardFocused = false;
  }

  @HostListener('focus') onFocus(): void {
    this._keyboardFocused = !this._focusFromMouse;
    this._focusFromMouse = false;
  }

  @HostListener('blur') onBlur(): void {
    this._keyboardFocused = false;
  }
}
