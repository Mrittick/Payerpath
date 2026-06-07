import type { BadgeResultOutcome } from '../badge-result/badge-result.component';

export interface AlertChangeEntry {
  field:    string;
  request:  string;
  response: string;
}

export interface AlertRow {
  label:   string;
  text:    string | null;
  changes: AlertChangeEntry[] | null;
}

export interface RelatedEntityEntry {
  benefit:      string;
  primaryPayer: string;
  address:      string;
}

export interface BenefitEntry {
  amount:        string | null;
  description:   string | null;
  coverage:      string | null;
  network:       string | null;
  authorization: string | null;
  insuranceType: string | null;
  messages:      string | null;
}

export interface BenefitGroup {
  category: string | null;
  entries:  BenefitEntry[];
}

export interface EcPayerFound {
  found:           true;
  name:            string;           // Insurance company name
  identification:  string;           // Payer's network ID (e.g. "87726")
  transactionDate: string;
  providerName:    string;
  npi:             string;
  payerpathTrn:    string;           // UUID-format transaction reference
  subscriberName:  string;
  dateOfBirth:     string;
  address:         string;           // \n-separated multiline address
  subscriberId:    string;           // Patient's member ID at this payer
  result:          BadgeResultOutcome;
  benefits:        BenefitGroup[];
  alerts:          AlertRow[];
  relatedEntities: RelatedEntityEntry[];
}

export interface EcPayerNotFound {
  found: false;
}

export type EcPayer = EcPayerFound | EcPayerNotFound;

export interface EcPayers {
  core:      EcPayer;
  primary:   EcPayer;
  secondary: EcPayer;
  tertiary:  EcPayerNotFound;
}

export interface EcRowData {
  patientName:     string;
  found:           boolean;          // patient identity confidence badge
  dateOfBirth:     string;
  transactionDate: string;
  insurance:       string;           // derived: payers.core.name
  policyId:        string;           // derived: payers.core.subscriberId
  result:          BadgeResultOutcome; // derived: payers.core.result
  alerts:          string[];
  coPayments:      string | null;
  deductibles:     string | null;
  provider:        string | null;    // derived: payers.core.providerName
  payers:          EcPayers;
}
