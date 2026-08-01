/* ==========================================================================
   US States & Territories
   Small dataset (~56 entries) to demonstrate the Modal Field overlay
   scaling down gracefully for fewer items.
   ========================================================================== */

export interface USState {
  /** Two-letter abbreviation (e.g. "CA", "NY") */
  code: string;
  /** Full state name */
  name: string;
  /** Whether it's a state (true) or territory (false) */
  isState: boolean;
}

export const US_STATES: USState[] = [
  { code: 'AL', name: 'Alabama', isState: true },
  { code: 'AK', name: 'Alaska', isState: true },
  { code: 'AZ', name: 'Arizona', isState: true },
  { code: 'AR', name: 'Arkansas', isState: true },
  { code: 'CA', name: 'California', isState: true },
  { code: 'CO', name: 'Colorado', isState: true },
  { code: 'CT', name: 'Connecticut', isState: true },
  { code: 'DE', name: 'Delaware', isState: true },
  { code: 'FL', name: 'Florida', isState: true },
  { code: 'GA', name: 'Georgia', isState: true },
  { code: 'HI', name: 'Hawaii', isState: true },
  { code: 'ID', name: 'Idaho', isState: true },
  { code: 'IL', name: 'Illinois', isState: true },
  { code: 'IN', name: 'Indiana', isState: true },
  { code: 'IA', name: 'Iowa', isState: true },
  { code: 'KS', name: 'Kansas', isState: true },
  { code: 'KY', name: 'Kentucky', isState: true },
  { code: 'LA', name: 'Louisiana', isState: true },
  { code: 'ME', name: 'Maine', isState: true },
  { code: 'MD', name: 'Maryland', isState: true },
  { code: 'MA', name: 'Massachusetts', isState: true },
  { code: 'MI', name: 'Michigan', isState: true },
  { code: 'MN', name: 'Minnesota', isState: true },
  { code: 'MS', name: 'Mississippi', isState: true },
  { code: 'MO', name: 'Missouri', isState: true },
  { code: 'MT', name: 'Montana', isState: true },
  { code: 'NE', name: 'Nebraska', isState: true },
  { code: 'NV', name: 'Nevada', isState: true },
  { code: 'NH', name: 'New Hampshire', isState: true },
  { code: 'NJ', name: 'New Jersey', isState: true },
  { code: 'NM', name: 'New Mexico', isState: true },
  { code: 'NY', name: 'New York', isState: true },
  { code: 'NC', name: 'North Carolina', isState: true },
  { code: 'ND', name: 'North Dakota', isState: true },
  { code: 'OH', name: 'Ohio', isState: true },
  { code: 'OK', name: 'Oklahoma', isState: true },
  { code: 'OR', name: 'Oregon', isState: true },
  { code: 'PA', name: 'Pennsylvania', isState: true },
  { code: 'RI', name: 'Rhode Island', isState: true },
  { code: 'SC', name: 'South Carolina', isState: true },
  { code: 'SD', name: 'South Dakota', isState: true },
  { code: 'TN', name: 'Tennessee', isState: true },
  { code: 'TX', name: 'Texas', isState: true },
  { code: 'UT', name: 'Utah', isState: true },
  { code: 'VT', name: 'Vermont', isState: true },
  { code: 'VA', name: 'Virginia', isState: true },
  { code: 'WA', name: 'Washington', isState: true },
  { code: 'WV', name: 'West Virginia', isState: true },
  { code: 'WI', name: 'Wisconsin', isState: true },
  { code: 'WY', name: 'Wyoming', isState: true },
  { code: 'DC', name: 'District of Columbia', isState: false },
  { code: 'AS', name: 'American Samoa', isState: false },
  { code: 'GU', name: 'Guam', isState: false },
  { code: 'MP', name: 'Northern Mariana Islands', isState: false },
  { code: 'PR', name: 'Puerto Rico', isState: false },
  { code: 'VI', name: 'U.S. Virgin Islands', isState: false },
];

/** Format a state for display: "CODE - Name" */
export function formatStateLabel(state: USState): string {
  return `${state.code} - ${state.name}`;
}
