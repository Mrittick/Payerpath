import { MenuItem } from './MenuItem/MenuItem';
import type { MenuItemState } from './MenuItem/MenuItem';
import { GenericRegular20, GenericRegular16 } from '../../../Assets/Icon/icons';

const states: MenuItemState[] = [
  'default',
  'hover',
  'pressed',
  'current-default',
  'current-strong',
  'disabled',
];

export function MenuItemDemo() {
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 48 }}>
      <h2>Menu Item Component</h2>

      {/* ------------------------------------------------------------------ */}
      <section>
        <h3>h00 — Category Header (Mini / Text only)</h3>
        <MenuItem menuType="h00" label="Category" />
      </section>

      {/* ------------------------------------------------------------------ */}
      <section>
        <h3>h01 — Base Size / Text Only — All States</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 220 }}>
          {states.map((s) => (
            <MenuItem key={s} size="base" state={s} label={`${s}`} showText showIcon={false} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section>
        <h3>h01 — Base Size / Text + Icon — All States</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 220 }}>
          {states.map((s) => (
            <MenuItem key={s} size="base" state={s} label={`${s}`} showText showIcon icon={GenericRegular20} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section>
        <h3>h01 — Base Size / Icon Only — All States</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          {states.map((s) => (
            <MenuItem key={s} size="base" state={s} showText={false} showIcon icon={GenericRegular20} aria-label={s} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section>
        <h3>h01 — Mini Size / Text Only — All States</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 200 }}>
          {states.map((s) => (
            <MenuItem key={s} size="mini" state={s} label={`${s}`} showText showIcon={false} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section>
        <h3>h01 — Mini Size / Text + Icon — All States</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 200 }}>
          {states.map((s) => (
            <MenuItem key={s} size="mini" state={s} label={`${s}`} showText showIcon icon={GenericRegular16} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section>
        <h3>h01 — Mini Size / Icon Only — All States</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          {states.map((s) => (
            <MenuItem key={s} size="mini" state={s} showText={false} showIcon icon={GenericRegular16} aria-label={s} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section>
        <h3>Focus Ring Examples</h3>
        <div style={{ display: 'flex', gap: 16 }}>
          <MenuItem size="base" state="default" label="Default + Focus" showText focus />
          <MenuItem size="base" state="hover" label="Hover + Focus" showText focus />
          <MenuItem size="base" state="current-default" label="Current + Focus" showText showIcon icon={GenericRegular20} focus />
          <MenuItem size="base" state="current-strong" label="Strong + Focus" showText showIcon icon={GenericRegular20} focus />
        </div>
      </section>
    </div>
  );
}
