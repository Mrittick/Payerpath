import { SelectionChip } from './SelectionChip/SelectionChip';
import type { SelectionChipState } from './SelectionChip/SelectionChip';
import './SelectionChipDemo.module.css';

/* ==========================================================================
   Selection Chip — Demo
   Renders every meaningful variant combination for visual QA.
   ========================================================================== */

const states: SelectionChipState[] = ['default', 'hover', 'pressed'];

/* --- Layout helpers --- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h3 className="mds-demo__section-title">{title}</h3>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        {children}
      </div>
    </section>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      {children}
      <span className="mds-demo__label">{label}</span>
    </div>
  );
}

/* --- Demo component --- */

export function SelectionChipDemo() {
  return (
    <div style={{ padding: 32 }}>
      <h2 className="mds-demo__heading">Selection Chip</h2>

      {/* ---- 1. Wrap=True — States ---- */}
      <Section title="1. Wrap=True — States">
        {states.map((s) => (
          <Cell key={s} label={s}>
            <SelectionChip wrap state={s} label="Remittance Type" />
          </Cell>
        ))}
      </Section>

      {/* ---- 2. Wrap=False — States ---- */}
      <Section title="2. Wrap=False — States (200px constraint)">
        {states.map((s) => (
          <Cell key={s} label={s}>
            <div style={{ width: 200 }}>
              <SelectionChip
                wrap={false}
                state={s}
                label="Long label text that should be truncated with an ellipsis"
              />
            </div>
          </Cell>
        ))}
      </Section>

      {/* ---- 3. Wrap=True — Short vs Long labels ---- */}
      <Section title="3. Wrap=True — Various label lengths">
        <Cell label="short">
          <SelectionChip wrap label="ACH" />
        </Cell>
        <Cell label="medium">
          <SelectionChip wrap label="Wire Transfer" />
        </Cell>
        <Cell label="long">
          <SelectionChip wrap label="International Remittance Payment" />
        </Cell>
      </Section>

      {/* ---- 4. Wrap=False — Constrained widths ---- */}
      <Section title="4. Wrap=False — Different container widths">
        <Cell label="120px">
          <div style={{ width: 120 }}>
            <SelectionChip wrap={false} label="Wire Transfer Processing" />
          </div>
        </Cell>
        <Cell label="180px">
          <div style={{ width: 180 }}>
            <SelectionChip wrap={false} label="Wire Transfer Processing" />
          </div>
        </Cell>
        <Cell label="300px (fits)">
          <div style={{ width: 300 }}>
            <SelectionChip wrap={false} label="Wire Transfer Processing" />
          </div>
        </Cell>
      </Section>

      {/* ---- 5. Usage context — Multi-select chip row ---- */}
      <Section title="5. Usage Context — Multi-select chip row (constrained 400px)">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 400 }}>
          <SelectionChip wrap label="ACH" />
          <SelectionChip wrap label="Wire Transfer" />
          <SelectionChip wrap label="Check" />
          <SelectionChip wrap label="International" />
        </div>
      </Section>

      {/* ---- 6. Usage context — Truncated chips in row ---- */}
      <Section title="6. Usage Context — Truncated chips (200px container each)">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ width: 200 }}>
            <SelectionChip wrap={false} label="Automated Clearing House Payment" />
          </div>
          <div style={{ width: 200 }}>
            <SelectionChip wrap={false} label="International Wire Transfer" />
          </div>
          <div style={{ width: 200 }}>
            <SelectionChip wrap={false} label="Electronic Funds Transfer" />
          </div>
        </div>
      </Section>

      {/* ---- 7. Tooltip multi-line wrapping — very long label ---- */}
      <Section title="7. Tooltip Multi-line Wrap (very long label, 160px container)">
        <Cell label="hover to see multi-line tooltip">
          <div style={{ width: 160 }}>
            <SelectionChip
              wrap={false}
              label="Automated Clearing House International Remittance Payment Processing Service Agreement"
            />
          </div>
        </Cell>
        <Cell label="hover — pressed state">
          <div style={{ width: 160 }}>
            <SelectionChip
              wrap={false}
              state="pressed"
              label="Automated Clearing House International Remittance Payment Processing Service Agreement"
            />
          </div>
        </Cell>
      </Section>
    </div>
  );
}
