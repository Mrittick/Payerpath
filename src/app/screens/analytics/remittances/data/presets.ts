/* Analytics → Remittances — Report Presets
   PresetClass:
     'default' — shipped with the app, read-only, cannot be replaced
     'custom'  — user-created, can be updated or replaced

   When PresetType is 'unsaved' (any filter diverges from the saved state):
     - Default preset: only "Save As…" is available (creates a new custom preset)
     - Custom preset:  both "Update Changes" (overwrite) and "Save As…" are available */

export type PresetClass = 'default' | 'custom';
export type PresetType  = 'saved' | 'unsaved';

export interface DropdownOption {
  label: string;
  checked: boolean;
}

export interface SegmentationDefaults {
  groupBy: DropdownOption[];
  frequency: DropdownOption[];
  showColumn: DropdownOption[];
}

export interface ReportPreset {
  readonly id:    string;
  readonly label: string;
  readonly class: PresetClass;
  readonly segmentation?: SegmentationDefaults;
}

/* ── Default presets — order matches Figma / product intent ── */
export const DEFAULT_PRESETS: readonly ReportPreset[] = [
  { id: 'processing-time',     label: 'Processing Time',    class: 'default' },
  { 
    id: 'denial-analysis',     
    label: 'Denial Analysis',    
    class: 'default',
    segmentation: {
      groupBy: [
        { label: 'None', checked: false },
        { label: 'Biller Provider Number', checked: true },
        { label: 'Payer', checked: false },
        { label: 'Biller Provider Name', checked: false },
        { label: 'Rendering Provider Name', checked: false },
      ],
      frequency: [
        { label: 'Day', checked: false },
        { label: 'Week', checked: false },
        { label: 'Month', checked: false },
        { label: 'Quarter', checked: true },
      ],
      showColumn: [
        { label: 'Total Claim Count', checked: true },
        { label: '0 - 30 days', checked: false },
        { label: '31 - 60 days', checked: false },
        { label: '61 - 90 days', checked: false },
        { label: '91 - 120 days', checked: false },
        { label: '120+ days', checked: false },
      ]
    }
  },
  { id: 'cpt-analysis',        label: 'CPT Analysis',       class: 'default' },
  { id: 'remittance-velocity', label: 'Remittance Velocity', class: 'default' },
] as const;
