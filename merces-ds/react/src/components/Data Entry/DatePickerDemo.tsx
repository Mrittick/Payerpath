import { useState, useCallback, useRef, useEffect } from 'react';
import { DateField } from './Date Field/DateField';
import type { DateFieldType } from './Date Field/DateField';
import { SingleDatePicker } from './Single Date Picker/SingleDatePicker';
import { RangedDatePicker } from './Ranged Date Picker/RangedDatePicker';
import { CalendarUI } from '../Inputs and Interactive/Calendar/CalendarUI/CalendarUI';

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

/* ---- Date formatting helper ---- */

function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d} / ${m} / ${y}`;
}

/* ---- Date validation helpers ---- */

/** Validate a date for a "date of birth" field — must be in the past, reasonable age */
function validateDOB(date: Date | null, raw: string): { type: DateFieldType; message?: string } {
  if (!raw || raw.trim().length === 0 || raw === 'dd / mm / yyyy') return { type: 'valid' };
  if (!date) return { type: 'warning', message: 'Please enter the full date' };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date.getTime() > today.getTime()) return { type: 'error', message: 'Date of birth cannot be in the future' };
  const age = today.getFullYear() - date.getFullYear();
  if (age > 150) return { type: 'error', message: 'Please enter a realistic date of birth' };
  if (age < 18) return { type: 'warning', message: 'Patient is under 18 — parental consent required' };
  return { type: 'valid' };
}

/** Validate a date for "appointment" — must be today or future */
function validateAppointment(date: Date | null, raw: string): { type: DateFieldType; message?: string } {
  if (!raw || raw.trim().length === 0 || raw === 'dd / mm / yyyy') return { type: 'valid' };
  if (!date) return { type: 'warning', message: 'Please enter the full date' };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date.getTime() < today.getTime()) return { type: 'error', message: 'Appointment date cannot be in the past' };
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return { type: 'warning', message: 'Selected date falls on a weekend' };
  return { type: 'valid' };
}

/** Validate a follow-up date — must be future, at least 7 days out */
function validateFollowUp(date: Date | null, raw: string): { type: DateFieldType; message?: string } {
  if (!raw || raw.trim().length === 0 || raw === 'dd / mm / yyyy') return { type: 'valid' };
  if (!date) return { type: 'warning', message: 'Please enter the full date' };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date.getTime() < today.getTime()) return { type: 'error', message: 'Follow-up must be a future date' };
  const diffDays = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) return { type: 'warning', message: 'Follow-up is less than 7 days away — confirm with patient' };
  return { type: 'valid' };
}

/** Minimal range validation — just check for incomplete input */
function validateRange(
  start: Date | null,
  end: Date | null,
  startRaw: string,
  endRaw: string,
): {
  startV: { type: DateFieldType; message?: string };
  endV: { type: DateFieldType; message?: string };
} {
  const startV: { type: DateFieldType; message?: string } = { type: 'valid' };
  const endV: { type: DateFieldType; message?: string } = { type: 'valid' };

  if (startRaw && startRaw !== 'dd / mm / yyyy' && !start) {
    startV.type = 'warning';
    startV.message = 'Please enter the full date';
  }
  if (endRaw && endRaw !== 'dd / mm / yyyy' && !end) {
    endV.type = 'warning';
    endV.message = 'Please enter the full date';
  }

  return { startV, endV };
}

export function DatePickerDemo() {
  /* ---- Single date: Date of Birth ---- */
  const [dobDate, setDobDate] = useState<Date | null>(null);
  const [dobRaw, setDobRaw] = useState('');
  const [dobCalOpen, setDobCalOpen] = useState(false);

  const handleDobChange = useCallback((date: Date | null, raw: string) => {
    setDobDate(date);
    setDobRaw(raw);
  }, []);

  const dobV = validateDOB(dobDate, dobRaw);

  /* ---- Single date: Appointment ---- */
  const [apptDate, setApptDate] = useState<Date | null>(null);
  const [apptRaw, setApptRaw] = useState('');
  const [apptCalOpen, setApptCalOpen] = useState(false);

  const handleApptChange = useCallback((date: Date | null, raw: string) => {
    setApptDate(date);
    setApptRaw(raw);
  }, []);

  const apptV = validateAppointment(apptDate, apptRaw);

  /* ---- Single date: Follow-up (horizontal) ---- */
  const [followDate, setFollowDate] = useState<Date | null>(null);
  const [followRaw, setFollowRaw] = useState('');
  const [followCalOpen, setFollowCalOpen] = useState(false);

  const handleFollowChange = useCallback((date: Date | null, raw: string) => {
    setFollowDate(date);
    setFollowRaw(raw);
  }, []);

  const followV = validateFollowUp(followDate, followRaw);

  /* ---- Ranged date: Treatment Period ---- */
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [rangeStartRaw, setRangeStartRaw] = useState('');
  const [rangeEndRaw, setRangeEndRaw] = useState('');
  const [rangeCalOpen, setRangeCalOpen] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);

  const handleRangeStartChange = useCallback((date: Date | null, raw: string) => {
    setRangeStart(date);
    setRangeStartRaw(raw);
  }, []);

  const handleRangeEndChange = useCallback((date: Date | null, raw: string) => {
    setRangeEnd(date);
    setRangeEndRaw(raw);
  }, []);

  const handleRangeCalendarChange = useCallback((range: { start: Date | null; end: Date | null }) => {
    setRangeStart(range.start);
    setRangeStartRaw(range.start ? formatDate(range.start) : '');
    setRangeEnd(range.end);
    setRangeEndRaw(range.end ? formatDate(range.end) : '');
    if (range.start && range.end) {
      setRangeCalOpen(false);
    }
  }, []);

  const rangeV = validateRange(rangeStart, rangeEnd, rangeStartRaw, rangeEndRaw);

  /* Close ranged calendar on outside click */
  useEffect(() => {
    if (!rangeCalOpen) return;
    function handleOutside(e: MouseEvent) {
      if (rangeRef.current && !rangeRef.current.contains(e.target as Node)) {
        setRangeCalOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [rangeCalOpen]);

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ ...heading, fontSize: 24, marginBottom: 32 }}>
        Date Picker Components
      </h1>

      {/* ---- Single Date Pickers ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Single Date Picker — Live Validation</h2>

        <h3 style={subheading}>Date of Birth (must be in the past, 18+ check)</h3>
        <div style={row}>
          <SingleDatePicker label="Date of Birth" layout="vertical">
            <DateField
              value={dobDate}
              onChange={handleDobChange}
              type={dobV.type}
              message={dobV.message}
              calendarOpen={dobCalOpen}
              onCalendarToggle={setDobCalOpen}
            />
          </SingleDatePicker>
        </div>

        <h3 style={subheading}>Appointment Date (must be future, weekend warning)</h3>
        <div style={row}>
          <SingleDatePicker label="Next Appointment" layout="vertical">
            <DateField
              value={apptDate}
              onChange={handleApptChange}
              type={apptV.type}
              message={apptV.message}
              calendarOpen={apptCalOpen}
              onCalendarToggle={setApptCalOpen}
            />
          </SingleDatePicker>
        </div>
      </div>

      {/* ---- Disabled Date Fields ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Disabled Date Fields</h2>
        <div style={row}>
          <SingleDatePicker label="Registration Date" layout="vertical">
            <DateField
              value={new Date(2024, 2, 15)}
              actionable={false}
            />
          </SingleDatePicker>
          <SingleDatePicker label="Discharge Date" layout="vertical">
            <DateField
              value={null}
              actionable={false}
              placeholder="Not discharged"
            />
          </SingleDatePicker>
        </div>
      </div>

      {/* ---- Ranged Date Picker ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Ranged Date Picker</h2>

        <h3 style={subheading}>Treatment Period</h3>
        <div ref={rangeRef} style={{ position: 'relative', ...row, maxWidth: 520 }}>
          <RangedDatePicker label="Treatment Period" layout="vertical">
            <DateField
              value={rangeStart}
              rawText={rangeStartRaw}
              onChange={handleRangeStartChange}
              type={rangeV.startV.type}
              message={rangeV.startV.message}
              placeholder="Start date"
              calendarOpen={false}
              onCalendarToggle={(open) => { if (open) setRangeCalOpen(true); }}
            />
            <DateField
              value={rangeEnd}
              rawText={rangeEndRaw}
              onChange={handleRangeEndChange}
              type={rangeV.endV.type}
              message={rangeV.endV.message}
              placeholder="End date"
              calendarOpen={false}
              onCalendarToggle={(open) => { if (open) setRangeCalOpen(true); }}
            />
          </RangedDatePicker>

          {/* Ranged calendar dropdown — positioned below the entire picker.
              onMouseDown preventDefault keeps focus in the DateField input
              so the blur handler doesn't clobber the calendar's selection. */}
          {rangeCalOpen && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 8,
                zIndex: 100,
              }}
            >
              <CalendarUI
                ranged
                selectedRange={{ start: rangeStart, end: rangeEnd }}
                onRangeChange={handleRangeCalendarChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* ---- Horizontal layout ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Horizontal Layout</h2>
        <h3 style={subheading}>Follow-up (must be future, 7-day minimum warning)</h3>
        <div style={{ ...row, maxWidth: 500 }}>
          <SingleDatePicker label="Follow-up" layout="horizontal">
            <DateField
              value={followDate}
              onChange={handleFollowChange}
              type={followV.type}
              message={followV.message}
              calendarOpen={followCalOpen}
              onCalendarToggle={setFollowCalOpen}
            />
          </SingleDatePicker>
        </div>
      </div>
    </div>
  );
}
