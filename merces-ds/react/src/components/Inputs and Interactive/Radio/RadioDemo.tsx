import { useState } from 'react';
import { RadioPicker } from './RadioPicker/RadioPicker';

/* ---- Layout helpers ---- */

const sectionStyle: React.CSSProperties = { marginBottom: 48 };

const heading: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 12,
  color: 'var(--colour-text-default-base)',
};

const subheading: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  marginBottom: 12,
  color: 'var(--colour-text-default-low-emphasis)',
};

const row: React.CSSProperties = {
  display: 'flex',
  gap: 32,
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  marginBottom: 24,
};

const col: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

/* ================================================================
   RadioDemo — interactive testing, no static state catalogues
   ================================================================ */

export function RadioDemo() {
  /* ---- Standalone ---- */
  const [baseIdx, setBaseIdx] = useState(1);
  const [miniIdx, setMiniIdx] = useState(0);

  /* ---- With Labels ---- */
  const [baseLeftIdx, setBaseLeftIdx] = useState(0);
  const [baseRightIdx, setBaseRightIdx] = useState(1);
  const [miniLeftIdx, setMiniLeftIdx] = useState(2);
  const [miniRightIdx, setMiniRightIdx] = useState(0);

  /* ---- Text Wrapping ---- */
  const [wrapBaseIdx, setWrapBaseIdx] = useState(1);
  const [wrapMiniIdx, setWrapMiniIdx] = useState(0);

  const options = ['Option A', 'Option B', 'Option C'];

  return (
    <div style={{ padding: 40, maxWidth: 1200 }}>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 900,
          marginBottom: 8,
          color: 'var(--colour-text-default-base)',
        }}
      >
        Radio Picker Component
      </h1>
      <p
        style={{
          fontSize: 14,
          color: 'var(--colour-text-default-low-emphasis)',
          marginBottom: 32,
        }}
      >
        All radios are interactive — click to select.
      </p>

      {/* ================================================================
          STANDALONE (Group=False)
          ================================================================ */}
      <div style={sectionStyle}>
        <div style={heading}>Standalone</div>
        <div style={row}>
          <div style={col}>
            <span style={subheading}>Base</span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {options.map((_, i) => (
                <RadioPicker
                  key={i}
                  selected={baseIdx === i}
                  onSelect={() => setBaseIdx(i)}
                />
              ))}
            </div>
          </div>
          <div style={col}>
            <span style={subheading}>Mini</span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {options.map((_, i) => (
                <RadioPicker
                  key={i}
                  size="mini"
                  selected={miniIdx === i}
                  onSelect={() => setMiniIdx(i)}
                />
              ))}
            </div>
          </div>
          <div style={col}>
            <span style={subheading}>Disabled</span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <RadioPicker state="disabled" />
              <RadioPicker selected state="disabled" />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          WITH LABELS (Group=True)
          ================================================================ */}
      <div style={sectionStyle}>
        <div style={heading}>With Labels</div>
        <div style={row}>
          <div style={col}>
            <span style={subheading}>Base — Left</span>
            {options.map((opt, i) => (
              <RadioPicker
                key={i}
                label={opt}
                selected={baseLeftIdx === i}
                onSelect={() => setBaseLeftIdx(i)}
              />
            ))}
          </div>
          <div style={col}>
            <span style={subheading}>Base — Right</span>
            {options.map((opt, i) => (
              <RadioPicker
                key={i}
                label={opt}
                orientation="right"
                selected={baseRightIdx === i}
                onSelect={() => setBaseRightIdx(i)}
              />
            ))}
          </div>
          <div style={col}>
            <span style={subheading}>Mini — Left</span>
            {options.map((opt, i) => (
              <RadioPicker
                key={i}
                label={opt}
                size="mini"
                selected={miniLeftIdx === i}
                onSelect={() => setMiniLeftIdx(i)}
              />
            ))}
          </div>
          <div style={col}>
            <span style={subheading}>Mini — Right</span>
            {options.map((opt, i) => (
              <RadioPicker
                key={i}
                label={opt}
                size="mini"
                orientation="right"
                selected={miniRightIdx === i}
                onSelect={() => setMiniRightIdx(i)}
              />
            ))}
          </div>
          <div style={col}>
            <span style={subheading}>Disabled</span>
            <RadioPicker label="Unselected" state="disabled" />
            <RadioPicker label="Selected" selected state="disabled" />
          </div>
        </div>
      </div>

      {/* ================================================================
          TEXT WRAPPING
          ================================================================ */}
      <div style={sectionStyle}>
        <div style={heading}>Text Wrapping</div>
        <div style={row}>
          <div style={{ ...col, width: 300, border: '1px dashed var(--colour-brand-purple-900)', padding: 12, borderRadius: 8 }}>
            <span style={subheading}>Base — Left (300px)</span>
            {['Short label', 'A moderately long radio label that should fill the space and wrap when it overflows the container width', 'An extremely long radio label that will definitely overflow and wrap to multiple lines — the radio should stay aligned to the first line of text'].map((text, i) => (
              <RadioPicker
                key={i}
                label={text}
                selected={wrapBaseIdx === i}
                onSelect={() => setWrapBaseIdx(i)}
              />
            ))}
          </div>
          <div style={{ ...col, width: 300, border: '1px dashed var(--colour-brand-purple-900)', padding: 12, borderRadius: 8 }}>
            <span style={subheading}>Mini — Right (300px)</span>
            {['Short label', 'A moderately long radio label that should fill the space and wrap when it overflows', 'An extremely long radio label that wraps to multiple lines — the radio stays top-aligned to the first line'].map((text, i) => (
              <RadioPicker
                key={i}
                label={text}
                size="mini"
                orientation="right"
                selected={wrapMiniIdx === i}
                onSelect={() => setWrapMiniIdx(i)}
              />
            ))}
          </div>
          <div style={{ ...col, width: 300, border: '1px dashed var(--colour-brand-purple-900)', padding: 12, borderRadius: 8 }}>
            <span style={subheading}>Disabled (300px)</span>
            <RadioPicker label="Unselected disabled with a long label that wraps to test alignment" state="disabled" />
            <RadioPicker label="Selected disabled with a long label that wraps to test alignment" selected state="disabled" />
          </div>
        </div>
      </div>
    </div>
  );
}
