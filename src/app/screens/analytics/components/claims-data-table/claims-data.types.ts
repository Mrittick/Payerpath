export interface ServiceRow {
  id: string;
  claimCheckDate: string;
  serviceDOS: string;
  serviceTotalBilled: string;
  serviceProcedureCode: string;
  serviceTotalPaid: string;
  claimControlNumber: string;
  servicePayer: string;
}

export interface ClaimsDataRow {
  id: string;
  claimControlNumber: string;
  dateOfClaim: string;
  renderingProviderName: string;
  billingProviderName: string;
  checkDate: string;
  claimStatus: string;
  processedAs: string;
  totalBilled: string;
  totalPaid: string;
  totalPRDollars: string;
  payer: string;
  services: ServiceRow[];
}
