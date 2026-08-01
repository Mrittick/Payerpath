import { Icon } from '../../Assets/Icon/Icon.tsx';
import {
  CrossFilled16,
  TickCircleFilled16,
  TickCircleRegular16,
  FilterRegular20,
  ChevronDownBold16,
  ChevronUpBold16,
  ChevronLeftBold16,
  ChevronRightBold16,
  InformationCircleRegular16,
  SearchRegular20,
  SearchBold16,
  CopyRegular16,
} from '../../Assets/Icon/icons.tsx';
import { ActiveIndicator } from './ActiveIndicator/ActiveIndicator.tsx';
import { Clear } from './Clear/Clear.tsx';
import { Done } from './Done/Done.tsx';
import { Filter } from './Filter/Filter.tsx';
import { ChevronBadge } from './ChevronBadge/ChevronBadge.tsx';
import { MoreInfo } from './MoreInfo/MoreInfo.tsx';
import { Search } from './Search/Search.tsx';
import { Copier } from './Copier/Copier.tsx';

/* ==========================================================================
   Sub-Controls — Demo
   Renders every component in every meaningful prop combination.
   ========================================================================== */

/* --- Icons from the SVG library (single source of truth) --- */

const CrossIcon = <Icon size="mini">{CrossFilled16}</Icon>;
const TickIcon = <Icon size="mini">{TickCircleFilled16}</Icon>;
const FilterIcon = <Icon size="base">{FilterRegular20}</Icon>;
const ChevronDown = <Icon size="mini">{ChevronDownBold16}</Icon>;
const ChevronUp = <Icon size="mini">{ChevronUpBold16}</Icon>;
const ChevronLeft = <Icon size="mini">{ChevronLeftBold16}</Icon>;
const ChevronRight = <Icon size="mini">{ChevronRightBold16}</Icon>;
const InfoIcon = <Icon size="mini">{InformationCircleRegular16}</Icon>;
const SearchIcon20 = <Icon size="base">{SearchRegular20}</Icon>;
const SearchIcon16 = <Icon size="mini">{SearchBold16}</Icon>;
const CopyIcon = <Icon size="mini">{CopyRegular16}</Icon>;
const TickCircleRegularIcon = <Icon size="mini">{TickCircleRegular16}</Icon>;

/* --- Layout helpers --- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h3 style={{ fontFamily: 'monospace', fontSize: 14, marginBottom: 12, borderBottom: '1px solid #ccc', paddingBottom: 4 }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        {children}
      </div>
    </section>
  );
}

function Label({ text }: { text: string }) {
  return <span style={{ display: 'block', fontFamily: 'monospace', fontSize: 10, marginTop: 4, textAlign: 'center', color: '#666' }}>{text}</span>;
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {children}
      <Label text={label} />
    </div>
  );
}

/* --- Demo Page --- */

export function SubControlsDemo() {
  return (
    <div style={{ padding: 24, background: '#ffffff', color: '#1a1a1a', minHeight: '100vh' }}>
      <h2 style={{ fontFamily: 'monospace', marginBottom: 24 }}>Sub-Controls — Demo</h2>

      {/* ==================================================================
          1. ActiveIndicator
          ================================================================== */}
      <Section title="1. ActiveIndicator — 3 states">
        <Cell label="default">
          <ActiveIndicator />
        </Cell>
        <Cell label="hover">
          <ActiveIndicator state="hover" />
        </Cell>
        <Cell label="invoked">
          <div style={{ background: '#fff', padding: 8, borderRadius: 4 }}>
            <ActiveIndicator state="invoked" />
          </div>
        </Cell>
      </Section>

      {/* ==================================================================
          2. Clear
          ================================================================== */}
      <Section title="2a. Clear — Primary (Base + Mini)">
        <Cell label="default"><Clear level="primary">{CrossIcon}</Clear></Cell>
        <Cell label="hover (hover me)"><Clear level="primary">{CrossIcon}</Clear></Cell>
        <Cell label="disabled"><Clear level="primary" disabled>{CrossIcon}</Clear></Cell>
        <Cell label="hidden"><Clear level="primary" hidden>{CrossIcon}</Clear></Cell>
        <Cell label="mini"><Clear level="primary" size="mini">{CrossIcon}</Clear></Cell>
      </Section>

      <Section title="2b. Clear — Secondary">
        <Cell label="default"><Clear level="secondary">{CrossIcon}</Clear></Cell>
        <Cell label="disabled"><Clear level="secondary" disabled>{CrossIcon}</Clear></Cell>
      </Section>

      <Section title="2c. Clear — Tertiary">
        <Cell label="default"><Clear level="tertiary">{CrossIcon}</Clear></Cell>
        <Cell label="disabled"><Clear level="tertiary" disabled>{CrossIcon}</Clear></Cell>
      </Section>

      {/* ==================================================================
          3. Done
          ================================================================== */}
      <Section title="3a. Done — Primary (Base + Mini + Label)">
        <Cell label="default"><Done level="primary">{TickIcon}</Done></Cell>
        <Cell label="hover (hover me)"><Done level="primary">{TickIcon}</Done></Cell>
        <Cell label="disabled"><Done level="primary" disabled>{TickIcon}</Done></Cell>
        <Cell label="hidden"><Done level="primary" hidden>{TickIcon}</Done></Cell>
        <Cell label="mini"><Done level="primary" size="mini">{TickIcon}</Done></Cell>
        <Cell label="with label"><Done level="primary" label>{TickIcon}</Done></Cell>
        <Cell label="custom label"><Done level="primary" label labelText="Confirm">{TickIcon}</Done></Cell>
      </Section>

      <Section title="3b. Done — Secondary">
        <Cell label="default"><Done level="secondary">{TickIcon}</Done></Cell>
        <Cell label="with label"><Done level="secondary" label>{TickIcon}</Done></Cell>
        <Cell label="disabled"><Done level="secondary" disabled>{TickIcon}</Done></Cell>
      </Section>

      <Section title="3c. Done — Tertiary">
        <Cell label="default"><Done level="tertiary">{TickIcon}</Done></Cell>
        <Cell label="with label"><Done level="tertiary" label>{TickIcon}</Done></Cell>
        <Cell label="disabled"><Done level="tertiary" disabled>{TickIcon}</Done></Cell>
      </Section>

      {/* ==================================================================
          4. Filter
          ================================================================== */}
      <Section title="4. Filter — Modes, Focus, isActive (hover + press to test Pressed state)">
        <Cell label="default"><Filter mode="default">{FilterIcon}</Filter></Cell>
        <Cell label="default (hover + press)"><Filter mode="default">{FilterIcon}</Filter></Cell>
        <Cell label="default + focus"><Filter mode="default" focus>{FilterIcon}</Filter></Cell>
        <Cell label="default + isActive"><Filter mode="default" isActive>{FilterIcon}</Filter></Cell>
        <Cell label="default + isActive + focus"><Filter mode="default" isActive focus>{FilterIcon}</Filter></Cell>
        <Cell label="invoked"><Filter mode="invoked">{FilterIcon}</Filter></Cell>
        <Cell label="invoked (hover + press)"><Filter mode="invoked">{FilterIcon}</Filter></Cell>
        <Cell label="invoked + isActive"><Filter mode="invoked" isActive indicatorState="invoked">{FilterIcon}</Filter></Cell>
        <Cell label="disabled"><Filter mode="disabled">{FilterIcon}</Filter></Cell>
        <Cell label="hidden"><Filter mode="hidden">{FilterIcon}</Filter></Cell>
      </Section>

      {/* ==================================================================
          5. ChevronBadge
          ================================================================== */}
      <Section title="5a. ChevronBadge — Directions (Large)">
        <Cell label="down"><ChevronBadge direction="down" size="large">{ChevronDown}</ChevronBadge></Cell>
        <Cell label="up"><ChevronBadge direction="up" size="large">{ChevronUp}</ChevronBadge></Cell>
        <Cell label="left"><ChevronBadge direction="left" size="large">{ChevronLeft}</ChevronBadge></Cell>
        <Cell label="right"><ChevronBadge direction="right" size="large">{ChevronRight}</ChevronBadge></Cell>
      </Section>

      <Section title="5b. ChevronBadge — Sizes">
        <Cell label="base (20px)"><ChevronBadge size="base">{ChevronDown}</ChevronBadge></Cell>
        <Cell label="large (24px)"><ChevronBadge size="large">{ChevronDown}</ChevronBadge></Cell>
        <Cell label="huge (32px)"><ChevronBadge size="huge">{ChevronDown}</ChevronBadge></Cell>
      </Section>

      <Section title="5c. ChevronBadge — States">
        <Cell label="default (hover me)"><ChevronBadge size="large">{ChevronDown}</ChevronBadge></Cell>
        <Cell label="active"><ChevronBadge size="large" active>{ChevronDown}</ChevronBadge></Cell>
        <Cell label="disabled"><ChevronBadge size="large" disabled>{ChevronDown}</ChevronBadge></Cell>
        <Cell label="hidden"><ChevronBadge size="large" hidden>{ChevronDown}</ChevronBadge></Cell>
      </Section>

      {/* ==================================================================
          6. MoreInfo
          ================================================================== */}
      <Section title="6. MoreInfo — States (hover and press to test)">
        <Cell label="default"><MoreInfo icon={InfoIcon} /></Cell>
        <Cell label="custom text"><MoreInfo icon={InfoIcon} text="Learn More" /></Cell>
      </Section>

      {/* ==================================================================
          7. Search
          ================================================================== */}
      <section style={{ marginBottom: 40 }}>
        <h3 style={{ fontFamily: 'monospace', fontSize: 14, marginBottom: 12, borderBottom: '1px solid #ccc', paddingBottom: 4 }}>7a. Search — Base size (type to see Clear, click Clear to reset)</h3>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Search size="base" searchIcon={SearchIcon20} placeholder="Search..." />
            <Label text="empty (type to test)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Search size="base" searchIcon={SearchIcon20} defaultValue="Query text" placeholder="Search..." />
            <Label text="pre-filled" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Search size="base" mode="disabled" searchIcon={SearchIcon20} placeholder="Search..." />
            <Label text="disabled" />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h3 style={{ fontFamily: 'monospace', fontSize: 14, marginBottom: 12, borderBottom: '1px solid #ccc', paddingBottom: 4 }}>7b. Search — Compact size</h3>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Search size="compact" searchIcon={SearchIcon16} placeholder="Search..." />
            <Label text="empty (type to test)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Search size="compact" searchIcon={SearchIcon16} defaultValue="Query text" placeholder="Search..." />
            <Label text="pre-filled" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Search size="compact" mode="disabled" searchIcon={SearchIcon16} placeholder="Search..." />
            <Label text="disabled" />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h3 style={{ fontFamily: 'monospace', fontSize: 14, marginBottom: 12, borderBottom: '1px solid #ccc', paddingBottom: 4 }}>7c. Search — Focus ring (Tab into input, not mouse click)</h3>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Search size="base" searchIcon={SearchIcon20} placeholder="Tab to focus..." />
            <Label text="base (Tab to focus)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Search size="compact" searchIcon={SearchIcon16} placeholder="Tab to focus..." />
            <Label text="compact (Tab to focus)" />
          </div>
        </div>
      </section>

      {/* ==================================================================
          8. Copier — Click (mousedown) to trigger animated confirmation
          ================================================================== */}
      <Section title="8a. Copier — Primary (click to see animation)">
        <Cell label="contextual (click me)">
          <Copier level="primary" behaviour="contextual" confirmIcon={TickCircleRegularIcon}>{CopyIcon}</Copier>
        </Cell>
        <Cell label="minimal (click me)">
          <Copier level="primary" behaviour="minimal" confirmIcon={TickCircleRegularIcon}>{CopyIcon}</Copier>
        </Cell>
      </Section>

      <Section title="8b. Copier — Secondary (click to see animation)">
        <Cell label="contextual (click me)">
          <Copier level="secondary" behaviour="contextual" confirmIcon={TickCircleRegularIcon}>{CopyIcon}</Copier>
        </Cell>
        <Cell label="minimal (click me)">
          <Copier level="secondary" behaviour="minimal" confirmIcon={TickCircleRegularIcon}>{CopyIcon}</Copier>
        </Cell>
      </Section>

      <Section title="8c. Copier — Tertiary (click to see animation)">
        <Cell label="contextual (click me)">
          <Copier level="tertiary" behaviour="contextual" confirmIcon={TickCircleRegularIcon}>{CopyIcon}</Copier>
        </Cell>
        <Cell label="minimal (click me)">
          <Copier level="tertiary" behaviour="minimal" confirmIcon={TickCircleRegularIcon}>{CopyIcon}</Copier>
        </Cell>
      </Section>
    </div>
  );
}
