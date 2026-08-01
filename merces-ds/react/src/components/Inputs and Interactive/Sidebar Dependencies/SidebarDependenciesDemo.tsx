import { HideShow } from './HideShow/HideShow';
import { MenuItem } from './Menu Item/MenuItem/MenuItem';
import type { MenuItemState } from './Menu Item/MenuItem/MenuItem';
import {
  SidebarCollapseRegular24,
  SidebarExpandRegular24,
  GenericRegular20,
  GenericRegular16,
} from '../../Assets/Icon/icons';
import './SidebarDependenciesDemo.module.css';

/* ==========================================================================
   Sidebar Dependencies — Demo
   Renders HideShow + MenuItem in every meaningful prop combination.
   Uses the same Section / Cell / Label helper pattern as other demos.
   ========================================================================== */

const h01States: MenuItemState[] = [
  'default',
  'hover',
  'pressed',
  'current-default',
  'current-strong',
  'disabled',
];

/* --- Layout helpers (consistent with SubControlsDemo) --- */

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

function Label({ text }: { text: string }) {
  return <span className="mds-demo__label">{text}</span>;
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {children}
      <Label text={label} />
    </div>
  );
}

/* Column of menu items for state showcase */
function MenuItemColumn({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 220 }}>
      {children}
    </div>
  );
}

/* --- Demo Page --- */

export function SidebarDependenciesDemo() {
  return (
    <div className="mds-demo" style={{ padding: 24, background: '#ffffff', color: '#1a1a1a', minHeight: '100vh' }}>
      <h2 className="mds-demo__heading">Sidebar Dependencies — Demo</h2>

      {/* ==================================================================
          1. Hide / Show
          ================================================================== */}

      <Section title="1a. Hide / Show — Payerpath (hover + click to test states)">
        <Cell label="Expanded">
          <HideShow
            product="payerpath"
            isCollapsed={false}
            expandedIcon={SidebarCollapseRegular24}
            collapsedIcon={SidebarExpandRegular24}
          />
        </Cell>
        <Cell label="Collapsed">
          <HideShow
            product="payerpath"
            isCollapsed={true}
            expandedIcon={SidebarCollapseRegular24}
            collapsedIcon={SidebarExpandRegular24}
          />
        </Cell>
      </Section>

      <Section title="1b. Hide / Show — eChart Coder (hover + click to test states)">
        <div className="mds-demo__echart-bg" style={{ display: 'flex', gap: 16, padding: 16 }}>
          <Cell label="Expanded">
            <HideShow
              product="echart-coder"
              isCollapsed={false}
              expandedIcon={SidebarCollapseRegular24}
              collapsedIcon={SidebarExpandRegular24}
            />
          </Cell>
          <Cell label="Collapsed">
            <HideShow
              product="echart-coder"
              isCollapsed={true}
              expandedIcon={SidebarCollapseRegular24}
              collapsedIcon={SidebarExpandRegular24}
            />
          </Cell>
        </div>
      </Section>

      {/* ==================================================================
          2. Menu Item — h00 Category Header
          ================================================================== */}

      <Section title="2. Menu Item — h00 Category Header">
        <Cell label="h00 header">
          <MenuItem menuType="h00" label="CATEGORY" />
        </Cell>
      </Section>

      {/* ==================================================================
          3. Menu Item — h01 Base Size
          ================================================================== */}

      <Section title="3a. Menu Item — h01 / Base / Text Only (all states · hover + click to test)">
        <MenuItemColumn>
          {h01States.map((s) => (
            <MenuItem key={s} size="base" state={s} label={s} showText showIcon={false} />
          ))}
        </MenuItemColumn>
      </Section>

      <Section title="3b. Menu Item — h01 / Base / Text + Icon (all states)">
        <MenuItemColumn>
          {h01States.map((s) => (
            <MenuItem key={s} size="base" state={s} label={s} showText showIcon icon={GenericRegular20} />
          ))}
        </MenuItemColumn>
      </Section>

      <Section title="3c. Menu Item — h01 / Base / Icon Only (all states)">
        <div style={{ display: 'flex', gap: 8 }}>
          {h01States.map((s) => (
            <Cell key={s} label={s}>
              <MenuItem size="base" state={s} showText={false} showIcon icon={GenericRegular20} aria-label={s} />
            </Cell>
          ))}
        </div>
      </Section>

      {/* ==================================================================
          4. Menu Item — h01 Mini Size
          ================================================================== */}

      <Section title="4a. Menu Item — h01 / Mini / Text Only (all states · hover + click to test)">
        <MenuItemColumn>
          {h01States.map((s) => (
            <MenuItem key={s} size="mini" state={s} label={s} showText showIcon={false} />
          ))}
        </MenuItemColumn>
      </Section>

      <Section title="4b. Menu Item — h01 / Mini / Text + Icon (all states)">
        <MenuItemColumn>
          {h01States.map((s) => (
            <MenuItem key={s} size="mini" state={s} label={s} showText showIcon icon={GenericRegular16} />
          ))}
        </MenuItemColumn>
      </Section>

      <Section title="4c. Menu Item — h01 / Mini / Icon Only (all states)">
        <div style={{ display: 'flex', gap: 8 }}>
          {h01States.map((s) => (
            <Cell key={s} label={s}>
              <MenuItem size="mini" state={s} showText={false} showIcon icon={GenericRegular16} aria-label={s} />
            </Cell>
          ))}
        </div>
      </Section>
    </div>
  );
}
