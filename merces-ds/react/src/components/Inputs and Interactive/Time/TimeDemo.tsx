import { useState } from 'react';
import TimeCell from './TimeCell/TimeCell';
import TimeDropdown from './TimeDropdown/TimeDropdown';

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
  gap: 16,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  marginBottom: 16,
};

const cellWrapper: React.CSSProperties = {
  width: 140,
};

const label: React.CSSProperties = {
  fontSize: 11,
  fontFamily: 'Satoshi Variable, sans-serif',
  color: '#88819c',
  marginBottom: 4,
};

export default function TimeDemo() {
  const [selected24, setSelected24] = useState<string | null>(null);
  const [selected12, setSelected12] = useState<string | null>(null);

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ ...heading, fontSize: 24, marginBottom: 32 }}>
        Time Components
      </h1>

      {/* ---- TimeCell: 24hr states ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>TimeCell — 24hr Format</h2>

        <h3 style={subheading}>isCurrent = False</h3>
        <div style={row}>
          {(['default', 'hover', 'pressed', 'disabled'] as const).map((s) => (
            <div key={s} style={cellWrapper}>
              <div style={label}>{s}</div>
              <TimeCell time="14:30" format="24hr" state={s} />
            </div>
          ))}
        </div>

        <h3 style={subheading}>isCurrent = True</h3>
        <div style={row}>
          {(['default', 'hover', 'pressed', 'disabled'] as const).map((s) => (
            <div key={s} style={cellWrapper}>
              <div style={label}>{s}</div>
              <TimeCell time="12:00" format="24hr" isCurrent state={s} />
            </div>
          ))}
        </div>
      </div>

      {/* ---- TimeCell: 12hr states ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>TimeCell — 12hr Format</h2>

        <h3 style={subheading}>Meridian = am, isCurrent = False</h3>
        <div style={row}>
          {(['default', 'hover', 'pressed', 'disabled'] as const).map((s) => (
            <div key={s} style={cellWrapper}>
              <div style={label}>{s}</div>
              <TimeCell
                time="9:30"
                format="12hr"
                meridian="am"
                state={s}
              />
            </div>
          ))}
        </div>

        <h3 style={subheading}>Meridian = pm, isCurrent = True</h3>
        <div style={row}>
          {(['default', 'hover', 'pressed', 'disabled'] as const).map((s) => (
            <div key={s} style={cellWrapper}>
              <div style={label}>{s}</div>
              <TimeCell
                time="2:00"
                format="12hr"
                meridian="pm"
                isCurrent
                state={s}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ---- TimeDropdown: Interactive ---- */}
      <div style={sectionStyle}>
        <h2 style={heading}>Time Selection Dropdown — 24hr</h2>
        <div style={row}>
          <TimeDropdown
            format="24hr"
            currentTime={selected24}
            onSelect={setSelected24}
          />
          <div style={{ ...subheading, alignSelf: 'center' }}>
            Selected: {selected24 ?? 'none'}
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={heading}>Time Selection Dropdown — 12hr</h2>
        <div style={row}>
          <TimeDropdown
            format="12hr"
            currentTime={selected12}
            onSelect={setSelected12}
          />
          <div style={{ ...subheading, alignSelf: 'center' }}>
            Selected: {selected12 ?? 'none'}
          </div>
        </div>
      </div>
    </div>
  );
}
