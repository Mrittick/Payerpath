import { useState, useCallback } from 'react';
import { Message } from './Message/Message';
import { StringField } from './String Field/StringField';
import type { StringFieldType } from './String Field/StringField';
import { StringFieldGroup } from './String Field Group/StringFieldGroup';
import { MinMaxValuesStringGroup } from './Min-Max Values String Group/MinMaxValuesStringGroup';
import { ClearAll } from './Clear All/ClearAll';

/* ---- Layout helpers ---- */

const sectionStyle: React.CSSProperties = {
  marginBottom: 48,
};

const heading: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 16,
  fontFamily: 'Satoshi Variable, sans-serif',
  color: '#2F2257',
};

const subheading: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 8,
  fontFamily: 'Satoshi Variable, sans-serif',
  color: '#44376c',
};

const row: React.CSSProperties = {
  display: 'flex',
  gap: 24,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  marginBottom: 16,
};

const label: React.CSSProperties = {
  fontSize: 11,
  fontFamily: 'Satoshi Variable, sans-serif',
  color: '#88819c',
  marginBottom: 4,
};

/* ---- Validation helpers ---- */

/** Name: letters, spaces, hyphens, apostrophes only. No numbers or special chars. */
function validateName(value: string): { type: StringFieldType; message?: string } {
  if (value.length === 0) return { type: 'valid' };
  if (/\d/.test(value)) return { type: 'error', message: 'Names cannot contain numbers' };
  if (/[^a-zA-Z\s'\-.]/.test(value)) return { type: 'error', message: 'Names can only contain letters, spaces, hyphens and apostrophes' };
  if (value.trim().length < 2) return { type: 'warning', message: 'Name should be at least 2 characters' };
  return { type: 'valid' };
}

/** Email: basic format check — must have user@domain.tld pattern. */
function validateEmail(value: string): { type: StringFieldType; message?: string } {
  if (value.length === 0) return { type: 'valid' };
  if (!value.includes('@')) return { type: 'warning', message: 'Email must include @ symbol' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return { type: 'error', message: 'Invalid email address format' };
  return { type: 'valid' };
}

/** Numeric: only digits (and optional decimal point). No letters. */
function validateNumeric(value: string): { type: StringFieldType; message?: string } {
  if (value.length === 0) return { type: 'valid' };
  if (/[a-zA-Z]/.test(value)) return { type: 'error', message: 'This field only accepts numbers' };
  if (!/^\d+(\.\d*)?$/.test(value)) return { type: 'error', message: 'Invalid number format' };
  return { type: 'valid' };
}

/** Phone: digits, spaces, dashes, parens, optional leading +. */
function validatePhone(value: string): { type: StringFieldType; message?: string } {
  if (value.length === 0) return { type: 'valid' };
  if (/[a-zA-Z]/.test(value)) return { type: 'error', message: 'Phone numbers cannot contain letters' };
  const digits = value.replace(/\D/g, '');
  if (digits.length > 0 && digits.length < 7) return { type: 'warning', message: 'Phone number seems too short' };
  if (!/^[+]?[\d\s\-().]+$/.test(value)) return { type: 'error', message: 'Invalid phone number format' };
  return { type: 'valid' };
}

/** Min-Max: ensures min ≤ max when both are filled. */
function validateMinMax(
  min: string,
  max: string,
): { minResult: { type: StringFieldType; message?: string }; maxResult: { type: StringFieldType; message?: string } } {
  const minNum = validateNumeric(min);
  const maxNum = validateNumeric(max);

  /* If either has a format error, return that first */
  if (minNum.type === 'error' || maxNum.type === 'error') {
    return { minResult: minNum, maxResult: maxNum };
  }

  /* Both valid numbers — check range logic */
  if (min.length > 0 && max.length > 0) {
    const minVal = parseFloat(min);
    const maxVal = parseFloat(max);
    if (!isNaN(minVal) && !isNaN(maxVal) && minVal > maxVal) {
      return {
        minResult: { type: 'error', message: 'Min cannot exceed max' },
        maxResult: { type: 'error', message: 'Max must be greater than min' },
      };
    }
  }

  return { minResult: minNum, maxResult: maxNum };
}

export function DataEntryDemo() {
  /* ---- Patient Intake Form — realistic field state ---- */
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dosage, setDosage] = useState('');

  /* ---- Min-Max: Price Range (vertical) ---- */
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  /* ---- Min-Max: Age Range (horizontal) ---- */
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');

  /* ---- Derived validation ---- */
  const firstNameV = validateName(firstName);
  const lastNameV = validateName(lastName);
  const emailV = validateEmail(email);
  const phoneV = validatePhone(phone);
  const dosageV = validateNumeric(dosage);
  const priceRange = validateMinMax(priceMin, priceMax);
  const ageRange = validateMinMax(ageMin, ageMax);

  /* ---- Clear All ---- */
  const handleClearAll = useCallback(() => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setDosage('');
    setPriceMin('');
    setPriceMax('');
    setAgeMin('');
    setAgeMax('');
  }, []);

  const hasAnyValue = [
    firstName, lastName, email, phone, dosage,
    priceMin, priceMax, ageMin, ageMax,
  ].some(v => v.length > 0);

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ ...heading, fontSize: 24, marginBottom: 32 }}>
        Data Entry Components
      </h1>

      {/* ---- Message (standalone) ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Message</h2>
        <div style={row}>
          <div style={{ minWidth: 280 }}>
            <div style={label}>Warning</div>
            <Message type="warning">Name should be at least 2 characters</Message>
          </div>
          <div style={{ minWidth: 280 }}>
            <div style={label}>Error</div>
            <Message type="error">Invalid email address format</Message>
          </div>
        </div>
      </div>

      {/* ---- Patient Intake — Live Validation ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Patient Intake — Live Validation</h2>

        <h3 style={subheading}>Name Fields (letters only)</h3>
        <div style={row}>
          <StringFieldGroup label="First Name" layout="vertical">
            <StringField
              value={firstName}
              onChange={setFirstName}
              type={firstNameV.type}
              message={firstNameV.message}
              placeholder="e.g. Jane"
            />
          </StringFieldGroup>
          <StringFieldGroup label="Last Name" layout="vertical">
            <StringField
              value={lastName}
              onChange={setLastName}
              type={lastNameV.type}
              message={lastNameV.message}
              placeholder="e.g. O'Brien"
            />
          </StringFieldGroup>
        </div>

        <h3 style={subheading}>Contact Fields</h3>
        <div style={row}>
          <StringFieldGroup label="Email Address" layout="vertical" padding="span">
            <StringField
              value={email}
              onChange={setEmail}
              type={emailV.type}
              message={emailV.message}
              placeholder="user@hospital.org"
            />
          </StringFieldGroup>
          <StringFieldGroup label="Phone Number" layout="vertical">
            <StringField
              value={phone}
              onChange={setPhone}
              type={phoneV.type}
              message={phoneV.message}
              placeholder="+1 (555) 000-0000"
            />
          </StringFieldGroup>
        </div>

        <h3 style={subheading}>Numeric Input (numbers only)</h3>
        <div style={row}>
          <StringFieldGroup label="Dosage (mg)" layout="horizontal">
            <StringField
              value={dosage}
              onChange={setDosage}
              type={dosageV.type}
              message={dosageV.message}
              placeholder="e.g. 250"
            />
          </StringFieldGroup>
        </div>
      </div>

      {/* ---- Disabled Fields ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Disabled Fields (Actionable = False)</h2>
        <div style={row}>
          <StringFieldGroup label="Patient ID" layout="vertical">
            <StringField
              value="MRC-2024-00847"
              actionable={false}
            />
          </StringFieldGroup>
          <StringFieldGroup label="Assigned Facility" layout="vertical">
            <StringField
              value=""
              actionable={false}
              placeholder="Not assigned"
            />
          </StringFieldGroup>
        </div>
      </div>

      {/* ---- Min-Max Values String Group ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Min-Max Values — Range Validation</h2>

        <h3 style={subheading}>Price Range ($) — Vertical</h3>
        <div style={{ ...row, maxWidth: 400 }}>
          <MinMaxValuesStringGroup label="Price Range" layout="vertical">
            <StringField
              value={priceMin}
              onChange={setPriceMin}
              type={priceRange.minResult.type}
              message={priceRange.minResult.message}
              placeholder="Min"
            />
            <StringField
              value={priceMax}
              onChange={setPriceMax}
              type={priceRange.maxResult.type}
              message={priceRange.maxResult.message}
              placeholder="Max"
            />
          </MinMaxValuesStringGroup>
        </div>

        <h3 style={subheading}>Age Range — Horizontal</h3>
        <div style={{ ...row, maxWidth: 500 }}>
          <MinMaxValuesStringGroup label="Age Range" layout="horizontal">
            <StringField
              value={ageMin}
              onChange={setAgeMin}
              type={ageRange.minResult.type}
              message={ageRange.minResult.message}
              placeholder="Min"
            />
            <StringField
              value={ageMax}
              onChange={setAgeMax}
              type={ageRange.maxResult.type}
              message={ageRange.maxResult.message}
              placeholder="Max"
            />
          </MinMaxValuesStringGroup>
        </div>
      </div>

      {/* ---- Clear All ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Clear All</h2>
        <div style={row}>
          <div>
            <div style={label}>Enabled (clears all fields above)</div>
            <ClearAll onClick={handleClearAll} disabled={!hasAnyValue} />
          </div>
          <div>
            <div style={label}>Disabled</div>
            <ClearAll disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
