import {
  ChevronRightBold20,
  ChevronRightBold16,
} from '../../Assets/Icon/icons.tsx';
import { SpanButton } from './SpanButton/SpanButton';
import type { SpanColorTheme, SpanType, SpanSize, SpanVariant } from './SpanButton/SpanButton';

/* ==========================================================================
   Span Buttons — Demo
   Renders every theme x type x size x variant combination.
   Buttons are placed inside fixed-width containers to demonstrate
   the spanning (full-width) behaviour.

   NOTE: SpanButton internally wraps the icon prop in a .mds-icon span,
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
        {children}
      </div>
    </section>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: 'var(--font-family)', fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>{label}</span>
      {children}
    </div>
  );
}

function ThemeSection({ theme }: { theme: SpanColorTheme }) {
  const types: SpanType[] = ['primary', 'secondary', 'tertiary', 'quaternary'];
  const sizes: SpanSize[] = ['base', 'mini'];
  const variants: SpanVariant[] = ['textOnly', 'iconOnly', 'iconLeft', 'iconRight'];

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
        Span — {themeLabel}
      </h2>

      {types.map((spanType) => (
        <div key={spanType} style={{ marginBottom: 40 }}>
          <h3 style={{
            
            fontSize: 16,
            fontWeight: 700,
            margin: '0 0 16px',
            textTransform: 'capitalize',
          }}>
            {spanType}
          </h3>

          {sizes.map((size) => (
            <Section key={size} title={`${spanType} / ${size}`}>
              {/* Default states — all variants */}
              {variants.map((variant) => (
                <Cell key={`${variant}-default`} label={`${variant}`}>
                  <SpanButton
                    colorTheme={theme}
                    spanType={spanType}
                    size={size}
                    variant={variant}
                    label="Button"
                    icon={size === 'mini' ? IconMini : IconBase}
                  />
                </Cell>
              ))}

              {/* Disabled */}
              <Cell label="disabled">
                <SpanButton
                  colorTheme={theme}
                  spanType={spanType}
                  size={size}
                  variant="textOnly"
                  label="Button"
                  disabled
                />
              </Cell>

              {/* Toggle */}
              <Cell label="toggle">
                <SpanButton
                  colorTheme={theme}
                  spanType={spanType}
                  size={size}
                  variant="textOnly"
                  label="Button"
                  toggle
                />
              </Cell>

              {/* Focus */}
              <Cell label="focus">
                <SpanButton
                  colorTheme={theme}
                  spanType={spanType}
                  size={size}
                  variant="textOnly"
                  label="Button"
                  focus
                />
              </Cell>

              {/* Disabled + focus */}
              <Cell label="disabled+focus">
                <SpanButton
                  colorTheme={theme}
                  spanType={spanType}
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
export function SpanButtonsDemo() {
  const themes: SpanColorTheme[] = ['brand', 'danger', 'caution', 'neutral'];

  return (
    <div style={{
      padding: 40,
      background: 'white',
      minHeight: '100vh',
      
    }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 40px' }}>
        Span Buttons — All Themes
      </h1>
      <p style={{ fontSize: 14, color: '#666', margin: '0 0 8px' }}>
        Span buttons stretch to fill their container width (max 360px below).
      </p>
      <p style={{ fontSize: 14, color: '#666', margin: '0 0 40px' }}>
        Icon-left: text aligns right. Icon-right / text-only: text aligns left.
        Hover and press to test state transitions. Tab for focus ring.
      </p>

      {themes.map((theme) => (
        <ThemeSection key={theme} theme={theme} />
      ))}
    </div>
  );
}
