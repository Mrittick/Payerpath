import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  HostListener,
  input,
  model,
} from '@angular/core';

@Component({
  selector: 'merces-switch-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './switch-card.component.html',
  styleUrl: './switch-card.component.css',
})
export class SwitchCardComponent {
  /** On/off state — two-way bindable. Figma: Mode=True|False */
  checked = model<boolean>(false);

  /** Disables all interaction. */
  disabled = input<boolean>(false);

  /**
   * Switch position within the card row.
   * 'span'  → label left (fills space), switch at end/right  (Figma Orientation=Span)
   * 'stack' → switch left, label right                       (Figma Orientation=Stack)
   */
  orientation = input<'span' | 'stack'>('span');

  /**
   * Colour theme — currently Brand only. Neutral variant will be added later.
   * The component is already structured to accept 'neutral' seamlessly.
   */
  theme = input<'brand'>('brand');

  // ── Keyboard focus tracking ──────────────────────────────────────────────
  _keyboardFocused = false;
  private _focusFromMouse = false;

  // ── Host bindings ────────────────────────────────────────────────────────

  @HostBinding('class.switch-card--brand')
  get isBrand(): boolean { return this.theme() === 'brand'; }

  @HostBinding('class.switch-card--on')
  get isOn(): boolean { return this.checked(); }

  @HostBinding('class.switch-card--off')
  get isOff(): boolean { return !this.checked(); }

  @HostBinding('class.switch-card--disabled')
  get isDisabled(): boolean { return this.disabled(); }

  @HostBinding('class.switch-card--span')
  get isSpan(): boolean { return this.orientation() === 'span'; }

  @HostBinding('class.switch-card--stack')
  get isStack(): boolean { return this.orientation() === 'stack'; }

  @HostBinding('class.switch-card--keyboard-focus')
  get isKeyboardFocused(): boolean { return this._keyboardFocused; }

  @HostBinding('attr.role')
  readonly role = 'switch';

  @HostBinding('attr.aria-checked')
  get ariaChecked(): boolean { return this.checked(); }

  @HostBinding('attr.aria-disabled')
  get ariaDisabled(): true | null { return this.disabled() ? true : null; }

  @HostBinding('attr.tabindex')
  get tabIndex(): number { return this.disabled() ? -1 : 0; }

  // ── Host listeners ───────────────────────────────────────────────────────

  @HostListener('mousedown')
  onMouseDown(): void {
    this._focusFromMouse = true;
  }

  @HostListener('focus')
  onFocus(): void {
    if (!this._focusFromMouse) this._keyboardFocused = true;
    this._focusFromMouse = false;
  }

  @HostListener('blur')
  onBlur(): void {
    this._keyboardFocused = false;
  }

  @HostListener('click')
  onClick(): void {
    if (!this.disabled()) this.checked.set(!this.checked());
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onActivate(event: Event): void {
    event.preventDefault();
    if (!this.disabled()) this.checked.set(!this.checked());
  }
}
