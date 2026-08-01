import { type ReactNode, type ButtonHTMLAttributes, useState, useRef, useCallback, useEffect } from 'react';
import './Copier.module.css';

export type CopierLevel = 'primary' | 'secondary' | 'tertiary';
export type CopierBehaviour = 'contextual' | 'minimal';

/**
 * Internal animation phase:
 *   idle        → default / hover
 *   confirming  → expanding + text slides up from below (300ms entrance)
 *   holding     → confirmation visible, waiting 1200ms (contextual) / 600ms (minimal)
 *   resetting   → text slides upward out + shrinking (300ms exit)
 */
type Phase = 'idle' | 'confirming' | 'holding' | 'resetting';

/** Duration constants matching Figma spec */
const ENTRANCE_MS = 300;
const HOLD_CONTEXTUAL_MS = 1200;
const HOLD_MINIMAL_MS = 600;
const EXIT_MS = 300;

export interface CopierProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Default icon content (inline SVG for copy icon) */
  children: ReactNode;
  /** Confirmation icon content (inline SVG for checkmark) — shown during confirmation */
  confirmIcon?: ReactNode;
  /** Visual level */
  level?: CopierLevel;
  /** Behaviour: contextual expands with label on confirm, minimal swaps icon only */
  behaviour?: CopierBehaviour;
  /** Confirmation label text (default: "Copied!") */
  confirmLabel?: string;
  /** Callback fired on copy activation (mousedown) */
  onCopy?: () => void;
}

export function Copier({
  children,
  confirmIcon,
  level = 'primary',
  behaviour = 'contextual',
  confirmLabel = 'Copied!',
  onCopy,
  disabled,
  className,
  ...rest
}: CopierProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Cleanup timers on unmount */
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  /**
   * mousedown handler — triggers immediately on click (no waiting for release).
   * Animation lifecycle:
   *   1. idle → confirming (entrance animation plays via CSS, 300ms)
   *   2. after 300ms entrance → holding (confirmation fully visible)
   *   3. after hold duration (contextual 1200ms / minimal 600ms) → resetting
   *   4. after 300ms exit   → idle (back to default)
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || phase !== 'idle') return;

      /* Fire user callback */
      onCopy?.();
      rest.onMouseDown?.(e);

      /* 1 → confirming: CSS entrance begins */
      setPhase('confirming');

      /* After entrance animation completes → hold */
      holdTimerRef.current = setTimeout(() => {
        setPhase('holding');

        /* After hold duration → begin reset */
        const holdDuration = behaviour === 'contextual' ? HOLD_CONTEXTUAL_MS : HOLD_MINIMAL_MS;
        holdTimerRef.current = setTimeout(() => {
          setPhase('resetting');

          /* After exit animation → idle */
          resetTimerRef.current = setTimeout(() => {
            setPhase('idle');
          }, EXIT_MS);
        }, holdDuration);
      }, ENTRANCE_MS);
    },
    [disabled, phase, onCopy, rest, behaviour],
  );

  const isConfirmed = phase === 'confirming' || phase === 'holding';
  const isResetting = phase === 'resetting';
  const isContextual = behaviour === 'contextual';
  /* Icon swap only for minimal behaviour — contextual uses "Copied!" text as feedback */
  const showConfirmIcon = !isContextual && (isConfirmed || isResetting);

  const classes = [
    'mds-copier',
    `mds-copier--${level}`,
    isConfirmed ? 'mds-copier--confirmation' : '',
    isConfirmed && isContextual ? 'mds-copier--contextual' : '',
    isResetting ? 'mds-copier--resetting' : '',
    isResetting && isContextual ? 'mds-copier--contextual' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-label={isConfirmed ? confirmLabel : 'Copy'}
      onMouseDown={handleMouseDown}
      {...rest}
    >
      {/* Label clip wrapper — always rendered for contextual so transitions work */}
      {isContextual && (
        <span className="mds-copier__label-clip">
          <span className="mds-copier__label">{confirmLabel}</span>
        </span>
      )}

      {/* Minimal behaviour: icon stack for smooth crossfade between copy → tick.
          Contextual behaviour: always shows the copy icon (text label is the feedback). */}
      {!isContextual && confirmIcon ? (
        <span className="mds-copier__icon-stack">
          <span className={`mds-copier__icon-layer ${showConfirmIcon ? 'mds-copier__icon-layer--hidden' : ''}`}>
            {children}
          </span>
          <span className={`mds-copier__icon-layer mds-copier__icon-layer--confirm ${showConfirmIcon ? '' : 'mds-copier__icon-layer--hidden'}`}>
            {confirmIcon}
          </span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
