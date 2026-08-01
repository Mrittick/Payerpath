import {
  GenericRegular20,
  GenericRegular16,
  ChevronRightBold20,
  ChevronLeftBold20,
  ChevronRightBold16,
  ChevronLeftBold16,
} from '../../Assets/Icon/icons.tsx';
import { CompoundButton } from './CompoundButton/CompoundButton.tsx';
import type { CompoundColorTheme, CompoundType, CompoundSize } from './CompoundButton/CompoundButton.tsx';

/* ==========================================================================
   Compound Buttons — Demo
   Renders every meaningful combination:
   4 themes × 4 types × 2 sizes × 2 chevron positions × label/no-label

   NOTE: CompoundButton internally wraps icon/chevron props in .mds-icon
   spans, so icons are passed as raw SVGs (no <Icon> wrapper) to avoid
   double-wrapping.

   Figma icon specs:
     Action icon: Generic / Base (20px) or Mini (16px) / Regular
     Chevron:     Chevron-Right or Chevron-Left / Base or Mini / Bold
   ========================================================================== */

/* --- Icons from the SVG library (raw SVGs, no <Icon> wrapper) --- */

const ActionIcon20 = GenericRegular20;
const ActionIcon16 = GenericRegular16;
const ChevronRight20 = ChevronRightBold20;
const ChevronRight16 = ChevronRightBold16;
const ChevronLeft20 = ChevronLeftBold20;
const ChevronLeft16 = ChevronLeftBold16;

/* --- Layout helpers --- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h3 style={{ fontFamily: 'monospace', fontSize: 14, marginBottom: 12, borderBottom: '1px solid #ccc', paddingBottom: 4 }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#666', width: 120, flexShrink: 0 }}>{label}</span>
      <div style={{ width: 200 }}>{children}</div>
    </div>
  );
}

/* --- Helper: render a theme block --- */

function ThemeBlock({
  theme,
  types,
  sizes,
}: {
  theme: CompoundColorTheme;
  types: CompoundType[];
  sizes: CompoundSize[];
}) {
  return (
    <>
      {types.map((type) =>
        sizes.map((size) => {
          const icon = size === 'base' ? ActionIcon20 : ActionIcon16;
          const chevronR = size === 'base' ? ChevronRight20 : ChevronRight16;
          const chevronL = size === 'base' ? ChevronLeft20 : ChevronLeft16;
          const sectionTitle = `${theme} / ${type} / ${size}`;
          return (
            <Section key={sectionTitle} title={sectionTitle}>
              <Row label="chevron-right + label">
                <CompoundButton
                  colorTheme={theme}
                  compoundType={type}
                  size={size}
                  icon={icon}
                  chevron={chevronR}
                  chevronPosition="right"
                  label="Button"
                />
              </Row>
              <Row label="chevron-left + label">
                <CompoundButton
                  colorTheme={theme}
                  compoundType={type}
                  size={size}
                  icon={icon}
                  chevron={chevronL}
                  chevronPosition="left"
                  label="Button"
                />
              </Row>
              <Row label="chevron-right no-label">
                <CompoundButton
                  colorTheme={theme}
                  compoundType={type}
                  size={size}
                  icon={icon}
                  chevron={chevronR}
                  chevronPosition="right"
                  showLabel={false}
                />
              </Row>
              <Row label="chevron-left no-label">
                <CompoundButton
                  colorTheme={theme}
                  compoundType={type}
                  size={size}
                  icon={icon}
                  chevron={chevronL}
                  chevronPosition="left"
                  showLabel={false}
                />
              </Row>
            </Section>
          );
        }),
      )}
    </>
  );
}

/* --- Demo Page --- */

export function CompoundButtonsDemo() {
  const types: CompoundType[] = ['primary', 'secondary', 'tertiary', 'quaternary'];
  const sizes: CompoundSize[] = ['base', 'mini'];
  const themes: CompoundColorTheme[] = ['brand', 'danger', 'caution', 'neutral'];

  return (
    <div style={{ padding: 24, background: '#ffffff', color: '#1a1a1a', minHeight: '100vh' }}>
      <h2 style={{ fontFamily: 'monospace', marginBottom: 24 }}>Compound Buttons — Demo</h2>

      {/* States section — Brand Primary Base only */}
      <Section title="States — brand / primary / base">
        <Row label="default">
          <CompoundButton icon={ActionIcon20} chevron={ChevronRight20} label="Button" />
        </Row>
        <Row label="hover (hover me)">
          <CompoundButton icon={ActionIcon20} chevron={ChevronRight20} label="Hover Me" />
        </Row>
        <Row label="toggle">
          <CompoundButton icon={ActionIcon20} chevron={ChevronRight20} label="Toggled" toggle />
        </Row>
        <Row label="disabled">
          <CompoundButton icon={ActionIcon20} chevron={ChevronRight20} label="Disabled" disabled />
        </Row>
        <Row label="focus">
          <CompoundButton icon={ActionIcon20} chevron={ChevronRight20} label="Focus" focus />
        </Row>
        <Row label="disabled + focus">
          <CompoundButton icon={ActionIcon20} chevron={ChevronRight20} label="Dis+Focus" disabled focus />
        </Row>
      </Section>

      {/* Full theme matrix */}
      {themes.map((theme) => (
        <div key={theme}>
          <h3 style={{ fontFamily: 'monospace', fontSize: 18, marginTop: 40, marginBottom: 16, color: '#333' }}>
            Theme: {theme.toUpperCase()}
          </h3>
          <ThemeBlock theme={theme} types={types} sizes={sizes} />
        </div>
      ))}
    </div>
  );
}
