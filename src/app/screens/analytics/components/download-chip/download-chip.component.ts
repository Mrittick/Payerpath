/* Figma: Download Chip — Fu2tcEQrSrhZZvhGw1aGZ5 node 4125:77852
   Variants: State=Default/Hover/Pressed/Disabled × hasChart=True/False
   hasChart=True  → button + hover-reveal panel (3 download options)
   hasChart=False → direct download button (no panel) */

import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';
import { CtaButtonComponent } from '@merces/components/inputs-and-interactive/cta-button/cta-button.component';
import { IconComponent } from '@merces/assets/icon/icon.component';

@Component({
  selector: 'payerpath-download-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CtaButtonComponent, IconComponent],
  templateUrl: './download-chip.component.html',
  styleUrl: './download-chip.component.css',
  host: {
    '[class.dc--open]':     'hasChart() && _panelOpen()',
    '[class.dc--no-chart]': '!hasChart()',
    '[class.dc--disabled]': 'disabled()',
  },
})
export class DownloadChipComponent {
  /* ── Inputs ── */
  readonly hasChart  = input<boolean>(true);
  readonly disabled  = input<boolean>(false);

  /* ── Outputs ── */
  readonly downloadAll           = output<void>();
  readonly downloadChartSnapshot = output<void>();

  /* ── Internal ── */
  readonly _panelOpen = signal(false);

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.disabled() && this.hasChart()) this._panelOpen.set(true);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this._panelOpen.set(false);
  }

  onButtonClick(): void {
    if (this.disabled()) return;
    if (!this.hasChart()) this.downloadAll.emit();
  }

  onDownloadAll(): void {
    this._panelOpen.set(false);
    this.downloadAll.emit();
  }

  onDownloadChartSnapshot(): void {
    this._panelOpen.set(false);
    this.downloadChartSnapshot.emit();
  }
}
