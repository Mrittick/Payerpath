/* ==========================================================================
   CPT Procedure Codes (subset)
   Common CPT codes used in medical billing. Mid-size dataset (~80 entries)
   to demonstrate the Modal Field overlay with moderately long descriptions.
   ========================================================================== */

export interface CPTCode {
  /** CPT code (e.g. "99213", "99214") */
  code: string;
  /** Procedure description */
  description: string;
  /** Category grouping */
  category: string;
  /** Whether the code is currently active */
  isActive: boolean;
}

export const CPT_CODES: CPTCode[] = [
  /* ---- Evaluation & Management ---- */
  { code: '99201', description: 'Office or other outpatient visit, new patient, straightforward', category: 'E&M', isActive: false },
  { code: '99202', description: 'Office or other outpatient visit, new patient, straightforward MDM', category: 'E&M', isActive: true },
  { code: '99203', description: 'Office or other outpatient visit, new patient, low MDM', category: 'E&M', isActive: true },
  { code: '99204', description: 'Office or other outpatient visit, new patient, moderate MDM', category: 'E&M', isActive: true },
  { code: '99205', description: 'Office or other outpatient visit, new patient, high MDM', category: 'E&M', isActive: true },
  { code: '99211', description: 'Office or other outpatient visit, established patient, may not require physician presence', category: 'E&M', isActive: true },
  { code: '99212', description: 'Office or other outpatient visit, established patient, straightforward MDM', category: 'E&M', isActive: true },
  { code: '99213', description: 'Office or other outpatient visit, established patient, low MDM', category: 'E&M', isActive: true },
  { code: '99214', description: 'Office or other outpatient visit, established patient, moderate MDM', category: 'E&M', isActive: true },
  { code: '99215', description: 'Office or other outpatient visit, established patient, high MDM', category: 'E&M', isActive: true },
  { code: '99221', description: 'Initial hospital inpatient or observation care, straightforward or low MDM', category: 'E&M', isActive: true },
  { code: '99222', description: 'Initial hospital inpatient or observation care, moderate MDM', category: 'E&M', isActive: true },
  { code: '99223', description: 'Initial hospital inpatient or observation care, high MDM', category: 'E&M', isActive: true },
  { code: '99231', description: 'Subsequent hospital inpatient or observation care, straightforward or low MDM', category: 'E&M', isActive: true },
  { code: '99232', description: 'Subsequent hospital inpatient or observation care, moderate MDM', category: 'E&M', isActive: true },
  { code: '99233', description: 'Subsequent hospital inpatient or observation care, high MDM', category: 'E&M', isActive: true },
  { code: '99238', description: 'Hospital inpatient or observation discharge day management, 30 min or less', category: 'E&M', isActive: true },
  { code: '99239', description: 'Hospital inpatient or observation discharge day management, more than 30 min', category: 'E&M', isActive: true },
  { code: '99281', description: 'Emergency department visit, straightforward MDM', category: 'E&M', isActive: true },
  { code: '99282', description: 'Emergency department visit, low MDM', category: 'E&M', isActive: true },
  { code: '99283', description: 'Emergency department visit, moderate MDM', category: 'E&M', isActive: true },
  { code: '99284', description: 'Emergency department visit, moderate to high MDM', category: 'E&M', isActive: true },
  { code: '99285', description: 'Emergency department visit, high MDM', category: 'E&M', isActive: true },
  { code: '99291', description: 'Critical care, first 30-74 minutes', category: 'E&M', isActive: true },
  { code: '99292', description: 'Critical care, each additional 30 minutes', category: 'E&M', isActive: true },

  /* ---- Preventive Medicine ---- */
  { code: '99381', description: 'Initial comprehensive preventive medicine evaluation, infant (age under 1 year)', category: 'Preventive', isActive: true },
  { code: '99385', description: 'Initial comprehensive preventive medicine evaluation, 18-39 years', category: 'Preventive', isActive: true },
  { code: '99386', description: 'Initial comprehensive preventive medicine evaluation, 40-64 years', category: 'Preventive', isActive: true },
  { code: '99387', description: 'Initial comprehensive preventive medicine evaluation, 65 years and older', category: 'Preventive', isActive: true },
  { code: '99391', description: 'Periodic comprehensive preventive medicine reevaluation, infant (age under 1 year)', category: 'Preventive', isActive: true },
  { code: '99395', description: 'Periodic comprehensive preventive medicine reevaluation, 18-39 years', category: 'Preventive', isActive: true },
  { code: '99396', description: 'Periodic comprehensive preventive medicine reevaluation, 40-64 years', category: 'Preventive', isActive: true },
  { code: '99397', description: 'Periodic comprehensive preventive medicine reevaluation, 65 years and older', category: 'Preventive', isActive: true },

  /* ---- Surgery ---- */
  { code: '10021', description: 'Fine needle aspiration biopsy without imaging guidance, first lesion', category: 'Surgery', isActive: true },
  { code: '10060', description: 'Incision and drainage of abscess, simple or single', category: 'Surgery', isActive: true },
  { code: '10120', description: 'Incision and removal of foreign body, subcutaneous tissues, simple', category: 'Surgery', isActive: true },
  { code: '11102', description: 'Tangential biopsy of skin, single lesion', category: 'Surgery', isActive: true },
  { code: '11104', description: 'Punch biopsy of skin, single lesion', category: 'Surgery', isActive: true },
  { code: '11106', description: 'Incisional biopsy of skin, single lesion', category: 'Surgery', isActive: true },
  { code: '17000', description: 'Destruction of premalignant lesion, first lesion', category: 'Surgery', isActive: true },
  { code: '17110', description: 'Destruction of benign lesions, up to 14 lesions', category: 'Surgery', isActive: true },
  { code: '20610', description: 'Arthrocentesis, aspiration and/or injection of major joint or bursa', category: 'Surgery', isActive: true },
  { code: '27447', description: 'Total knee arthroplasty', category: 'Surgery', isActive: true },
  { code: '27130', description: 'Total hip arthroplasty', category: 'Surgery', isActive: true },

  /* ---- Radiology ---- */
  { code: '70553', description: 'MRI brain without contrast followed by contrast and further sequences', category: 'Radiology', isActive: true },
  { code: '71046', description: 'Radiologic examination of chest, 2 views', category: 'Radiology', isActive: true },
  { code: '71250', description: 'CT thorax without contrast', category: 'Radiology', isActive: true },
  { code: '72148', description: 'MRI lumbar spine without contrast', category: 'Radiology', isActive: true },
  { code: '73721', description: 'MRI any joint of lower extremity without contrast', category: 'Radiology', isActive: true },
  { code: '74177', description: 'CT abdomen and pelvis with contrast', category: 'Radiology', isActive: true },
  { code: '76856', description: 'Ultrasound pelvic, real time with image documentation, complete', category: 'Radiology', isActive: true },
  { code: '77067', description: 'Screening mammography, bilateral, including CAD', category: 'Radiology', isActive: true },

  /* ---- Pathology & Laboratory ---- */
  { code: '80048', description: 'Basic metabolic panel (calcium, total)', category: 'Lab', isActive: true },
  { code: '80053', description: 'Comprehensive metabolic panel', category: 'Lab', isActive: true },
  { code: '80061', description: 'Lipid panel', category: 'Lab', isActive: true },
  { code: '82947', description: 'Glucose, quantitative, blood (except reagent strip)', category: 'Lab', isActive: true },
  { code: '83036', description: 'Hemoglobin; glycosylated (A1C)', category: 'Lab', isActive: true },
  { code: '84443', description: 'Thyroid stimulating hormone (TSH)', category: 'Lab', isActive: true },
  { code: '85025', description: 'Complete blood count (CBC) with automated differential WBC count', category: 'Lab', isActive: true },
  { code: '85610', description: 'Prothrombin time (PT)', category: 'Lab', isActive: true },
  { code: '87086', description: 'Culture, bacterial; quantitative colony count, urine', category: 'Lab', isActive: true },
  { code: '87491', description: 'Infectious agent detection, Chlamydia trachomatis, amplified probe', category: 'Lab', isActive: true },

  /* ---- Medicine ---- */
  { code: '90460', description: 'Immunization administration through 18 years of age, first or only component', category: 'Medicine', isActive: true },
  { code: '90471', description: 'Immunization administration, one vaccine (single or combination)', category: 'Medicine', isActive: true },
  { code: '90658', description: 'Influenza virus vaccine, trivalent, split virus, 0.5 mL, for IM use', category: 'Medicine', isActive: true },
  { code: '90686', description: 'Influenza virus vaccine, quadrivalent, split virus, preservative free, 0.5 mL, for IM use', category: 'Medicine', isActive: true },
  { code: '90715', description: 'Tetanus, diphtheria toxoids, and acellular pertussis vaccine (Tdap), 7 years or older, for IM use', category: 'Medicine', isActive: true },
  { code: '93000', description: 'Electrocardiogram, routine ECG with at least 12 leads, with interpretation and report', category: 'Medicine', isActive: true },
  { code: '93306', description: 'Echocardiography, transthoracic, real-time with image documentation, complete', category: 'Medicine', isActive: true },
  { code: '96372', description: 'Therapeutic, prophylactic, or diagnostic injection, subcutaneous or intramuscular', category: 'Medicine', isActive: true },
  { code: '96413', description: 'Chemotherapy administration, IV infusion, up to 1 hour, single or initial substance/drug', category: 'Medicine', isActive: true },
  { code: '97110', description: 'Therapeutic exercises to develop strength, endurance, flexibility, and range of motion', category: 'Medicine', isActive: true },
  { code: '97140', description: 'Manual therapy techniques, one or more regions, each 15 minutes', category: 'Medicine', isActive: true },
  { code: '99406', description: 'Smoking and tobacco use cessation counseling visit, intermediate, 3-10 minutes', category: 'Medicine', isActive: true },
  { code: '99407', description: 'Smoking and tobacco use cessation counseling visit, intensive, greater than 10 minutes', category: 'Medicine', isActive: true },
];

/** Only currently active codes */
export const ACTIVE_CPT_CODES = CPT_CODES.filter((c) => c.isActive);

/** Format a CPT code for display: "CODE - Description" */
export function formatCPTLabel(cpt: CPTCode): string {
  return `${cpt.code} - ${cpt.description}`;
}
