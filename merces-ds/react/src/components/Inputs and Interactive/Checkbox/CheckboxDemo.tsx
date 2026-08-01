import { useState } from 'react';
import { Checkbox } from './Checkbox/Checkbox';
import type { CheckboxType } from './Checkbox/Checkbox';
import { CheckboxCard } from './CheckboxCard/CheckboxCard';
import { CheckboxDataviz } from './CheckboxDataviz/CheckboxDataviz';
import type { DatavizSeries } from './CheckboxDataviz/CheckboxDataviz';
import { CheckboxTable } from './CheckboxTable/CheckboxTable';
import type { CheckboxTableType } from './CheckboxTable/CheckboxTable';

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
   CheckboxDemo — interactive testing only, no static state catalogues
   ================================================================ */

export function CheckboxDemo() {
  /* ---- Checkbox (standalone) ---- */
  const [base1, setBase1] = useState<CheckboxType>('unchecked');
  const [base2, setBase2] = useState<CheckboxType>('checked');
  const [base3, setBase3] = useState<CheckboxType>('mixed');
  const [mini1, setMini1] = useState<CheckboxType>('unchecked');
  const [mini2, setMini2] = useState<CheckboxType>('checked');
  const [mini3, setMini3] = useState<CheckboxType>('mixed');

  /* ---- Checkbox (with label) ---- */
  const [leftU, setLeftU] = useState<CheckboxType>('unchecked');
  const [leftC, setLeftC] = useState<CheckboxType>('checked');
  const [leftM, setLeftM] = useState<CheckboxType>('mixed');
  const [rightU, setRightU] = useState<CheckboxType>('unchecked');
  const [rightC, setRightC] = useState<CheckboxType>('checked');
  const [rightM, setRightM] = useState<CheckboxType>('mixed');
  const [miniLU, setMiniLU] = useState<CheckboxType>('unchecked');
  const [miniLC, setMiniLC] = useState<CheckboxType>('checked');
  const [miniLM, setMiniLM] = useState<CheckboxType>('mixed');
  const [miniRU, setMiniRU] = useState<CheckboxType>('unchecked');
  const [miniRC, setMiniRC] = useState<CheckboxType>('checked');
  const [miniRM, setMiniRM] = useState<CheckboxType>('mixed');

  /* ---- Checkbox (text wrapping) ---- */
  const [wrapB1, setWrapB1] = useState<CheckboxType>('unchecked');
  const [wrapB2, setWrapB2] = useState<CheckboxType>('checked');
  const [wrapB3, setWrapB3] = useState<CheckboxType>('mixed');
  const [wrapM1, setWrapM1] = useState<CheckboxType>('unchecked');
  const [wrapM2, setWrapM2] = useState<CheckboxType>('checked');
  const [wrapM3, setWrapM3] = useState<CheckboxType>('mixed');

  /* ---- Checkbox Card ---- */
  const [card1, setCard1] = useState(false);
  const [card2, setCard2] = useState(true);
  const [card3, setCard3] = useState(false);
  const [card4, setCard4] = useState(true);

  /* ---- Checkbox Dataviz ---- */
  const [dvChecks, setDvChecks] = useState<Record<DatavizSeries, boolean>>({
    '01': true, '02': false, '03': true, '04': false,
    '05': true, '06': false, '07': true, '08': false,
  });
  const toggleDv = (s: DatavizSeries) =>
    setDvChecks(prev => ({ ...prev, [s]: !prev[s] }));

  /* ---- Checkbox Table ---- */
  const [tblBase1, setTblBase1] = useState<CheckboxTableType>('unchecked');
  const [tblBase2, setTblBase2] = useState<CheckboxTableType>('checked');
  const [tblBase3, setTblBase3] = useState<CheckboxTableType>('mixed');
  const [tblMini1, setTblMini1] = useState<CheckboxTableType>('unchecked');
  const [tblMini2, setTblMini2] = useState<CheckboxTableType>('checked');
  const [tblMini3, setTblMini3] = useState<CheckboxTableType>('mixed');

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
        Checkbox Component
      </h1>
      <p
        style={{
          fontSize: 14,
          color: 'var(--colour-text-default-low-emphasis)',
          marginBottom: 32,
        }}
      >
        All checkboxes are interactive — click to toggle.
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
              <Checkbox type={base1} onChange={setBase1} />
              <Checkbox type={base2} onChange={setBase2} />
              <Checkbox type={base3} onChange={setBase3} />
            </div>
          </div>
          <div style={col}>
            <span style={subheading}>Mini</span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Checkbox type={mini1} size="mini" onChange={setMini1} />
              <Checkbox type={mini2} size="mini" onChange={setMini2} />
              <Checkbox type={mini3} size="mini" onChange={setMini3} />
            </div>
          </div>
          <div style={col}>
            <span style={subheading}>Disabled</span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Checkbox type="unchecked" state="disabled" />
              <Checkbox type="checked" state="disabled" />
              <Checkbox type="mixed" state="disabled" />
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
            <Checkbox type={leftU} label="Unchecked" onChange={setLeftU} />
            <Checkbox type={leftC} label="Checked" onChange={setLeftC} />
            <Checkbox type={leftM} label="Mixed" onChange={setLeftM} />
          </div>
          <div style={col}>
            <span style={subheading}>Base — Right</span>
            <Checkbox type={rightU} label="Unchecked" orientation="right" onChange={setRightU} />
            <Checkbox type={rightC} label="Checked" orientation="right" onChange={setRightC} />
            <Checkbox type={rightM} label="Mixed" orientation="right" onChange={setRightM} />
          </div>
          <div style={col}>
            <span style={subheading}>Mini — Left</span>
            <Checkbox type={miniLU} size="mini" label="Unchecked" onChange={setMiniLU} />
            <Checkbox type={miniLC} size="mini" label="Checked" onChange={setMiniLC} />
            <Checkbox type={miniLM} size="mini" label="Mixed" onChange={setMiniLM} />
          </div>
          <div style={col}>
            <span style={subheading}>Mini — Right</span>
            <Checkbox type={miniRU} size="mini" label="Unchecked" orientation="right" onChange={setMiniRU} />
            <Checkbox type={miniRC} size="mini" label="Checked" orientation="right" onChange={setMiniRC} />
            <Checkbox type={miniRM} size="mini" label="Mixed" orientation="right" onChange={setMiniRM} />
          </div>
          <div style={col}>
            <span style={subheading}>Disabled</span>
            <Checkbox type="unchecked" label="Unchecked" state="disabled" />
            <Checkbox type="checked" label="Checked" state="disabled" />
            <Checkbox type="mixed" label="Mixed" state="disabled" />
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
            <Checkbox type={wrapB1} label="Short label" onChange={setWrapB1} />
            <Checkbox type={wrapB2} label="A moderately long checkbox label that should fill the space and wrap when it overflows the container width" onChange={setWrapB2} />
            <Checkbox type={wrapB3} label="An extremely long checkbox label that will definitely overflow and wrap to multiple lines — the checkbox should stay aligned to the first line of text" onChange={setWrapB3} />
          </div>
          <div style={{ ...col, width: 300, border: '1px dashed var(--colour-brand-purple-900)', padding: 12, borderRadius: 8 }}>
            <span style={subheading}>Mini — Right (300px)</span>
            <Checkbox type={wrapM1} size="mini" label="Short label" orientation="right" onChange={setWrapM1} />
            <Checkbox type={wrapM2} size="mini" label="A moderately long checkbox label that should fill the space and wrap when it overflows" orientation="right" onChange={setWrapM2} />
            <Checkbox type={wrapM3} size="mini" label="An extremely long checkbox label that wraps to multiple lines — the checkbox stays top-aligned to the first line" orientation="right" onChange={setWrapM3} />
          </div>
          <div style={{ ...col, width: 300, border: '1px dashed var(--colour-brand-purple-900)', padding: 12, borderRadius: 8 }}>
            <span style={subheading}>Disabled (300px)</span>
            <Checkbox type="unchecked" label="Unchecked disabled with a long label that wraps to test alignment" state="disabled" />
            <Checkbox type="checked" label="Checked disabled with a long label that wraps to test alignment" state="disabled" />
            <Checkbox type="mixed" label="Mixed disabled with a long label that wraps to test alignment" state="disabled" />
          </div>
        </div>
      </div>

      {/* ================================================================
          CHECKBOX CARD
          ================================================================ */}
      <div style={sectionStyle}>
        <div style={heading}>Checkbox Card</div>
        <div style={row}>
          <CheckboxCard label="Base" selected={card1} onChange={setCard1} />
          <CheckboxCard label="Base" selected={card2} onChange={setCard2} />
          <CheckboxCard label="Mini" size="mini" selected={card3} onChange={setCard3} />
          <CheckboxCard label="Mini" size="mini" selected={card4} onChange={setCard4} />
          <CheckboxCard label="Disabled" state="disabled" />
          <CheckboxCard label="Disabled" state="disabled" selected />
        </div>
      </div>

      {/* ================================================================
          CHECKBOX DATAVIZ
          ================================================================ */}
      <div style={sectionStyle}>
        <div style={heading}>Checkbox Dataviz</div>
        <div style={subheading}>All 8 series — click to toggle</div>
        <div style={row}>
          {(['01', '02', '03', '04', '05', '06', '07', '08'] as DatavizSeries[]).map(s => (
            <CheckboxDataviz
              key={s}
              series={s}
              checked={dvChecks[s]}
              label={`Series ${s}`}
              onChange={() => toggleDv(s)}
            />
          ))}
        </div>
      </div>

      {/* ================================================================
          CHECKBOX TABLE
          ================================================================ */}
      <div style={sectionStyle}>
        <div style={heading}>Checkbox Table</div>
        <div style={{ ...row, background: 'var(--colour-brand-purple-500)', padding: 16, borderRadius: 12 }}>
          <div style={col}>
            <span style={{ ...subheading, color: 'var(--colour-neutral-white)' }}>Base</span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <CheckboxTable type={tblBase1} onChange={setTblBase1} />
              <CheckboxTable type={tblBase2} onChange={setTblBase2} />
              <CheckboxTable type={tblBase3} onChange={setTblBase3} />
            </div>
          </div>
          <div style={col}>
            <span style={{ ...subheading, color: 'var(--colour-neutral-white)' }}>Mini</span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <CheckboxTable type={tblMini1} size="mini" onChange={setTblMini1} />
              <CheckboxTable type={tblMini2} size="mini" onChange={setTblMini2} />
              <CheckboxTable type={tblMini3} size="mini" onChange={setTblMini3} />
            </div>
          </div>
          <div style={col}>
            <span style={{ ...subheading, color: 'var(--colour-neutral-white)' }}>Disabled</span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <CheckboxTable type="unchecked" state="disabled" />
              <CheckboxTable type="checked" state="disabled" />
              <CheckboxTable type="mixed" state="disabled" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
