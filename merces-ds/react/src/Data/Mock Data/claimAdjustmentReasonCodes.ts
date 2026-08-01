/* ==========================================================================
   Claim Adjustment Reason Codes (CARCs)
   Source: x12.org — https://x12.org/codes/claim-adjustment-reason-codes
   Centralised CARC database for Modal Field overlay demo scenarios.
   ========================================================================== */

export interface CARCCode {
  /** Code identifier (e.g. "1", "2", "A0", "P1") */
  code: string;
  /** Full description of the adjustment reason */
  description: string;
  /** Date the code was added (YYYY-MM-DD) */
  startDate: string;
  /** Date the code was last modified (YYYY-MM-DD), if applicable */
  lastModified?: string;
  /** Date the code was deactivated (YYYY-MM-DD), if applicable */
  stopDate?: string;
  /** Whether the code is currently active (no stop date or stop date in future) */
  isActive: boolean;
}

export const CARC_CODES: CARCCode[] = [
  {
    code: '1',
    description: 'Deductible Amount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '2',
    description: 'Coinsurance Amount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '3',
    description: 'Co-payment Amount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '4',
    description:
      'The procedure code is inconsistent with the modifier used or a required modifier is missing',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '5',
    description:
      'The procedure code/type of bill is inconsistent with the place of service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '6',
    description:
      "The procedure/revenue code is inconsistent with the patient's age",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '7',
    description:
      "The procedure/revenue code is inconsistent with the patient's gender",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '8',
    description:
      'The procedure code is inconsistent with the provider type/specialty (taxonomy)',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '9',
    description: "The diagnosis is inconsistent with the patient's age",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '10',
    description: "The diagnosis is inconsistent with the patient's gender",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '11',
    description: 'The diagnosis is inconsistent with the procedure',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '12',
    description: 'The diagnosis is inconsistent with the provider type',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '13',
    description: 'The date of death precedes the date of service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '14',
    description: 'The date of birth follows the date of service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '15',
    description:
      'The authorization number is missing, invalid, or does not apply to the billed services or provider',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '16',
    description:
      'Claim/service lacks information or has submission/billing error(s)',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '17',
    description: 'An exact duplicate claim/service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '18',
    description:
      "Exact duplicate claim/service (Use only with Group Code OA except where state workers' compensation regulations requires otherwise)",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '19',
    description:
      "This is a work-related injury/illness and thus the liability of the Worker's Compensation Carrier",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '20',
    description: 'This injury/illness is covered by the liability carrier',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '21',
    description:
      'This injury/illness is the liability of the no-fault carrier',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '22',
    description:
      'This care may be covered by another payer per coordination of benefits',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '23',
    description:
      'The impact of prior payer(s) adjudication including payments and/or adjustments',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '24',
    description:
      'Charges are covered under a capitation agreement/managed care plan',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '25',
    description:
      'Payment to the provider was authorized as a one-time only payment for the specific service/claim',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '26',
    description: 'Expenses incurred prior to coverage',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '27',
    description: 'Expenses incurred after coverage terminated',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '29',
    description: 'The time limit for filing has expired',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '30',
    description:
      'Payment adjusted because the patient has not met the required eligibility requirements',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '31',
    description: 'Patient cannot be identified as our insured',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '32',
    description:
      'Our records indicate that this dependent is not an eligible dependent as defined',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '33',
    description: 'Insured has no dependent coverage',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '34',
    description: 'Insured has no coverage for newborns',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '35',
    description: 'Lifetime benefit maximum has been reached',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '39',
    description:
      'Services denied at the time authorization/pre-certification was requested',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '40',
    description:
      'Charges do not meet qualifications for emergent/urgent care',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '44',
    description: 'Prompt-pay discount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '45',
    description:
      'Charge exceeds fee schedule/maximum allowable or contracted/legislated fee arrangement',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '49',
    description:
      'This is a non-covered service because it is a routine/preventive exam or a diagnostic/screening procedure done in conjunction with a routine/preventive exam',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '50',
    description:
      "These are non-covered services because this is not deemed a 'medical necessity' by the payer",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '51',
    description:
      'These are non-covered services because this is a pre-existing condition',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '53',
    description: 'Services by an unauthorized provider',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '54',
    description:
      'Multiple physicians/assistants are not covered in this case',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '55',
    description:
      'Procedure/treatment/drug is deemed experimental/investigational by the payer',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '56',
    description:
      "Procedure/treatment has not been deemed 'proven to be effective' by the payer",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '58',
    description:
      'Treatment was deemed by the payer to have been rendered in an inappropriate or invalid place of service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '59',
    description:
      'Processed based on multiple or concurrent procedure rules',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '60',
    description:
      'Charges for outpatient services are not covered when performed within a period of time prior to or after inpatient services',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '61',
    description: 'Adjusted for failure to obtain second surgical opinion',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '66',
    description: 'Blood Deductible',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '69',
    description: 'Day outlier amount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '70',
    description: 'Cost outlier - Loss Adjustment Triggered',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '74',
    description: 'Indirect Medical Education Adjustment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '75',
    description: 'Direct Medical Education Adjustment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '78',
    description: 'Non-covered days/room charges adjustment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '85',
    description:
      'Patient Interest Adjustment (Use Remittance Advice Remark Codes whenever possible)',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '87',
    description: 'Transfer amount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '89',
    description: 'Professional fees removed from charges',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '90',
    description: 'Ingredient cost adjustment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '91',
    description: 'Dispensing fee adjustment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '94',
    description: 'Processed in Excess of charges',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '95',
    description: 'Plan procedures not followed',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '96',
    description:
      'Non-covered charge(s). At least one Remark Code must be provided',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '97',
    description:
      'The benefit for this service is included in the payment/allowance for another service/procedure that has already been adjudicated',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '100',
    description:
      'Payment made to a provider/supplier who has accepted assignment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '101',
    description:
      'Predetermination: anticipated payment upon completion of services or claim adjudication',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '102',
    description: 'Major Medical Adjustment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '103',
    description: 'Provider promotional discount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '104',
    description: 'Managed care withholding',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '105',
    description: 'Tax withholding',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '106',
    description: 'Patient payment option/election not in effect',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '107',
    description:
      'The related or qualifying claim/service was not identified on this claim',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '108',
    description: 'Rent/purchase guidelines were not met',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '109',
    description: 'Claim/service not covered by this payer/contractor',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '110',
    description: 'Billing date predates service date',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '111',
    description: 'Not covered unless the provider accepts assignment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '112',
    description:
      'Service not furnished directly to the patient and/or not documented',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '114',
    description:
      'Procedure/product not approved by the Food and Drug Administration',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '115',
    description: 'Procedure postponed, canceled, or delayed',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '116',
    description:
      'The advance indemnification notice signed by the patient did not comply with requirements',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '117',
    description:
      'Transportation is only covered to the closest facility that can provide the necessary care',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '118',
    description: 'ESRD network support adjustment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '119',
    description:
      'Benefit maximum for this time period or occurrence has been reached',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '121',
    description:
      'Indemnification adjustment - Loss Adjustment Triggered by covered entity',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '122',
    description: 'Psychiatric reduction',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '125',
    description: 'Submission/billing error(s)',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '128',
    description: "Newborn's services are covered in the mother's Allowance",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '129',
    description: 'Prior processing information appears incorrect',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '130',
    description: 'Claim submission fee',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '131',
    description: 'Claim specific negotiated discount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '132',
    description: 'Prematurity adjustment. Premium paid to provider',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '133',
    description:
      'The disposition of this claim/service is pending further review',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '134',
    description: 'Technical fees removed from charges',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '135',
    description: 'Interim bill adjustment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '136',
    description: 'Failure to follow prior authorization guidelines',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '137',
    description:
      'Regulatory Surcharges, Assessments, Allowances or Health Related Taxes',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '138',
    description: 'Appeal procedures not followed or time limits not met',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '139',
    description:
      'Contracted funding agreement - Loss Adjustment Triggered by covered entity',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '140',
    description:
      'Patient/Insured health identification number and name do not match',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '141',
    description:
      'Claim spans eligible and ineligible periods of coverage, this is the reduction for the ineligible period',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '142',
    description: 'Monthly Medicaid patient liability amount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '143',
    description: 'Portion of payment deferred',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '144',
    description: 'Incentive adjustment, e.g. preferred product/service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '146',
    description:
      'Diagnosis was invalid for the date(s) of service reported',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '147',
    description:
      'Provider contracted/negotiated rate expired or not on file',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '148',
    description:
      'Information from another provider was not provided or was insufficient/incomplete',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '149',
    description:
      'Lifetime benefit maximum has been reached for this service/benefit category',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '150',
    description:
      'Payer deems the information submitted does not support this level of service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '151',
    description:
      'Payment adjusted because the payer deems the information submitted does not support this many/frequency of services',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '152',
    description:
      'Payer deems the information submitted does not support this length of service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '153',
    description:
      'Payer deems the information submitted does not support this dosage',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '154',
    description: 'Patient is not of appropriate age',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '155',
    description: 'Patient is not of appropriate gender',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '157',
    description:
      'Service/procedure was provided as a result of an act of war',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '158',
    description:
      'Service/procedure was provided outside of the United States',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '159',
    description:
      'Service/procedure was provided as a result of terrorism',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '160',
    description:
      'Injury/illness was the result of an activity that is a benefit exclusion',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '161',
    description: 'Provider performance bonus',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '163',
    description:
      'Attachment/other documentation referenced on the claim was not received',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '164',
    description:
      'Attachment/other documentation referenced on the claim was not received in a timely fashion',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '166',
    description:
      "These services were submitted after this payer's responsibility for processing claims under this plan ended",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '167',
    description: 'This (these) diagnosis(es) is (are) not covered',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '169',
    description: 'Alternate benefit has been provided',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '170',
    description:
      'Payment is denied when performed/billed by this type of provider',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '171',
    description:
      'Payment is denied when performed/billed by this type of provider in this type of facility',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '172',
    description:
      'Payment is adjusted when performed/billed by a provider of this specialty',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '173',
    description: 'Service/equipment was not prescribed by a physician',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '174',
    description: 'Service was not prescribed prior to delivery',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '175',
    description: 'Prescription is incomplete',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '176',
    description: 'Prescription is not current',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '177',
    description:
      'Patient has not met the required eligibility requirements',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '178',
    description:
      'Patient has not met the required spend down requirements',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '179',
    description: 'Patient has not met the required waiting requirements',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '180',
    description:
      'Patient has not met the required residency requirements',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '181',
    description: 'Procedure code was invalid on the date of service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '182',
    description: 'Procedure modifier was invalid on the date of service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '183',
    description:
      'The referring provider is not eligible to refer the service billed',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '184',
    description:
      'The prescribing/ordering provider is not eligible to prescribe/order the service billed',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '185',
    description:
      'The rendering provider is not eligible to perform/render the service billed',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '186',
    description: 'Level of care change adjustment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '187',
    description:
      'Consumer Operated and Oriented Plan (CO-OP) adjustment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '189',
    description:
      "'Not otherwise classified' or 'unlisted' procedure code (CPT/HCPCS) was billed when there is a specific procedure code for this procedure/service",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '190',
    description:
      'Payment is included in the allowance for a Diagnosis Related Group (DRG)',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '191',
    description: 'Not a valid value for the related condition code',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '192',
    description: 'Non standard adjustment code from an authorized source',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '193',
    description: 'Original payment decision is being maintained',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '194',
    description:
      'Anesthesia performed by the operating physician, the assistant surgeon or the attending physician',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '195',
    description:
      'Refund issued to an erroneous priority payer for this claim/service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '197',
    description:
      'Precertification/authorization/notification/pre-treatment absent',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '198',
    description:
      'Precertification/authorization/notification/pre-treatment exceeded',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '199',
    description: 'Revenue code and Procedure code do not match',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '200',
    description: 'Expenses incurred during lapse in coverage',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '201',
    description:
      "Workers' Compensation case settled. Patient is responsible for the amount of this claim/service through WC 'Medicare Set Aside Arrangement' or other agreement",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '202',
    description: 'Non-covered personal comfort or convenience services',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '203',
    description: 'Discontinued or reduced service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '204',
    description:
      "This service/equipment/drug is not covered under the patient's current benefit plan",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '205',
    description: 'Pharmacy discount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '206',
    description: 'National Provider Identifier - Entity Not Eligible',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '207',
    description:
      'Claim/service denied based on the disposition of a related claim',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '208',
    description:
      'Claim/service denied based on the disposition of a prior claim',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '209',
    description:
      'Per regulatory or other agreement. The provider cannot collect this amount from the patient. However, this amount may be billed to subsequent payer. Refund to patient if collected. (Use only with Group code OA)',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '210',
    description:
      'Payment adjusted because pre-certification/authorization not received in a timely fashion',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '211',
    description:
      'National Drug Codes (NDC) not eligible for rebate, are not covered',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '212',
    description: 'Administrative surcharges are not covered',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '213',
    description:
      'Non-compliance with the physician self-referral prohibition legislation or the Physician Anti-Kickback Statute',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '215',
    description: 'Based on subrogation of a third party settlement',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '216',
    description: 'Based on the findings of a review organization',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '217',
    description:
      'Based on payer reasonable and customary fees. No maximum allowable defined',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '219',
    description: 'Based on extent of injury',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '222',
    description:
      'Exceeds the contracted maximum number of hours/days/units by this provider for this period',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '223',
    description:
      'Adjustment code for mandated federal, state or local law/regulation that is not already covered by another code and is mandated before a new code can be created',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '224',
    description:
      'Patient identification compromised by identity theft or fraud',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '226',
    description:
      'Information requested from the Billing/Rendering Provider was not provided or was insufficient/incomplete',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '227',
    description:
      'Information requested from the patient/insured/responsible party was not provided or was insufficient/incomplete',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '228',
    description:
      "Denied for failure of this provider, another provider or spouse to comply with the payer's health care facility franchise",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '229',
    description:
      'Partial charge amount not considered by Medicare due to the initial claim associated with this service was denied',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '231',
    description:
      'Mutually exclusive procedures cannot be done in the same day/setting',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '232',
    description: 'Institutional Transfer Amount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '233',
    description:
      'Services/charges related to the treating of a hospital-acquired condition or preventable medical error',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '234',
    description: 'This procedure is not paid separately',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '235',
    description: 'Sales Tax',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '236',
    description:
      'This procedure or procedure/modifier combination is not compatible with another procedure or procedure/modifier combination provided on the same day',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '237',
    description: 'Legislated/Regulatory Penalty',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '238',
    description:
      'Claim spans eligible and ineligible periods of coverage',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '239',
    description:
      'Claim spans eligible and ineligible periods of coverage, this is the increase for the eligible period',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '240',
    description:
      "The diagnosis is inconsistent with the patient's birth weight",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '241',
    description: 'Low Income Subsidy (LIS) copay amount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '242',
    description:
      'Services not provided by network/primary care providers',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '243',
    description:
      'Services not authorized by network/primary care providers',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '244',
    description: 'Payment reduced to zero due to litigation',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '245',
    description: 'Provider performance program withholding',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '246',
    description: 'This non-payable code is for required reporting only',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '247',
    description: 'Deductible for Professional services',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '248',
    description: 'Coinsurance for Professional services',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '249',
    description: 'This claim has been identified as a recoupment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '250',
    description:
      'The attachment/other documentation that was received was the incorrect attachment/document',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '251',
    description:
      'The attachment/other documentation that was received was incomplete or deficient',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '252',
    description:
      'An attachment/other documentation is required to adjudicate this claim/service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '253',
    description:
      'Sequestration - Loss Adjustment Triggered by Federal Government',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '254',
    description:
      'Claim received by the dental plan, but benefits not available under this plan',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '256',
    description: 'Service not payable per managed care contract',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '257',
    description:
      'The disposition of the claim/service is undetermined during the premium payment grace period',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '258',
    description: 'Claim adjusted based on the plan',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '259',
    description:
      'Additional payment for Dental/Vision service utilization',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '260',
    description:
      'Claim received by the medical plan, but benefits not available under this plan',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '261',
    description:
      "The procedure or service is inconsistent with the patient's history",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '262',
    description: 'Adjustment for delivery to member',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '263',
    description: 'Adjustment for shipping charges',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '264',
    description: 'Adjustment for postage charges',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '265',
    description: 'Adjustment for processing charges',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '266',
    description: 'Adjustment for Compound Preparation charges',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '267',
    description:
      'The Claim/Service is not payable because the inventory item is not available at the time of dispensing',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '268',
    description:
      'The Claim/Service is not payable because the inventory item is obsolete at the time of dispensing',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '269',
    description:
      'Claim/Service denied because of the packaging guidelines',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '270',
    description:
      'Claim/service denied. The claim was submitted with the incorrect patient identifier',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '271',
    description:
      'Prior contractual reductions related to a current periodic payment as part of a contractual payment schedule when deferred amounts have been previously reported',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '272',
    description: 'Coverage/program guidelines were not met',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '273',
    description: 'Coverage/program guidelines were exceeded',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '274',
    description:
      'Fee/Service not payable per patient Care Coordination arrangement',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '275',
    description:
      "Prior payer's (or payers') parsing of claim results in a balance owed by the subscriber which this payer does not cover and for which the provider is liable",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '276',
    description:
      'Services denied by the prior payer(s) are not covered by this payer',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '277',
    description:
      'The disposition of this claim/service is undetermined',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '278',
    description:
      'Under Jurisdiction of OWCP (Office of Workers Compensation)',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '279',
    description:
      'Claim/service not covered when patient is in custody/incarceration',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '280',
    description:
      'Claim adjustment for previously adjudicated and reimbursed professional claim(s) due to a periodic payment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '281',
    description: 'Deductible waived - Loss Adjustment Triggered',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '282',
    description:
      'The procedure/revenue code is inconsistent with the type of bill',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '283',
    description:
      'Claim/service not covered when patient is not a resident of the applicable geographic area',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '284',
    description:
      'Precertification/authorization/notification/pre-treatment - Loss Adjustment Triggered',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '285',
    description: 'Appeal procedures - Loss Adjustment Triggered',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '286',
    description: 'Appeal - Loss Adjustment Triggered',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '287',
    description: 'Referral absent or exceeded',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '288',
    description:
      'Claim/Service not payable - Loss Adjustment Triggered',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '289',
    description:
      'Claim/Service adjusted - Loss Adjustment Triggered',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '290',
    description:
      "Claim/Service not payable based on the patient's financial responsibility",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: '291',
    description:
      'Adjusted for a claim/service that was adjusted in a previous payment',
    startDate: '1995-01-01',
    isActive: true,
  },

  /* ---- Alpha-prefixed codes ---- */

  {
    code: 'A0',
    description: 'Patient refund amount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'A1',
    description: 'Claim denied charges',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'A5',
    description: 'Medicare Claim PPS Capital Cost Outlier Amount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'A6',
    description:
      'Prior hospitalization or 30 day transfer requirement not met',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'A7',
    description: 'Presumptive Payment Adjustment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'A8',
    description: 'Ungroupable DRG',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B1',
    description: 'Non-covered visits',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B4',
    description: 'Late filing penalty',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B5',
    description:
      'Coverage/program guidelines were not met or were exceeded',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B7',
    description:
      'This provider was not certified/eligible to be paid for this procedure/service on this date of service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B8',
    description:
      'Alternative services were available, and should have been utilized',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B9',
    description: 'Patient is enrolled in a Hospice',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B10',
    description:
      'Allowed amount has been reduced because a component of the basic procedure/test was paid as a separate procedure/test',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B11',
    description:
      'The claim/service has been transferred to the proper payer/processor for processing. Claim/service not covered by this payer/processor',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B12',
    description: "Services not documented in patients' medical records",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B13',
    description:
      'Previously paid. Payment for this claim/service may have been provided in a previous payment',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B14',
    description:
      'Only one visit or consultation per physician per day is covered',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B15',
    description:
      'This service/procedure requires that a qualifying service/procedure be received and covered. The qualifying service/procedure had not been received/adjudicated',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B16',
    description: "'New Patient' qualifications were not met",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B20',
    description:
      'Procedure/service was partially or fully furnished by another provider',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B22',
    description: 'This payment is adjusted based on the diagnosis',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'B23',
    description:
      'Procedure billed is not authorized per your Clinical Laboratory Improvement Amendments (CLIA) proficiency test',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P1',
    description:
      'State-mandated Requirement for Property and Casualty',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P2',
    description:
      'Not a work-related injury/illness and target the liability of the no-fault carrier or the workers compensation carrier',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P3',
    description: "Workers' Compensation case settled",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P4',
    description:
      "Workers' Compensation claim adjudicated as non-compensable",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P5',
    description:
      'Based on payer requirements, this claim/service must be billed to a specific payer',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P6',
    description: "Beyond the scope of the payer's responsibility",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P7',
    description:
      'The applicable fee schedule does not contain the billed code',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P8',
    description: 'Claim is under investigation',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P9',
    description:
      'No available or correlating CPT/HCPCS code to identify this service',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P10',
    description:
      'Payment will be reduced according to the Multiple Procedure Payment Reduction (MPPR) schedule',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P11',
    description:
      'The disposition of this claim/service line is pending',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P12',
    description: "Workers' Compensation - Loss Adjustment Triggered",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P13',
    description:
      "Payment reduced or denied based on workers' compensation jurisdictional regulations",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P14',
    description:
      'The Benefit for this Service is Included in the Payment/Allowance for another service/procedure',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P15',
    description:
      "Workers' Compensation Medical Treatment Guideline Adjustment",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P16',
    description: "Workers' Compensation Supplemental payment",
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P17',
    description: 'Adjusted based on a Medical Fee Schedule Benchmark',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P18',
    description:
      'Adjusted based on a Relative Value Unit (RVU) Calculation',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P19',
    description: 'Adjusted based on a Fee Schedule Conversion Factor',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P20',
    description:
      'Service is not covered when submitted for this provider type',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P21',
    description:
      'Payment adjusted for network provider operating on a scheduled payment arrangement and target the above fee schedule amount',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P22',
    description:
      'Payment adjusted based on applicable Value-Based Purchasing (VBP) Program',
    startDate: '1995-01-01',
    isActive: true,
  },
  {
    code: 'P23',
    description: 'Payment adjusted based on Quality measure reporting',
    startDate: '1995-01-01',
    isActive: true,
  },
];

/** Only codes currently active (no stop date or stop date in the future) */
export const ACTIVE_CARC_CODES = CARC_CODES.filter((c) => c.isActive);

/** Format a CARC code for display: "CODE - Description" */
export function formatCARCLabel(carc: CARCCode): string {
  return `${carc.code} - ${carc.description}`;
}
