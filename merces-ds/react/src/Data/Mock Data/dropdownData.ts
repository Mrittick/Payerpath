/* ==========================================================================
   Mock Data — Dropdown Demo Items
   Centralised data definitions for all dropdown demo scenarios.
   Keeps DropdownDemo.tsx focused on layout/wiring, not data.
   ========================================================================== */

/* ---- Shared item type ---- */

export interface MockItem {
  label: string;
  disabled?: boolean;
}

export interface MockSection {
  title: string;
  items: MockItem[];
}

/* ================================================================
   Item Sets (Short Text)
   ================================================================ */

/* Reports (SingleSelectBasic, SingleSelectSections) */
export const REPORTS: MockItem[] = [
  { label: 'Denial Analysis' },
  { label: 'Payment Trends' },
  { label: 'Aging Report' },
  { label: 'Compliance Audit', disabled: true },
];

export const REPORT_SECTIONS: MockSection[] = [
  {
    title: 'Financial',
    items: [
      { label: 'Denial Analysis' },
      { label: 'Payment Trends' },
      { label: 'Revenue Cycle' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Aging Report' },
      { label: 'Compliance Audit' },
      { label: 'Staff Productivity', disabled: true },
    ],
  },
];

/* Diseases (Categorised scenarios) */
export const DISEASE_SECTIONS: MockSection[] = [
  {
    title: 'Communicable',
    items: [
      { label: 'Cholera' },
      { label: 'Rabies' },
      { label: 'COVID-19' },
      { label: 'Measles', disabled: true },
    ],
  },
  {
    title: 'Non - Communicable',
    items: [
      { label: 'Angina' },
      { label: 'Melanoma' },
      { label: 'Lymphoma', disabled: true },
    ],
  },
];

/* Medications — Antibiotics / Antivirals (SearchFilter scenario) */
export const MEDICATION_SECTIONS: MockSection[] = [
  {
    title: 'Antibiotics',
    items: [
      { label: 'Amoxicillin' },
      { label: 'Azithromycin' },
      { label: 'Ciprofloxacin', disabled: true },
    ],
  },
  {
    title: 'Antivirals',
    items: [
      { label: 'Oseltamivir' },
      { label: 'Remdesivir' },
      { label: 'Acyclovir' },
    ],
  },
];

/* Departments (MultiSelectBasic, HookMultiSelect) */
export const DEPARTMENTS: MockItem[] = [
  { label: 'Cardiology' },
  { label: 'Oncology' },
  { label: 'Neurology' },
  { label: 'Pediatrics', disabled: true },
  { label: 'Radiology' },
];

/* Services (MultiSelectAllSelectable, HookControlledSelection) */
export const SERVICES: string[] = [
  'Inpatient',
  'Outpatient',
  'Emergency',
  'Surgical',
  'Diagnostic',
];

/* Code Systems (MultiSelectWithSearch, HookMultiSelectWithSearch) */
export const CODE_SYSTEMS: string[] = [
  'ICD-10',
  'ICD-11',
  'CPT',
  'HCPCS',
  'DRG',
  'NDC',
  'SNOMED CT',
];

/* Workflows (MultiSelectFull, HookMultiSelectSections) */
export const WORKFLOWS: string[] = [
  'Claim Submission',
  'Eligibility Check',
  'Prior Authorization',
  'Payment Posting',
  'Denial Management',
  'Appeal Filing',
  'Patient Billing',
];

/* Fruits (Right orientation — simple) */
export const FRUITS: MockItem[] = [
  { label: 'Apple' },
  { label: 'Orange' },
  { label: 'Lemon' },
  { label: 'Kiwi', disabled: true },
];

/* OTC Medications (Right orientation — multi) */
export const OTC_MEDICATIONS: MockItem[] = [
  { label: 'Paracetamol' },
  { label: 'Ibuprofen' },
  { label: 'Aspirin' },
  { label: 'Codeine', disabled: true },
];

/* ================================================================
   Long-Text Equivalents
   Each value is 2–3 lines of realistic descriptive text to
   stress-test dropdown item layout at longer content lengths.
   ================================================================ */

export const LONG_LABELS: Record<string, string> = {
  /* Reports */
  'Denial Analysis': 'Denial Analysis — Comprehensive denial tracking by payer, reason code, and appeal outcome over rolling 12-month periods',
  'Payment Trends': 'Payment Trends — Historical reimbursement patterns across all payer classes with seasonal variance analysis',
  'Aging Report': 'Aging Report — Outstanding accounts receivable grouped by aging bucket with collector assignment and priority scoring',
  'Compliance Audit': 'Compliance Audit — Regulatory compliance review covering HIPAA, billing accuracy, and documentation standards',
  'Revenue Cycle': 'Revenue Cycle — End-to-end revenue cycle performance dashboard with key financial benchmarks and KPIs',
  'Staff Productivity': 'Staff Productivity — Individual and team performance metrics for claims processing throughput and accuracy',

  /* Diseases */
  'Cholera': 'Cholera — Acute diarrhoeal infection caused by ingestion of contaminated food or water, requiring immediate rehydration',
  'Rabies': 'Rabies — Fatal viral encephalitis transmitted through animal bites, preventable with post-exposure prophylaxis',
  'COVID-19': 'COVID-19 — Respiratory illness caused by SARS-CoV-2 with variable severity from asymptomatic to critical',
  'Measles': 'Measles — Highly contagious viral disease characterised by fever, cough, and maculopapular rash, preventable by vaccination',
  'Angina': 'Angina — Chest pain or discomfort caused by reduced blood flow to the heart muscle, often triggered by exertion',
  'Melanoma': 'Melanoma — Aggressive form of skin cancer arising from pigment-producing melanocytes, requiring early surgical excision',
  'Lymphoma': 'Lymphoma — Cancer originating in the lymphatic system, classified as Hodgkin or non-Hodgkin with distinct treatment protocols',

  /* Medications — Antibiotics/Antivirals */
  'Amoxicillin': 'Amoxicillin — Broad-spectrum penicillin antibiotic used for respiratory, urinary, and soft tissue infections',
  'Azithromycin': 'Azithromycin — Macrolide antibiotic with extended half-life, commonly prescribed for community-acquired pneumonia',
  'Ciprofloxacin': 'Ciprofloxacin — Fluoroquinolone antibiotic reserved for complicated UTIs and intra-abdominal infections',
  'Oseltamivir': 'Oseltamivir — Neuraminidase inhibitor antiviral used for treatment and prophylaxis of influenza A and B',
  'Remdesivir': 'Remdesivir — Intravenous nucleoside analogue initially developed for Ebola, repurposed for hospitalised COVID patients',
  'Acyclovir': 'Acyclovir — Antiviral agent selectively targeting herpes simplex and varicella-zoster virus replication',

  /* Departments */
  'Cardiology': 'Cardiology — Diagnosis and treatment of heart disorders including coronary artery disease and arrhythmias',
  'Oncology': 'Oncology — Comprehensive cancer care spanning chemotherapy, radiation therapy, and surgical intervention',
  'Neurology': 'Neurology — Management of nervous system disorders from epilepsy and stroke to neurodegenerative conditions',
  'Pediatrics': 'Pediatrics — Medical care for infants, children, and adolescents covering developmental and acute conditions',
  'Radiology': 'Radiology — Diagnostic imaging services including X-ray, CT, MRI, and interventional radiology procedures',

  /* Services */
  'Inpatient': 'Inpatient — Overnight hospital admissions requiring continuous nursing care and multi-disciplinary treatment plans',
  'Outpatient': 'Outpatient — Same-day clinical visits for consultations, minor procedures, and follow-up appointments',
  'Emergency': 'Emergency — Acute and life-threatening presentations requiring immediate triage and stabilisation protocols',
  'Surgical': 'Surgical — Elective and urgent operative procedures performed in sterile theatre environments',
  'Diagnostic': 'Diagnostic — Laboratory, pathology, and imaging investigations supporting clinical decision-making',

  /* Code Systems */
  'ICD-10': 'ICD-10 — International Classification of Diseases, 10th Revision, used globally for mortality and morbidity coding',
  'ICD-11': 'ICD-11 — Latest revision of the WHO classification system with expanded digital coding capabilities',
  'CPT': 'CPT — Current Procedural Terminology maintained by the AMA for reporting medical procedures and services',
  'HCPCS': 'HCPCS — Healthcare Common Procedure Coding System covering equipment, supplies, and non-physician services',
  'DRG': 'DRG — Diagnosis-Related Groups classifying inpatient stays into clinically coherent payment categories',
  'NDC': 'NDC — National Drug Code uniquely identifying drug products by labeller, product, and package configuration',
  'SNOMED CT': 'SNOMED CT — Systematised Nomenclature of Medicine providing comprehensive clinical terminology for EHR systems',

  /* Workflows */
  'Claim Submission': 'Claim Submission — Electronic or paper filing of healthcare claims to insurance payers with supporting documentation',
  'Eligibility Check': 'Eligibility Check — Real-time verification of patient insurance coverage, benefits, and co-pay responsibilities',
  'Prior Authorization': 'Prior Authorization — Prospective approval request to the payer before rendering services or prescribing medications',
  'Payment Posting': 'Payment Posting — Recording of insurance payments and patient remittances against outstanding account balances',
  'Denial Management': 'Denial Management — Systematic review, categorisation, and resolution of rejected or denied insurance claims',
  'Appeal Filing': 'Appeal Filing — Formal reconsideration request submitted to overturn a denied claim with additional clinical evidence',
  'Patient Billing': 'Patient Billing — Generation and delivery of patient statements for co-pays, deductibles, and self-pay balances',

  /* Fruits */
  'Apple': 'Apple — A crisp and juicy pomaceous fruit available in many cultivars from tart Granny Smith to sweet Fuji',
  'Orange': 'Orange — Citrus fruit rich in vitamin C with a segmented interior surrounded by a fragrant rind',
  'Lemon': 'Lemon — Sour citrus fruit widely used in culinary applications, beverages, and as a natural preservative',
  'Kiwi': 'Kiwi — Small oval fruit with fuzzy brown skin and bright green flesh dotted with tiny edible black seeds',

  /* OTC Medications */
  'Paracetamol': 'Paracetamol — First-line analgesic and antipyretic for mild to moderate pain, available over the counter worldwide',
  'Ibuprofen': 'Ibuprofen — Non-steroidal anti-inflammatory drug used for pain relief, fever reduction, and inflammation control',
  'Aspirin': 'Aspirin — Salicylate medication used as an analgesic, antipyretic, and low-dose cardiovascular prophylaxis',
  'Codeine': 'Codeine — Opioid analgesic prescribed for moderate pain and persistent cough, subject to controlled substance regulations',
};
