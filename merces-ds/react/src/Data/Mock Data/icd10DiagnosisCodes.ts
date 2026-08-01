/* ==========================================================================
   ICD-10-CM Diagnosis Codes (subset)
   Common diagnosis codes used in medical billing and claims processing.
   Centralised dataset for Modal Field overlay demo scenarios.
   ========================================================================== */

export interface ICD10Code {
  /** ICD-10-CM code (e.g. "E11.9", "J06.9") */
  code: string;
  /** Clinical description */
  description: string;
  /** Category grouping */
  category: string;
  /** Whether the code is currently billable */
  isActive: boolean;
}

export const ICD10_CODES: ICD10Code[] = [
  { code: 'A09', description: 'Infectious gastroenteritis and colitis, unspecified', category: 'Infectious', isActive: true },
  { code: 'A41.9', description: 'Sepsis, unspecified organism', category: 'Infectious', isActive: true },
  { code: 'A49.9', description: 'Bacterial infection, unspecified', category: 'Infectious', isActive: true },
  { code: 'B34.9', description: 'Viral infection, unspecified', category: 'Infectious', isActive: true },
  { code: 'C34.90', description: 'Malignant neoplasm of unspecified part of unspecified bronchus or lung', category: 'Neoplasms', isActive: true },
  { code: 'C50.919', description: 'Malignant neoplasm of unspecified site of unspecified female breast', category: 'Neoplasms', isActive: true },
  { code: 'C61', description: 'Malignant neoplasm of prostate', category: 'Neoplasms', isActive: true },
  { code: 'D64.9', description: 'Anemia, unspecified', category: 'Blood', isActive: true },
  { code: 'E03.9', description: 'Hypothyroidism, unspecified', category: 'Endocrine', isActive: true },
  { code: 'E05.90', description: 'Thyrotoxicosis, unspecified without thyrotoxic crisis or storm', category: 'Endocrine', isActive: true },
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', category: 'Endocrine', isActive: true },
  { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia', category: 'Endocrine', isActive: true },
  { code: 'E11.22', description: 'Type 2 diabetes mellitus with diabetic chronic kidney disease', category: 'Endocrine', isActive: true },
  { code: 'E55.9', description: 'Vitamin D deficiency, unspecified', category: 'Endocrine', isActive: true },
  { code: 'E66.01', description: 'Morbid (severe) obesity due to excess calories', category: 'Endocrine', isActive: true },
  { code: 'E78.5', description: 'Hyperlipidemia, unspecified', category: 'Endocrine', isActive: true },
  { code: 'E87.6', description: 'Hypokalemia', category: 'Endocrine', isActive: true },
  { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified', category: 'Mental', isActive: true },
  { code: 'F33.0', description: 'Major depressive disorder, recurrent, mild', category: 'Mental', isActive: true },
  { code: 'F41.1', description: 'Generalized anxiety disorder', category: 'Mental', isActive: true },
  { code: 'F41.9', description: 'Anxiety disorder, unspecified', category: 'Mental', isActive: true },
  { code: 'G43.909', description: 'Migraine, unspecified, not intractable, without status migrainosus', category: 'Nervous', isActive: true },
  { code: 'G47.00', description: 'Insomnia, unspecified', category: 'Nervous', isActive: true },
  { code: 'G89.29', description: 'Other chronic pain', category: 'Nervous', isActive: true },
  { code: 'I10', description: 'Essential (primary) hypertension', category: 'Circulatory', isActive: true },
  { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris', category: 'Circulatory', isActive: true },
  { code: 'I48.91', description: 'Unspecified atrial fibrillation', category: 'Circulatory', isActive: true },
  { code: 'I50.9', description: 'Heart failure, unspecified', category: 'Circulatory', isActive: true },
  { code: 'I63.9', description: 'Cerebral infarction, unspecified', category: 'Circulatory', isActive: true },
  { code: 'I73.9', description: 'Peripheral vascular disease, unspecified', category: 'Circulatory', isActive: true },
  { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified', category: 'Respiratory', isActive: true },
  { code: 'J18.9', description: 'Pneumonia, unspecified organism', category: 'Respiratory', isActive: true },
  { code: 'J20.9', description: 'Acute bronchitis, unspecified', category: 'Respiratory', isActive: true },
  { code: 'J44.1', description: 'Chronic obstructive pulmonary disease with acute exacerbation', category: 'Respiratory', isActive: true },
  { code: 'J45.909', description: 'Unspecified asthma, uncomplicated', category: 'Respiratory', isActive: true },
  { code: 'K21.0', description: 'Gastro-esophageal reflux disease with esophagitis', category: 'Digestive', isActive: true },
  { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding', category: 'Digestive', isActive: true },
  { code: 'K58.9', description: 'Irritable bowel syndrome without diarrhea', category: 'Digestive', isActive: true },
  { code: 'K76.0', description: 'Fatty (change of) liver, not elsewhere classified', category: 'Digestive', isActive: true },
  { code: 'L03.90', description: 'Cellulitis, unspecified', category: 'Skin', isActive: true },
  { code: 'M17.9', description: 'Osteoarthritis of knee, unspecified', category: 'Musculoskeletal', isActive: true },
  { code: 'M54.5', description: 'Low back pain', category: 'Musculoskeletal', isActive: true },
  { code: 'M79.3', description: 'Panniculitis, unspecified', category: 'Musculoskeletal', isActive: true },
  { code: 'N18.9', description: 'Chronic kidney disease, unspecified', category: 'Genitourinary', isActive: true },
  { code: 'N39.0', description: 'Urinary tract infection, site not specified', category: 'Genitourinary', isActive: true },
  { code: 'N40.0', description: 'Benign prostatic hyperplasia without lower urinary tract symptoms', category: 'Genitourinary', isActive: true },
  { code: 'R05.9', description: 'Cough, unspecified', category: 'Symptoms', isActive: true },
  { code: 'R10.9', description: 'Unspecified abdominal pain', category: 'Symptoms', isActive: true },
  { code: 'R50.9', description: 'Fever, unspecified', category: 'Symptoms', isActive: true },
  { code: 'R51.9', description: 'Headache, unspecified', category: 'Symptoms', isActive: true },
  { code: 'R53.83', description: 'Other fatigue', category: 'Symptoms', isActive: true },
  { code: 'R73.03', description: 'Prediabetes', category: 'Symptoms', isActive: true },
  { code: 'Z00.00', description: 'Encounter for general adult medical examination without abnormal findings', category: 'Factors', isActive: true },
  { code: 'Z23', description: 'Encounter for immunization', category: 'Factors', isActive: true },
  { code: 'Z79.4', description: 'Long term (current) use of insulin', category: 'Factors', isActive: true },
  { code: 'Z87.891', description: 'Personal history of nicotine dependence', category: 'Factors', isActive: true },
];

/** Only currently billable codes */
export const ACTIVE_ICD10_CODES = ICD10_CODES.filter((c) => c.isActive);

/** Format an ICD-10 code for display: "CODE - Description" */
export function formatICD10Label(icd: ICD10Code): string {
  return `${icd.code} - ${icd.description}`;
}
