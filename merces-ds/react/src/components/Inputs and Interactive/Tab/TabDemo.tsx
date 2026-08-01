import { Tab } from './Tab/Tab';
import type { TabState } from './Tab/Tab';
import './TabDemo.module.css';

/* ==========================================================================
   Tab — Demo
   Renders every meaningful variant combination for visual QA.
   ========================================================================== */

const states: TabState[] = ['default', 'hover', 'pressed', 'disabled'];

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

export function TabDemo() {
  return (
    <div style={{ padding: 32 }}>
      <h2 className="mds-demo__heading">Tab</h2>

      {/* ---- 1. Level01 (Pill) — Base ---- */}
      <Section title="1. Level01 (Pill) — Base — States">
        {states.map((s) => (
          <Cell key={s} label={s}>
            <Tab hierarchy="level01" size="base" state={s} label="Tab item" />
          </Cell>
        ))}
        <Cell label="current">
          <Tab hierarchy="level01" size="base" isCurrent label="Tab item" />
        </Cell>
      </Section>

      {/* ---- 2. Level01 (Pill) — Mini ---- */}
      <Section title="2. Level01 (Pill) — Mini — States">
        {states.map((s) => (
          <Cell key={s} label={s}>
            <Tab hierarchy="level01" size="mini" state={s} label="Tab item" />
          </Cell>
        ))}
        <Cell label="current">
          <Tab hierarchy="level01" size="mini" isCurrent label="Tab item" />
        </Cell>
      </Section>

      {/* ---- 3. Level02 (Underline) — Base ---- */}
      <Section title="3. Level02 (Underline) — Base — States">
        {states.map((s) => (
          <Cell key={s} label={s}>
            <Tab hierarchy="level02" size="base" state={s} label="Tab item" />
          </Cell>
        ))}
        <Cell label="current">
          <Tab hierarchy="level02" size="base" isCurrent label="Tab item" />
        </Cell>
      </Section>

      {/* ---- 4. Level02 (Underline) — Mini ---- */}
      <Section title="4. Level02 (Underline) — Mini — States">
        {states.map((s) => (
          <Cell key={s} label={s}>
            <Tab hierarchy="level02" size="mini" state={s} label="Tab item" />
          </Cell>
        ))}
        <Cell label="current">
          <Tab hierarchy="level02" size="mini" isCurrent label="Tab item" />
        </Cell>
      </Section>

      {/* ---- 5. Focus Ring ---- */}
      <Section title="5. Focus Ring — Level01">
        <Cell label="default + focus">
          <Tab hierarchy="level01" size="base" focus label="Tab item" />
        </Cell>
        <Cell label="hover + focus">
          <Tab hierarchy="level01" size="base" state="hover" focus label="Tab item" />
        </Cell>
        <Cell label="current + focus">
          <Tab hierarchy="level01" size="base" isCurrent focus label="Tab item" />
        </Cell>
      </Section>

      <Section title="6. Focus Ring — Level02">
        <Cell label="default + focus">
          <Tab hierarchy="level02" size="base" focus label="Tab item" />
        </Cell>
        <Cell label="hover + focus">
          <Tab hierarchy="level02" size="base" state="hover" focus label="Tab item" />
        </Cell>
        <Cell label="current + focus">
          <Tab hierarchy="level02" size="base" isCurrent focus label="Tab item" />
        </Cell>
      </Section>

      {/* ---- 7. Tab Row (usage context) ---- */}
      <Section title="7. Tab Row — Level01 (usage context)">
        <div style={{ display: 'flex', gap: 4 }}>
          <Tab hierarchy="level01" size="base" isCurrent label="Overview" />
          <Tab hierarchy="level01" size="base" label="Details" />
          <Tab hierarchy="level01" size="base" label="History" />
          <Tab hierarchy="level01" size="base" state="disabled" label="Archived" />
        </div>
      </Section>

      <Section title="8. Tab Row — Level02 (usage context)">
        <div style={{ display: 'flex', gap: 0 }}>
          <Tab hierarchy="level02" size="base" isCurrent label="Remittances" />
          <Tab hierarchy="level02" size="base" label="Claims" />
          <Tab hierarchy="level02" size="base" label="Payments" />
          <Tab hierarchy="level02" size="base" state="disabled" label="Reports" />
        </div>
      </Section>
    </div>
  );
}
