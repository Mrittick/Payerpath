import { useState, useMemo } from 'react';
import { ModalField } from './ModalField/ModalField';
import { ModalFieldGroup } from './ModalFieldGroup/ModalFieldGroup';
import { MinMaxModalGroup } from './MinMaxModalGroup/MinMaxModalGroup';
import { ModalFieldSelect } from './ModalFieldSelect/ModalFieldSelect';
import type { OverlayItem } from './ModalFieldOverlay/ModalFieldOverlay';
import {
  ACTIVE_CARC_CODES,
  formatCARCLabel,
} from '../../../Data/Mock Data/claimAdjustmentReasonCodes';
import {
  ACTIVE_ICD10_CODES,
  formatICD10Label,
} from '../../../Data/Mock Data/icd10DiagnosisCodes';
import {
  ACTIVE_CPT_CODES,
  formatCPTLabel,
} from '../../../Data/Mock Data/cptProcedureCodes';
import {
  US_STATES,
  formatStateLabel,
} from '../../../Data/Mock Data/usStates';

/* ---- Layout helpers ---- */

const sectionStyle: React.CSSProperties = {
  marginBottom: 48,
};

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
  gap: 24,
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  marginBottom: 24,
};

const col: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const fieldWrap: React.CSSProperties = {
  width: 320,
};

const groupContainer: React.CSSProperties = {
  width: 400,
};

/* ================================================================
   ModalFieldDemo
   ================================================================ */

export function ModalFieldDemo() {
  /* ---- Overlay items derived from each dataset ---- */
  const carcItems: OverlayItem[] = useMemo(
    () => ACTIVE_CARC_CODES.map((c) => ({ code: c.code, label: formatCARCLabel(c) })),
    [],
  );

  const icd10Items: OverlayItem[] = useMemo(
    () => ACTIVE_ICD10_CODES.map((c) => ({ code: c.code, label: formatICD10Label(c) })),
    [],
  );

  const cptItems: OverlayItem[] = useMemo(
    () => ACTIVE_CPT_CODES.map((c) => ({ code: c.code, label: formatCPTLabel(c) })),
    [],
  );

  const stateItems: OverlayItem[] = useMemo(
    () => US_STATES.map((s) => ({ code: s.code, label: formatStateLabel(s) })),
    [],
  );

  /* ---- Selection state for each context ---- */
  const [selectedCARCs, setSelectedCARCs] = useState<Set<string>>(new Set());
  const [selectedICD10, setSelectedICD10] = useState<Set<string>>(new Set());
  const [selectedCPTs, setSelectedCPTs] = useState<Set<string>>(new Set());
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set());

  /* ---- Simple counter states for static demos ---- */
  const [countMin, setCountMin] = useState(0);
  const [countMax, setCountMax] = useState(2);

  return (
    <div style={{ padding: 40, maxWidth: 1200 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, color: 'var(--colour-text-default-base)' }}>
        Modal Field Component
      </h1>
      <p style={{ fontSize: 14, color: 'var(--colour-text-default-low-emphasis)', marginBottom: 32 }}>
        Clickable trigger fields for modal selection — used when items are too numerous for a dropdown.
      </p>

      {/* ================================================================
          INTERACTIVE DEMOS — Multiple contexts via ModalFieldSelect
          ================================================================ */}
      <div style={sectionStyle}>
        <div style={heading}>Interactive — Multiple Contexts</div>
        <div style={subheading}>
          Each field opens the same overlay pattern, wired to a different dataset.
          Click any field to open its selection overlay.
        </div>
        <div style={row}>
          {/* CARC — large dataset (~250+ active codes) */}
          <div style={col}>
            <span style={subheading}>CARC ({carcItems.length} codes)</span>
            <div style={fieldWrap}>
              <ModalFieldSelect
                placeholder="Adjustment Reason Codes"
                title="Select Adjustment Reason Codes"
                items={carcItems}
                value={selectedCARCs}
                onChange={setSelectedCARCs}
              />
            </div>
          </div>

          {/* ICD-10 — medium dataset (~56 codes) */}
          <div style={col}>
            <span style={subheading}>ICD-10 ({icd10Items.length} codes)</span>
            <div style={fieldWrap}>
              <ModalFieldSelect
                placeholder="Diagnosis Codes"
                title="Select Diagnosis Codes"
                items={icd10Items}
                value={selectedICD10}
                onChange={setSelectedICD10}
              />
            </div>
          </div>
        </div>
        <div style={row}>
          {/* CPT — medium dataset (~80 codes) */}
          <div style={col}>
            <span style={subheading}>CPT ({cptItems.length} codes)</span>
            <div style={fieldWrap}>
              <ModalFieldSelect
                placeholder="Procedure Codes"
                title="Select Procedure Codes"
                items={cptItems}
                value={selectedCPTs}
                onChange={setSelectedCPTs}
              />
            </div>
          </div>

          {/* US States — small dataset (56 entries) */}
          <div style={col}>
            <span style={subheading}>US States ({stateItems.length} entries)</span>
            <div style={fieldWrap}>
              <ModalFieldSelect
                placeholder="States & Territories"
                title="Select States & Territories"
                items={stateItems}
                value={selectedStates}
                onChange={setSelectedStates}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          STATIC VARIANT DEMOS
          ================================================================ */}

      {/* ---- Core: Unselected states ---- */}
      <div style={sectionStyle}>
        <div style={heading}>Modal Field — Unselected</div>
        <div style={subheading}>State: Default / Hover / Disabled / Focus</div>
        <div style={row}>
          <div style={col}>
            <span style={subheading}>Default</span>
            <div style={fieldWrap}><ModalField placeholder="Select" /></div>
          </div>
          <div style={col}>
            <span style={subheading}>Hover</span>
            <div style={fieldWrap}><ModalField placeholder="Select" state="hover" /></div>
          </div>
          <div style={col}>
            <span style={subheading}>Disabled</span>
            <div style={fieldWrap}><ModalField placeholder="Select" state="disabled" /></div>
          </div>
          <div style={col}>
            <span style={subheading}>Focus</span>
            <div style={fieldWrap}><ModalField placeholder="Select" focus /></div>
          </div>
        </div>
      </div>

      {/* ---- Core: Selected states ---- */}
      <div style={sectionStyle}>
        <div style={heading}>Modal Field — Selected</div>
        <div style={subheading}>State: Default / Hover / Disabled / Focus</div>
        <div style={row}>
          <div style={col}>
            <span style={subheading}>Default</span>
            <div style={fieldWrap}><ModalField selectedCount={3} onClear={() => {}} /></div>
          </div>
          <div style={col}>
            <span style={subheading}>Hover</span>
            <div style={fieldWrap}><ModalField selectedCount={3} state="hover" onClear={() => {}} /></div>
          </div>
          <div style={col}>
            <span style={subheading}>Disabled</span>
            <div style={fieldWrap}><ModalField selectedCount={3} state="disabled" /></div>
          </div>
          <div style={col}>
            <span style={subheading}>Focus</span>
            <div style={fieldWrap}><ModalField selectedCount={3} focus onClear={() => {}} /></div>
          </div>
        </div>
      </div>

      {/* ---- ModalFieldGroup: Vertical ---- */}
      <div style={sectionStyle}>
        <div style={heading}>Modal Field Group — Vertical</div>
        <div style={row}>
          <div style={{ ...col, ...groupContainer }}>
            <ModalFieldGroup label="Adjustment Reason Codes" layout="vertical">
              <ModalField placeholder="Select" />
            </ModalFieldGroup>
          </div>
          <div style={{ ...col, ...groupContainer }}>
            <ModalFieldGroup label="Currency" layout="vertical">
              <ModalField selectedCount={5} onClear={() => {}} />
            </ModalFieldGroup>
          </div>
        </div>
      </div>

      {/* ---- ModalFieldGroup: Horizontal Default ---- */}
      <div style={sectionStyle}>
        <div style={heading}>Modal Field Group — Horizontal Default</div>
        <div style={subheading}>Label: HUG width, Field: FILL width</div>
        <div style={{ ...col, ...groupContainer }}>
          <ModalFieldGroup label="Reason Codes" layout="horizontal" padding="default">
            <ModalField placeholder="Select" />
          </ModalFieldGroup>
        </div>
      </div>

      {/* ---- ModalFieldGroup: Horizontal Span ---- */}
      <div style={sectionStyle}>
        <div style={heading}>Modal Field Group — Horizontal Span</div>
        <div style={subheading}>Label: FILL (50%), Field: FILL (50%)</div>
        <div style={{ ...col, ...groupContainer }}>
          <ModalFieldGroup label="Reason Codes" layout="horizontal" padding="span">
            <ModalField placeholder="Select" />
          </ModalFieldGroup>
        </div>
      </div>

      {/* ---- MinMaxModalGroup: Vertical ---- */}
      <div style={sectionStyle}>
        <div style={heading}>Min-Max Modal Group — Vertical</div>
        <div style={{ ...col, ...groupContainer }}>
          <MinMaxModalGroup label="Amount Range" layout="vertical">
            <ModalField
              placeholder="Min"
              selectedCount={countMin}
              onClick={() => setCountMin((c) => c + 1)}
              onClear={() => setCountMin(0)}
            />
            <ModalField
              placeholder="Max"
              selectedCount={countMax}
              onClick={() => setCountMax((c) => c + 1)}
              onClear={() => setCountMax(0)}
            />
          </MinMaxModalGroup>
        </div>
      </div>

      {/* ---- MinMaxModalGroup: Horizontal ---- */}
      <div style={sectionStyle}>
        <div style={heading}>Min-Max Modal Group — Horizontal</div>
        <div style={subheading}>Label + Inputs: 50/50 split</div>
        <div style={{ width: 600 }}>
          <MinMaxModalGroup label="Amount Range" layout="horizontal">
            <ModalField placeholder="Min" />
            <ModalField placeholder="Max" selectedCount={2} onClear={() => {}} />
          </MinMaxModalGroup>
        </div>
      </div>
    </div>
  );
}
