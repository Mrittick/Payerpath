import './Message.module.css';

export type MessageType = 'warning' | 'error';

export interface MessageProps {
  /** Validation message text */
  children: string;
  /** Visual type — determines text colour */
  type?: MessageType;
  /** Additional class name */
  className?: string;
}

export function Message({
  children,
  type = 'error',
  className,
}: MessageProps) {
  const classes = [
    'mds-message',
    `mds-message--${type}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <p className={classes} role="alert">
      {children}
    </p>
  );
}
