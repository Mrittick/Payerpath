import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  signal,
} from '@angular/core';
import { IconComponent } from '../../../assets/icon/icon.component';
import { IconName, IconType, IconSize } from '../../../assets/icon/icon.types';
import {
  CtaButtonIntent,
  CtaButtonType,
  CtaButtonSize,
  CtaButtonVariant,
  CtaButtonChevronPosition,
} from './cta-button.types';

@Component({
  selector: 'merces-cta-button',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cta-button.component.html',
  styleUrl: './cta-button.component.css',
  host: {
    /* ── Intent ── */
    '[class.cta-button--intent-brand]': 'intent() === "brand"',
    '[class.cta-button--intent-neutral]': 'intent() === "neutral"',
    '[class.cta-button--intent-emphasis]': 'intent() === "emphasis"',
    '[class.cta-button--intent-danger]': 'intent() === "danger"',
    '[class.cta-button--intent-caution]': 'intent() === "caution"',
    /* ── Type ── */
    '[class.cta-button--type-primary]': 'type() === "primary"',
    '[class.cta-button--type-secondary]': 'type() === "secondary"',
    '[class.cta-button--type-tertiary]': 'type() === "tertiary"',
    '[class.cta-button--type-quaternary]': 'type() === "quaternary"',
    /* ── Size ── */
    '[class.cta-button--size-base]': 'size() === "base"',
    '[class.cta-button--size-mini]': 'size() === "mini"',
    /* ── Variant ── */
    '[class.cta-button--variant-text-only]': 'variant() === "text-only"',
    '[class.cta-button--variant-icon-only]': 'variant() === "icon-only"',
    '[class.cta-button--variant-icon-left]': 'variant() === "icon-left"',
    '[class.cta-button--variant-icon-right]': 'variant() === "icon-right"',
    '[class.cta-button--variant-compound]': 'variant() === "compound"',
    /* ── Compound sub-variants ── */
    '[class.cta-button--chevron-left]': 'variant() === "compound" && chevronPosition() === "left"',
    '[class.cta-button--chevron-right]': 'variant() === "compound" && chevronPosition() === "right"',
    '[class.cta-button--no-label]': 'variant() === "compound" && !showLabel()',
    /* ── Modifiers ── */
    '[class.cta-button--compact]': 'compact()',
    '[class.cta-button--pressed]': '_visuallyPressed()',
    '[class.cta-button--disabled]': 'disabled()',
    '[class.cta-button--toggled]': 'toggled()',
  },
})
export class CtaButtonComponent {
  /* ── Core ── */
  readonly intent = input<CtaButtonIntent>('brand');
  readonly type = input<CtaButtonType>('primary');
  readonly size = input<CtaButtonSize>('base');
  readonly variant = input<CtaButtonVariant>('text-only');

  /* ── Content ── */
  readonly label = input<string>('Button');
  readonly icon = input<IconName | undefined>(undefined);
  readonly iconType = input<IconType>('regular');

  /* ── Compound-specific ── */
  readonly chevronPosition = input<CtaButtonChevronPosition>('right');
  readonly showLabel = input<boolean>(true);

  /* ── Icon size override ── */
  readonly iconSize = input<IconSize | undefined>(undefined);

  /* ── Behaviour ── */
  readonly compact = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly toggled = input<boolean>(false);

  /* ── Output ── */
  readonly pressed = output<void>();

  /* ── Derived ── */
  /* Resolves icon size: explicit iconSize input > size default (mini→16px, base→20px) */
  protected readonly _resolvedIconSize = computed<IconSize>(() =>
    this.iconSize() ?? (this.size() === 'mini' ? 'mini' : 'base')
  );

  readonly chevronIconName = computed<IconName>(() =>
    this.chevronPosition() === 'left' ? 'chevron-left' : 'chevron-right'
  );

  readonly hasIcon = computed(() =>
    this.variant() !== 'text-only' && this.icon() !== undefined
  );

  readonly hasText = computed(() => {
    const v = this.variant();
    if (v === 'icon-only') return false;
    if (v === 'compound') return this.showLabel();
    return true;
  });

  /* ── Press state (minimum visual duration for quick taps) ── */
  readonly _visuallyPressed = signal(false);
  private _pressTimer: ReturnType<typeof setTimeout> | null = null;
  private _pressStart = 0;
  private static readonly MIN_PRESS_MS = 200;

  onPointerDown(): void {
    if (this.disabled()) return;
    this._pressStart = Date.now();
    if (this._pressTimer) { clearTimeout(this._pressTimer); this._pressTimer = null; }
    this._visuallyPressed.set(true);
  }

  onPointerUp(): void {
    if (!this._visuallyPressed()) return;
    const elapsed = Date.now() - this._pressStart;
    const remaining = CtaButtonComponent.MIN_PRESS_MS - elapsed;
    if (remaining > 0) {
      this._pressTimer = setTimeout(() => this._visuallyPressed.set(false), remaining);
    } else {
      this._visuallyPressed.set(false);
    }
  }

  onClick(): void {
    if (this.disabled()) return;
    this.pressed.emit();
  }
}
