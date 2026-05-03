/* Analytics → Remittances — stub row data
   Swap this import for an API service call once the backend is wired. */

import type { DataTableRow } from '@merces/components/display/data-table/data-table/data-table.types';

export interface SeriesDef {
  id: string;
  label: string;
  colorToken: string;
}

export const CHART_SERIES_DEFS: SeriesDef[] = [
  { id: '01', label: 'Total Claims', colorToken: 'var(--colour-stroke-chart-01)' },
  { id: '02', label: 'To be Paid in 0d - 30d', colorToken: 'var(--colour-stroke-chart-02)' },
  { id: '03', label: 'To be Paid in 31d - 60d', colorToken: 'var(--colour-stroke-chart-03)' },
  { id: '04', label: 'To be Paid in 61d - 90d', colorToken: 'var(--colour-stroke-chart-04)' },
  { id: '05', label: 'To be Paid in 91d - 120d', colorToken: 'var(--colour-stroke-chart-05)' },
  { id: '06', label: 'To be Paid in 120d +', colorToken: 'var(--colour-stroke-chart-06)' }
];


export interface ChartGroup {
  groupId: string;
  seriesValues: Record<string, number>;
}
