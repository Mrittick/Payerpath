import { useState } from 'react';
import { SwitchToggle } from './SwitchToggle/SwitchToggle';
import { SwitchToggleCard } from './SwitchToggleCard/SwitchToggleCard';

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
   SwitchDemo — interactive testing for Switch Toggle + Card
   ================================================================ */

export function SwitchDemo() {
  /* ---- Standalone ---- */
  const [baseStandalone, setBaseStandalone] = useState(false);
  const [miniStandalone, setMiniStandalone] = useState(true);

  /* ---- With Labels ---- */
  const [baseLeft, setBaseLeft] = useState(false);
  const [baseRight, setBaseRight] = useState(true);
  const [miniLeft, setMiniLeft] = useState(true);
  const [miniRight, setMiniRight] = useState(false);

  /* ---- Text Wrapping ---- */
  const [wrapBase1, setWrapBase1] = useState(false);
  const [wrapBase2, setWrapBase2] = useState(true);
  const [wrapBase3, setWrapBase3] = useState(false);
  const [wrapMini1, setWrapMini1] = useState(true);
  const [wrapMini2, setWrapMini2] = useState(false);
  const [wrapMini3, setWrapMini3] = useState(true);

  /* ---- Cards ---- */
  const [cardSpan1, setCardSpan1] = useState(false);
  const [cardSpan2, setCardSpan2] = useState(true);
  const [cardStack1, setCardStack1] = useState(true);
  const [cardStack2, setCardStack2] = useState(false);

  /* ---- Card Text Wrapping ---- */
  const [cardWrap1, setCardWrap1] = useState(false);
  const [cardWrap2, setCardWrap2] = useState(true);
  const [cardWrap3, setCardWrap3] = useState(false);

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
        Switch Toggle Components
      </h1>
      <p
        style={{
          fontSize: 14,
          color: 'var(--colour-text-default-low-emphasis)',
          marginBottom: 32,
        }}
      >
        All switches are interactive — click to toggle.
      </p>

      {/* ================================================================
          STANDALONE (Group=False)
          ================================================================ */}
      <div style={sectionStyle}>
        <div style={heading}>Standalone</div>
        <div style={row}>
          <div style={col}>
            <span style={subheading}>Base</span>
            <SwitchToggle
              on={baseStandalone}
              onChange={setBaseStandalone}
            />
          </div>
          <div style={col}>
            <span style={subheading}>Mini</span>
            <SwitchToggle
              size="mini"
              on={miniStandalone}
              onChange={setMiniStandalone}
            />
          </div>
          <div style={col}>
            <span style={subheading}>Disabled</span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <SwitchToggle state="disabled" />
              <SwitchToggle on state="disabled" />
            </div>
          </div>
          <div style={col}>
            <span style={subheading}>Focus</span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <SwitchToggle focus on={baseStandalone} onChange={setBaseStandalone} />
              <SwitchToggle size="mini" focus on={miniStandalone} onChange={setMiniStandalone} />
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
            <SwitchToggle
              label="Notifications"
              on={baseLeft}
              onChange={setBaseLeft}
            />
          </div>
          <div style={col}>
            <span style={subheading}>Base — Right</span>
            <SwitchToggle
              label="Dark Mode"
              orientation="right"
              on={baseRight}
              onChange={setBaseRight}
            />
          </div>
          <div style={col}>
            <span style={subheading}>Mini — Left</span>
            <SwitchToggle
              label="Auto-save"
              size="mini"
              on={miniLeft}
              onChange={setMiniLeft}
            />
          </div>
          <div style={col}>
            <span style={subheading}>Mini — Right</span>
            <SwitchToggle
              label="Compact view"
              size="mini"
              orientation="right"
              on={miniRight}
              onChange={setMiniRight}
            />
          </div>
          <div style={col}>
            <span style={subheading}>Disabled</span>
            <SwitchToggle label="Disabled OFF" state="disabled" />
            <SwitchToggle label="Disabled ON" on state="disabled" />
            <SwitchToggle label="Mini OFF" size="mini" state="disabled" />
            <SwitchToggle label="Mini ON" size="mini" on state="disabled" />
          </div>
        </div>
      </div>

      {/* ================================================================
          TEXT WRAPPING — short + long text per user request
          ================================================================ */}
      <div style={sectionStyle}>
        <div style={heading}>Text Wrapping</div>
        <div style={row}>
          <div style={{ ...col, width: 300, border: '1px dashed var(--colour-brand-purple-900)', padding: 12, borderRadius: 8 }}>
            <span style={subheading}>Base — Left (300px)</span>
            <SwitchToggle
              label="Short label"
              on={wrapBase1}
              onChange={setWrapBase1}
            />
            <SwitchToggle
              label="A moderately long switch label that should fill the space and wrap when it overflows the container width"
              on={wrapBase2}
              onChange={setWrapBase2}
            />
            <SwitchToggle
              label="An extremely long label text that will definitely overflow and wrap to multiple lines — the switch track should stay aligned to the first line of text"
              on={wrapBase3}
              onChange={setWrapBase3}
            />
          </div>
          <div style={{ ...col, width: 300, border: '1px dashed var(--colour-brand-purple-900)', padding: 12, borderRadius: 8 }}>
            <span style={subheading}>Mini — Right (300px)</span>
            <SwitchToggle
              label="Short label"
              size="mini"
              orientation="right"
              on={wrapMini1}
              onChange={setWrapMini1}
            />
            <SwitchToggle
              label="A moderately long switch label that should fill the space and wrap when it overflows"
              size="mini"
              orientation="right"
              on={wrapMini2}
              onChange={setWrapMini2}
            />
            <SwitchToggle
              label="An extremely long label text that wraps to multiple lines — the switch track stays top-aligned to the first line"
              size="mini"
              orientation="right"
              on={wrapMini3}
              onChange={setWrapMini3}
            />
          </div>
          <div style={{ ...col, width: 300, border: '1px dashed var(--colour-brand-purple-900)', padding: 12, borderRadius: 8 }}>
            <span style={subheading}>Disabled (300px)</span>
            <SwitchToggle label="Disabled OFF with a long label that wraps to test alignment" state="disabled" />
            <SwitchToggle label="Disabled ON with a long label that wraps to test alignment" on state="disabled" />
          </div>
        </div>
      </div>

      {/* ================================================================
          SWITCH TOGGLE CARD — Span + Stack orientations
          ================================================================ */}
      <div style={sectionStyle}>
        <div style={heading}>Switch Toggle Card</div>
        <div style={row}>
          <div style={{ ...col, width: 320 }}>
            <span style={subheading}>Span (text first)</span>
            <SwitchToggleCard
              label="Enable notifications"
              on={cardSpan1}
              onChange={setCardSpan1}
            />
            <SwitchToggleCard
              label="Auto-save drafts"
              on={cardSpan2}
              onChange={setCardSpan2}
            />
          </div>
          <div style={{ ...col, width: 320 }}>
            <span style={subheading}>Stack (switch first)</span>
            <SwitchToggleCard
              label="Dark mode"
              orientation="stack"
              on={cardStack1}
              onChange={setCardStack1}
            />
            <SwitchToggleCard
              label="Compact layout"
              orientation="stack"
              on={cardStack2}
              onChange={setCardStack2}
            />
          </div>
          <div style={{ ...col, width: 320 }}>
            <span style={subheading}>Disabled</span>
            <SwitchToggleCard label="Disabled OFF" state="disabled" />
            <SwitchToggleCard label="Disabled ON" on state="disabled" />
            <SwitchToggleCard label="Disabled Stack" orientation="stack" state="disabled" />
            <SwitchToggleCard label="Disabled Stack ON" orientation="stack" on state="disabled" />
          </div>
        </div>
      </div>

      {/* ================================================================
          CARD TEXT WRAPPING — short + long text per user request
          ================================================================ */}
      <div style={sectionStyle}>
        <div style={heading}>Card — Text Wrapping</div>
        <div style={row}>
          <div style={{ ...col, width: 320, border: '1px dashed var(--colour-brand-purple-900)', padding: 12, borderRadius: 8 }}>
            <span style={subheading}>Span (320px)</span>
            <SwitchToggleCard
              label="Short"
              on={cardWrap1}
              onChange={setCardWrap1}
            />
            <SwitchToggleCard
              label="A moderately long card label that should fill and wrap within the card container boundary"
              on={cardWrap2}
              onChange={setCardWrap2}
            />
            <SwitchToggleCard
              label="An extremely long label text that will definitely overflow and wrap to multiple lines within the card — the switch track stays top-aligned to the first line of text"
              on={cardWrap3}
              onChange={setCardWrap3}
            />
          </div>
          <div style={{ ...col, width: 320, border: '1px dashed var(--colour-brand-purple-900)', padding: 12, borderRadius: 8 }}>
            <span style={subheading}>Stack (320px)</span>
            <SwitchToggleCard
              label="Short"
              orientation="stack"
              on={cardWrap1}
              onChange={setCardWrap1}
            />
            <SwitchToggleCard
              label="A moderately long card label that wraps within the card to verify alignment with the switch"
              orientation="stack"
              on={cardWrap2}
              onChange={setCardWrap2}
            />
          </div>
          <div style={{ ...col, width: 320, border: '1px dashed var(--colour-brand-purple-900)', padding: 12, borderRadius: 8 }}>
            <span style={subheading}>Disabled (320px)</span>
            <SwitchToggleCard label="Disabled OFF with a longer label to check wrapping alignment" state="disabled" />
            <SwitchToggleCard label="Disabled ON with a longer label to check wrapping alignment" on state="disabled" />
          </div>
        </div>
      </div>
    </div>
  );
}
