/* Figma: Report Console — X3ePdrL3EFGOKK6Gb6qbV7 node 1490:75154
   Variants: isExpanded × Preset Class × Preset Type
   Sits at the top of the Remittances sidebar.
   The Toggle Small here collapses / expands the ENTIRE sidebar. */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { DropdownComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-standalone/dropdown.component';
import { DropdownGroupComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-group/dropdown-group.component';
import { DropdownItemComponent } from '@merces/components/inputs-and-interactive/dropdown/dropdown-dependencies/dropdown-item/dropdown-item.component';
import { CtaButtonComponent } from '@merces/components/inputs-and-interactive/cta-button/cta-button.component';
import { ToggleSmallComponent } from '@merces/components/display/global-navbar/navbar-dependencies/toggle-small/toggle-small.component';
import type { ReportPreset, PresetClass, PresetType } from '../../remittances/data/presets';

@Component({
  selector: 'payerpath-remittances-report-console',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    /** Drives collapsed-state CSS — mirrors isExpanded so the header can
     *  restyle itself (centre the toggle, hide the heading) without the
     *  sidebar needing to pierce ViewEncapsulation. */
    '[class.rc--collapsed]': '!isExpanded()',
  },
  imports: [
    DropdownComponent,
    DropdownGroupComponent,
    DropdownItemComponent,
    CtaButtonComponent,
    ToggleSmallComponent,
  ],
  templateUrl: './remittances-report-console.component.html',
  styleUrl:    './remittances-report-console.component.css',
})
export class RemittancesReportConsoleComponent {

  /* ── Inputs ── */

  /** Full list of presets to show in the dropdown. */
  readonly presets         = input<readonly ReportPreset[]>([]);

  /** Currently active preset. */
  readonly selectedPreset  = input<ReportPreset | null>(null);

  /** Whether any filter has diverged from the saved preset state. */
  readonly presetType      = input<PresetType>('saved');

  /** Drives sidebar expansion — collapsed = only header visible. */
  readonly isExpanded      = input<boolean>(true);

  /**
   * Reflects the logical toggle state only — true when the sidebar is
   * pinned open by the user.  Separate from isExpanded() which is also true
   * during hover-peek.  Controls the toggle button's isCollapsed visual only.
   */
  readonly isSidebarToggled = input<boolean>(true);

  /* ── Outputs ── */

  /** Emitted when the user picks a different preset. */
  readonly presetSelected  = output<ReportPreset>();

  /** Emitted when "Save As…" is clicked. */
  readonly saveAs          = output<void>();

  /**
   * Emitted when "Update Changes" is clicked
   * (Preset Class = Custom, Preset Type = Unsaved only).
   */
  readonly updateChanges   = output<void>();

  /** Emitted when the Toggle Small is clicked — parent toggles sidebar. */
  readonly expandedToggle  = output<void>();

  /* ── Derived ── */

  /** True when actions row should appear. */
  protected readonly showActions = computed(() => this.presetType() === 'unsaved');

  /** True when "Update Changes" should appear (custom preset + unsaved). */
  protected readonly showUpdate  = computed(
    () => this.showActions() && this.selectedPreset()?.class === 'custom'
  );

  /** Label shown in the dropdown trigger. */
  protected readonly dropdownLabel = computed(
    () => this.selectedPreset()?.label ?? ''
  );

  protected onPresetSelected(preset: ReportPreset): void {
    this.presetSelected.emit(preset);
  }
}
