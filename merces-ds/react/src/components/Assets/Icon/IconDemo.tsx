import { Icon } from './Icon';
import type { IconSize, IconColor } from './Icon';
import { InformationCircleFilled20 } from './icons.tsx';

/* ==========================================================================
   Icon — Demo Usage
   Renders all size variants, all color variants, and accessibility states.

   Size mapping (verified against Figma component set 110:105):
     tiny  → 12px (viewBox 0 0 12 12)
     mini  → 16px (viewBox 0 0 16 16)
     base  → 20px (viewBox 0 0 20 20)  ← default
     large → 24px (viewBox 0 0 24 24)
     huge  → 32px (viewBox 0 0 32 32)
   ========================================================================== */

/** SVG from the icon library — information-circle-20-filled */
const SampleSvg = InformationCircleFilled20;

const ALL_SIZES: IconSize[] = ['tiny', 'mini', 'base', 'large', 'huge'];
const ALL_COLORS: IconColor[] = [
  'default',
  'sub',
  'disabled',
  'error',
  'warning',
  'inverted',
  'brand',
  'accent',
];

const EXPECTED_PX: Record<IconSize, number> = {
  tiny: 12,
  mini: 16,
  base: 20,
  large: 24,
  huge: 32,
};

/** Section wrapper for visual grouping */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h3 style={{ fontFamily: 'monospace', marginBottom: 8 }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
        {children}
      </div>
    </section>
  );
}

/** Label beneath each icon showing metadata */
function Label({ text }: { text: string }) {
  return (
    <span style={{ display: 'block', fontFamily: 'monospace', fontSize: 10, marginTop: 4, textAlign: 'center' }}>
      {text}
    </span>
  );
}

export function IconDemo() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontFamily: 'monospace' }}>Icon Component — Demo</h2>

      {/* ----------------------------------------------------------------
          1. Size variants
          Each should render at its expected pixel dimension.
          ---------------------------------------------------------------- */}
      <Section title="1. Size Variants">
        {ALL_SIZES.map((size) => (
          <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Icon size={size}>{SampleSvg}</Icon>
            <Label text={`${size} (${EXPECTED_PX[size]}px)`} />
          </div>
        ))}
      </Section>

      {/* ----------------------------------------------------------------
          2. Color variants
          Rendered at "large" (24px) for visibility. Each applies a
          different semantic color class.
          "inverted" is shown on a dark swatch so it's visible.
          ---------------------------------------------------------------- */}
      <Section title="2. Color Variants (size=large)">
        {ALL_COLORS.map((color) => (
          <div
            key={color}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 8,
              borderRadius: 4,
              backgroundColor: color === 'inverted' ? '#1a1a1a' : undefined,
            }}
          >
            <Icon size="large" color={color}>
              {SampleSvg}
            </Icon>
            <Label text={color} />
          </div>
        ))}
      </Section>

      {/* ----------------------------------------------------------------
          3. Default (no color prop)
          Should inherit color from parent via `color: inherit`.
          ---------------------------------------------------------------- */}
      <Section title="3. Inherited Color (no color prop)">
        <div style={{ color: '#e63946' }}>
          <Icon size="large">{SampleSvg}</Icon>
          <Label text="parent color: #e63946" />
        </div>
        <div style={{ color: '#2a9d8f' }}>
          <Icon size="large">{SampleSvg}</Icon>
          <Label text="parent color: #2a9d8f" />
        </div>
      </Section>

      {/* ----------------------------------------------------------------
          4. Accessibility
          ---------------------------------------------------------------- */}
      <Section title="4a. Decorative (no label) → aria-hidden=true">
        {/* Expected DOM: <span class="mds-icon ..." aria-hidden="true"> */}
        <Icon size="base">{SampleSvg}</Icon>
        <code style={{ fontSize: 11 }}>aria-hidden="true", no role</code>
      </Section>

      <Section title='4b. Meaningful (label="Info") → role=img + aria-label'>
        {/* Expected DOM: <span class="mds-icon ..." role="img" aria-label="Info"> */}
        <Icon size="base" label="Information">
          {SampleSvg}
        </Icon>
        <code style={{ fontSize: 11 }}>role="img", aria-label="Information"</code>
      </Section>

      {/* ----------------------------------------------------------------
          5. Custom className and style passthrough
          ---------------------------------------------------------------- */}
      <Section title="5. className + style passthrough">
        <Icon size="huge" className="custom-test-class" style={{ opacity: 0.5 }}>
          {SampleSvg}
        </Icon>
        <code style={{ fontSize: 11 }}>className="custom-test-class", opacity: 0.5</code>
      </Section>

      {/* ----------------------------------------------------------------
          6. Size cross-check grid
          Visual ruler: each icon is placed inside a box sized to its
          expected pixel value so the SVG should fill the box exactly.
          ---------------------------------------------------------------- */}
      <Section title="6. Size Cross-Check (icon inside expected-size box)">
        {ALL_SIZES.map((size) => {
          const px = EXPECTED_PX[size];
          return (
            <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: px,
                  height: px,
                  outline: '1px dashed #999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={size}>{SampleSvg}</Icon>
              </div>
              <Label text={`${px}×${px}px box`} />
            </div>
          );
        })}
      </Section>
    </div>
  );
}
