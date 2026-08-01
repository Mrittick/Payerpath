import { useState, useCallback } from 'react';
import { TimeField } from './Time Field/TimeField';
import { SingleTimePicker } from './Single Time Picker/SingleTimePicker';
import { RangedTimePicker } from './Ranged Time Picker/RangedTimePicker';

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

export function TimePickerDemo() {
  /* ---- Single 12hr ---- */
  const [time12, setTime12] = useState<string | null>(null);
  const [drop12, setDrop12] = useState(false);

  /* ---- Single 24hr ---- */
  const [time24, setTime24] = useState<string | null>(null);
  const [drop24, setDrop24] = useState(false);

  /* ---- Ranged 12hr ---- */
  const [rangeStart12, setRangeStart12] = useState<string | null>(null);
  const [rangeEnd12, setRangeEnd12] = useState<string | null>(null);
  const [dropStart12, setDropStart12] = useState(false);
  const [dropEnd12, setDropEnd12] = useState(false);

  const handleStart12Toggle = useCallback((open: boolean) => {
    setDropStart12(open);
    if (open) setDropEnd12(false);
  }, []);
  const handleEnd12Toggle = useCallback((open: boolean) => {
    setDropEnd12(open);
    if (open) setDropStart12(false);
  }, []);

  /* ---- Ranged 24hr ---- */
  const [rangeStart24, setRangeStart24] = useState<string | null>(null);
  const [rangeEnd24, setRangeEnd24] = useState<string | null>(null);
  const [dropStart24, setDropStart24] = useState(false);
  const [dropEnd24, setDropEnd24] = useState(false);

  const handleStart24Toggle = useCallback((open: boolean) => {
    setDropStart24(open);
    if (open) setDropEnd24(false);
  }, []);
  const handleEnd24Toggle = useCallback((open: boolean) => {
    setDropEnd24(open);
    if (open) setDropStart24(false);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ ...heading, fontSize: 24, marginBottom: 32 }}>
        Time Picker Components
      </h1>

      {/* ---- Single 12hr ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Single Time Picker — 12hr</h2>
        <div style={{ ...row, maxWidth: 400 }}>
          <SingleTimePicker label="Appointment Time" layout="vertical">
            <TimeField
              format="12hr"
              value={time12}
              onChange={setTime12}
              dropdownOpen={drop12}
              onDropdownToggle={setDrop12}
            />
          </SingleTimePicker>
        </div>
        <div style={subheading}>Value: {time12 ?? 'null'}</div>
      </div>

      {/* ---- Single 24hr ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Single Time Picker — 24hr</h2>
        <div style={{ ...row, maxWidth: 400 }}>
          <SingleTimePicker label="Shift Start" layout="vertical">
            <TimeField
              format="24hr"
              value={time24}
              onChange={setTime24}
              dropdownOpen={drop24}
              onDropdownToggle={setDrop24}
            />
          </SingleTimePicker>
        </div>
        <div style={subheading}>Value: {time24 ?? 'null'}</div>
      </div>

      {/* ---- Disabled ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Disabled Time Fields</h2>
        <div style={row}>
          <SingleTimePicker label="Check-in Time" layout="vertical">
            <TimeField format="12hr" value="9:00 am" actionable={false} />
          </SingleTimePicker>
          <SingleTimePicker label="System Time" layout="vertical">
            <TimeField format="24hr" value="14:30" actionable={false} />
          </SingleTimePicker>
        </div>
      </div>

      {/* ---- Ranged 12hr ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Ranged Time Picker — 12hr</h2>
        <div style={{ ...row, maxWidth: 520 }}>
          <RangedTimePicker label="Meeting Window" layout="vertical">
            <TimeField
              format="12hr"
              value={rangeStart12}
              onChange={setRangeStart12}
              placeholder="Start time"
              dropdownOpen={dropStart12}
              onDropdownToggle={handleStart12Toggle}
            />
            <TimeField
              format="12hr"
              value={rangeEnd12}
              onChange={setRangeEnd12}
              placeholder="End time"
              dropdownOpen={dropEnd12}
              onDropdownToggle={handleEnd12Toggle}
            />
          </RangedTimePicker>
        </div>
        <div style={subheading}>Start: {rangeStart12 ?? 'null'} | End: {rangeEnd12 ?? 'null'}</div>
      </div>

      {/* ---- Ranged 24hr ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Ranged Time Picker — 24hr</h2>
        <div style={{ ...row, maxWidth: 520 }}>
          <RangedTimePicker label="Operating Hours" layout="vertical">
            <TimeField
              format="24hr"
              value={rangeStart24}
              onChange={setRangeStart24}
              placeholder="Start"
              dropdownOpen={dropStart24}
              onDropdownToggle={handleStart24Toggle}
            />
            <TimeField
              format="24hr"
              value={rangeEnd24}
              onChange={setRangeEnd24}
              placeholder="End"
              dropdownOpen={dropEnd24}
              onDropdownToggle={handleEnd24Toggle}
            />
          </RangedTimePicker>
        </div>
        <div style={subheading}>Start: {rangeStart24 ?? 'null'} | End: {rangeEnd24 ?? 'null'}</div>
      </div>

      {/* ---- Horizontal layout ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Horizontal Layout</h2>
        <div style={{ ...row, maxWidth: 500 }}>
          <SingleTimePicker label="Reminder" layout="horizontal">
            <TimeField format="12hr" value={null} onChange={() => {}} />
          </SingleTimePicker>
        </div>
        <div style={{ ...row, maxWidth: 500 }}>
          <RangedTimePicker label="Availability" layout="horizontal">
            <TimeField format="12hr" value={null} onChange={() => {}} placeholder="From" />
            <TimeField format="12hr" value={null} onChange={() => {}} placeholder="To" />
          </RangedTimePicker>
        </div>
      </div>
    </div>
  );
}
