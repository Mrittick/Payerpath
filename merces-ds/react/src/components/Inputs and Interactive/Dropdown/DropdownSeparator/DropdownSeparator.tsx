import './DropdownSeparator.module.css';

export interface DropdownSeparatorProps {
  /** Selection mode — affects left/right padding to align with item text */
  mode?: 'single' | 'multi';
  /** Tick/checkbox icon placement — mirrors padding */
  orientation?: 'left' | 'right';
  /** Extra className */
  className?: string;
}

export function DropdownSeparator({
  mode = 'single',
  orientation = 'left',
  className,
}: DropdownSeparatorProps) {
  const classes = [
    'mds-dropdown-separator',
    `mds-dropdown-separator--${mode}-${orientation}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="separator">
      <div className="mds-dropdown-separator__frame">
        <div className="mds-dropdown-separator__line" />
      </div>
    </div>
  );
}
