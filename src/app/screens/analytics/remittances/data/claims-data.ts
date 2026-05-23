import type { ClaimsDataRow, ServiceRow } from '../../components/claims-data-table/claims-data.types';

// Deterministic seeded RNG — value in [0, 1)
function r(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[Math.floor(r(seed) * arr.length)];
}

function fmt(n: number): string {
  const [int, dec] = n.toFixed(2).split('.');
  return '$' + int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + dec;
}

function addDays(month: number, day: number, year: number, days: number): string {
  const dt = new Date(year, month - 1, day + days);
  return `${String(dt.getMonth() + 1).padStart(2, '0')}/${String(dt.getDate()).padStart(2, '0')}/${dt.getFullYear()}`;
}

const PROVIDERS = [
  'Dr. Sarah Mitchell', 'Dr. James Thornton', 'Dr. Angela Russo', 'Dr. Michael Chen',
  'Dr. Patricia Wells', 'Dr. Robert Okafor', 'Dr. Linda Park', 'Dr. Thomas Vasquez',
  'Dr. Karen Fitzgerald', 'Dr. William Hargrove', 'Dr. Amara Osei', 'Dr. Priya Sharma',
  'Dr. Marcus Elliott', 'Dr. David Nguyen', 'Dr. Elena Kowalski', 'Dr. James Obi',
  'Dr. Susan Park', 'Dr. Ahmed Hassan', 'Dr. Maria Delgado', 'Dr. Brian Hoffman',
] as const;

const BILLING_GROUPS = [
  'Midwest Cardiology Group', 'Lakeside Internal Medicine', 'Northshore Orthopaedics',
  'Valley Neurology Associates', 'Southside Family Practice', 'Central Radiology Partners',
  'Eastview Dermatology Centers', 'Summit Gastroenterology', 'Riverside Oncology Partners',
  'Pinecrest Pulmonology', 'Metropolitan Nephrology', 'Clearwater Women\'s Health',
  'Bayside Cardiothoracic Surgery', 'Western Rehabilitation Medicine', 'Harbor Ophthalmology',
  'Crestwood Urgent Care', 'Pineview Pediatrics', 'Meadow Psychiatry Group',
] as const;

const PAYERS = [
  'UnitedHealthcare', 'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'Humana',
  'Medicare', 'Medicaid', 'Anthem', 'Molina Healthcare', 'Centene',
] as const;

// Weighted toward Paid so the dataset feels realistic
const STATUSES    = ['Paid', 'Paid', 'Paid', 'Denied', 'Pending', 'Partially Paid'] as const;
const PROCESSED   = ['Participating', 'Participating', 'Non-Participating', 'Out of Network'] as const;

const PROCEDURES = [
  '99213', '99214', '99215', '93000', '93010', '85025', '80053', '81003',
  '27447', '73562', '20610', '71046', '27310', '99232', '36415', '76816',
  '59025', '33533', '33534', '33572', '77003', '92928', '43239', '45378',
] as const;

function generateClaims(count: number): ClaimsDataRow[] {
  return Array.from({ length: count }, (_, i) => {
    const s  = (n: number) => r(i * 23 + n);
    const sj = (j: number, n: number) => r(i * 23 + j * 11 + n + 100);

    const month = (i % 12) + 1;
    const day   = Math.floor(s(1) * 27) + 1;
    const dateOfClaim = `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/2024`;
    const checkDate   = addDays(month, day, 2024, 14 + Math.floor(s(2) * 21));

    const payer       = pick(PAYERS,    s(3));
    const status      = pick(STATUSES,  s(4));
    const processedAs = pick(PROCESSED, s(5));
    const svcCount    = 1 + Math.floor(s(6) * 5);
    const claimId     = `2024-${String(i + 1).padStart(3, '0')}-${String(Math.floor(s(7) * 900000 + 100000))}`;

    let totalBilled = 0;
    let totalPaid   = 0;

    const services: ServiceRow[] = Array.from({ length: svcCount }, (_, j) => {
      const billed = 100 + Math.floor(sj(j, 1) * 3900);
      const paid   = status === 'Paid'           ? Math.floor(billed * (0.60 + sj(j, 2) * 0.30))
                   : status === 'Partially Paid' ? Math.floor(billed * (0.20 + sj(j, 2) * 0.35))
                   : 0;
      totalBilled += billed;
      totalPaid   += paid;
      return {
        id:                  `c${String(i).padStart(4, '0')}-s${j}`,
        claimCheckDate:      checkDate,
        serviceDOS:          dateOfClaim,
        serviceTotalBilled:  fmt(billed),
        serviceProcedureCode: pick(PROCEDURES, sj(j, 3)),
        serviceTotalPaid:    fmt(paid),
        claimControlNumber:  claimId,
        servicePayer:        payer,
      };
    });

    return {
      id:                    `c${String(i).padStart(4, '0')}`,
      claimControlNumber:    claimId,
      dateOfClaim,
      renderingProviderName: pick(PROVIDERS,     s(8)),
      billingProviderName:   pick(BILLING_GROUPS, s(9)),
      checkDate,
      claimStatus:           status,
      processedAs,
      totalBilled:           fmt(totalBilled),
      totalPaid:             fmt(totalPaid),
      totalPRDollars:        fmt(totalBilled - totalPaid),
      payer,
      services,
    };
  });
}

export const CLAIMS_DATA: ClaimsDataRow[] = generateClaims(37284);
