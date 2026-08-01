import './DropdownSection.module.css';

export interface DropdownSectionProps {
  /** Section header text */
  text: string;
  /** Selection mode — affects padding */
  mode?: 'single' | 'multi';
  /** Orientation — affects padding */
  orientation?: 'left' | 'right';
  /** Extra className */
  className?: string;
}

export function DropdownSection({
  text,
  mode = 'single',
  orientation = 'left',
  className,
}: DropdownSectionProps) {
  const classes = [
    'mds-dropdown-section',
    `mds-dropdown-section--${mode}-${orientation}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="presentation">
      <span className="mds-dropdown-section__text-frame">
        <span className="mds-dropdown-section__text">{text}</span>
      </span>
    </div>
  );
}
