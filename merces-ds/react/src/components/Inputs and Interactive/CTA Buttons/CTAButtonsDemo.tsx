import {
  ChevronRightBold20,
  ChevronRightBold16,
} from '../../Assets/Icon/icons.tsx';
import { CTAButton } from './CTAButton/CTAButton';
import type { CTAColorTheme, CTAType, CTASize, CTAVariant } from './CTAButton/CTAButton';

/* ==========================================================================
   CTA Buttons — Demo
   Renders every theme × type × size × variant combination.

   NOTE: CTAButton internally wraps the icon prop in a .mds-icon span,
   so icons are passed as raw SVGs (no <Icon> wrapper) to avoid
   double-wrapping.

   Figma icon spec: Chevron-Right / Base (20px) or Mini (16px) / Bold
   ========================================================================== */

/* --- Icons from the SVG library (raw SVGs, no <Icon> wrapper) --- */
const IconBase = ChevronRightBold20;
const IconMini = ChevronRightBold16;

/* --- Helpers --- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 20, fontWeight: 700, margin: '0 0 16px' }}>{title}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start' }}>
        {children}
      </div>
    </section>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      {children}
      <span style={{ fontFamily: 'var(--font-family)', fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

function ThemeSection({ theme }: { theme: CTAColorTheme }) {
  const types: CTAType[] = ['primary', 'secondary', 'tertiary', 'quaternary'];
  const sizes: CTASize[] = ['base', 'mini'];
  const variants: CTAVariant[] = ['textOnly', 'iconOnly', 'iconLeft', 'iconRight'];

  const themeLabel = theme.charAt(0).toUpperCase() + theme.slice(1);

  return (
    <div style={{ marginBottom: 64 }}>
      <h2 style={{
        
        fontSize: 24,
        fontWeight: 900,
        margin: '0 0 24px',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        CTA — {themeLabel}
      </h2>

      {types.map((ctaType) => (
        <div key={ctaType} style={{ marginBottom: 40 }}>
          <h3 style={{
            
            fontSize: 16,
            fontWeight: 700,
            margin: '0 0 16px',
            textTransform: 'capitalize',
          }}>
            {ctaType}
          </h3>

          {sizes.map((size) => (
            <Section key={size} title={`${ctaType} / ${size}`}>
              {/* Default states — all variants */}
              {variants.map((variant) => (
                <Cell key={`${variant}-default`} label={`${variant}`}>
                  <CTAButton
                    colorTheme={theme}
                    ctaType={ctaType}
                    size={size}
                    variant={variant}
                    label="Button"
                    icon={size === 'mini' ? IconMini : IconBase}
                  />
                </Cell>
              ))}

              {/* Disabled */}
              <Cell label="disabled">
                <CTAButton
                  colorTheme={theme}
                  ctaType={ctaType}
                  size={size}
                  variant="textOnly"
                  label="Button"
                  disabled
                />
              </Cell>

              {/* Toggle */}
              <Cell label="toggle">
                <CTAButton
                  colorTheme={theme}
                  ctaType={ctaType}
                  size={size}
                  variant="textOnly"
                  label="Button"
                  toggle
                />
              </Cell>

              {/* Focus */}
              <Cell label="focus">
                <CTAButton
                  colorTheme={theme}
                  ctaType={ctaType}
                  size={size}
                  variant="textOnly"
                  label="Button"
                  focus
                />
              </Cell>

              {/* Disabled + focus */}
              <Cell label="disabled+focus">
                <CTAButton
                  colorTheme={theme}
                  ctaType={ctaType}
                  size={size}
                  variant="textOnly"
                  label="Button"
                  disabled
                  focus
                />
              </Cell>
            </Section>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ==========================================================================
   Main demo page
   ========================================================================== */
export function CTAButtonsDemo() {
  const themes: CTAColorTheme[] = ['brand', 'danger', 'caution', 'emphasis', 'neutral'];

  return (
    <div style={{
      padding: 40,
      background: 'white',
      minHeight: '100vh',
      
    }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 40px' }}>
        CTA Buttons — All Themes
      </h1>
      <p style={{ fontSize: 14, color: '#666', margin: '0 0 40px' }}>
        Hover and press buttons to test state transitions (150ms).
        Tab through buttons to test keyboard focus ring.
      </p>

      {themes.map((theme) => (
        <ThemeSection key={theme} theme={theme} />
      ))}
    </div>
  );
}
