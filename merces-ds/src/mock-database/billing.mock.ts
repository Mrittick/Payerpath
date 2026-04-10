import type { DataTableColumn, DataTableRow } from '../components/display/data-table/data-table/data-table.types';

// ── Billing Provider AR Summary — single-line headers ─────────────────────────

export const AR_COLUMNS: DataTableColumn[] = [
  { key: 'provider',    label: 'Billing Provider',  width: 140 },
  { key: 'totalClaims', label: 'Total Claim Count', width: 160 },
  { key: 'd0_30',       label: '0 - 30 days',       width: 140 },
  { key: 'd31_60',      label: '31 - 60 days',      width: 140 },
  { key: 'd61_90',      label: '61 - 90 days',      width: 140 },
  { key: 'd91_120',     label: '91 - 120 days',     width: 140 },
  { key: 'd120plus',    label: '120+ days',          width: 140 },
];

export const AR_ROWS: DataTableRow[] = [
  { provider: '1124038989', totalClaims: '1,921',  d0_30: '1,048',  d31_60: '448',    d61_90: '343',   d91_120: '61',    d120plus: '21'    },
  { provider: '1285629386', totalClaims: '42,628', d0_30: '24,268', d31_60: '12,933', d61_90: '2,135', d91_120: '1,153', d120plus: '2,139' },
  { provider: '1124038989', totalClaims: '1,921',  d0_30: '1,048',  d31_60: '448',    d61_90: '343',   d91_120: '61',    d120plus: '21'    },
  { provider: '1285629386', totalClaims: '42,628', d0_30: '24,268', d31_60: '12,933', d61_90: '2,135', d91_120: '1,153', d120plus: '2,139' },
  { provider: '1124038989', totalClaims: '1,921',  d0_30: '1,048',  d31_60: '448',    d61_90: '343',   d91_120: '61',    d120plus: '21'    },
  { provider: '1285629386', totalClaims: '42,628', d0_30: '24,268', d31_60: '12,933', d61_90: '2,135', d91_120: '1,153', d120plus: '2,139' },
  { provider: '1124038989', totalClaims: '1,921',  d0_30: '1,048',  d31_60: '448',    d61_90: '343',   d91_120: '61',    d120plus: '21'    },
  { provider: '1285629386', totalClaims: '42,628', d0_30: '24,268', d31_60: '12,933', d61_90: '2,135', d91_120: '1,153', d120plus: '2,139' },
];

// ── Claim Line Detail — dual-line headers ──────────────────────────────────────

export const CLAIM_COLUMNS: DataTableColumn[] = [
  { key: 'checkDate',   label: 'Check Date',      extraLabel: 'Claim',   width: 140 },
  { key: 'dos',         label: 'DOS',              extraLabel: 'Service', width: 140 },
  { key: 'totalBilled', label: 'Total Billed',     extraLabel: 'Service', width: 140 },
  { key: 'procCode',    label: 'Procedure Code',   extraLabel: 'Service', width: 140 },
  { key: 'totalPaid',   label: 'Total Paid',       extraLabel: 'Service', width: 140 },
  { key: 'controlNum',  label: 'Control Number',   extraLabel: 'Claim',   width: 160 },
  { key: 'payer',       label: 'Payer',             extraLabel: 'Service', width: 140 },
];

export const CLAIM_ROWS: DataTableRow[] = [
  { checkDate: '2024-01-17', dos: '2023-11-11', totalBilled: '3078F',  procCode: '$0.00',   totalPaid: '$0.00',   controlNum: '2400900212270000', payer: 'DHB' },
  { checkDate: '2024-02-05', dos: '2023-12-01', totalBilled: 'G0439',  procCode: '$185.00', totalPaid: '$148.00', controlNum: '2401500318940001', payer: 'UHC' },
  { checkDate: '2024-01-17', dos: '2023-11-11', totalBilled: '3078F',  procCode: '$0.00',   totalPaid: '$0.00',   controlNum: '2400900212270000', payer: 'DHB' },
  { checkDate: '2024-02-05', dos: '2023-12-01', totalBilled: 'G0439',  procCode: '$185.00', totalPaid: '$148.00', controlNum: '2401500318940001', payer: 'UHC' },
  { checkDate: '2024-01-17', dos: '2023-11-11', totalBilled: '3078F',  procCode: '$0.00',   totalPaid: '$0.00',   controlNum: '2400900212270000', payer: 'DHB' },
  { checkDate: '2024-02-05', dos: '2023-12-01', totalBilled: 'G0439',  procCode: '$185.00', totalPaid: '$148.00', controlNum: '2401500318940001', payer: 'UHC' },
  { checkDate: '2024-01-17', dos: '2023-11-11', totalBilled: '3078F',  procCode: '$0.00',   totalPaid: '$0.00',   controlNum: '2400900212270000', payer: 'DHB' },
  { checkDate: '2024-02-05', dos: '2023-12-01', totalBilled: 'G0439',  procCode: '$185.00', totalPaid: '$148.00', controlNum: '2401500318940001', payer: 'UHC' },
];
