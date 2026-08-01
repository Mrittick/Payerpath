import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  HostListener,
  input,
  model,
} from '@angular/core';

@Component({
  selector: 'merces-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css',
})
export class SwitchComponent {
  /** Visual size. Figma: Size=Base|Mini */
  size = input<'base' | 'mini'>('base');

  /** Colour theme. Figma: Switch Toggle - Brand | Neutral */
  theme = input<'brand' | 'neutral'>('brand');

  /** On/off state — two-way bindable. Figma: Mode=True|False */
  checked = model<boolean>(false);

  /** Disables all interaction. */
  disabled = input<boolean>(false);

  /**
   * Optional label text. When provided, Group mode is active and the label
   * is shown alongside the switch. Figma: Group=True + Text Frame.
   */
  label = input<string | undefined>(undefined);

  /**
   * Which side the switch sits on when a label is present.
   * 'left'  → switch left,  label right  (Figma Orientation=Left, default)
   * 'right' → switch right, label left   (Figma Orientation=Right)
   */
  orientation = input<'left' | 'right'>('left');

  // ── Keyboard focus tracking ──────────────────────────────────────────────
  _keyboardFocused = false;
  private _focusFromMouse = false;

  // ── Host bindings ────────────────────────────────────────────────────────

  @HostBinding('class.switch--base')
  get isBase(): boolean { return this.size() === 'base'; }

  @HostBinding('class.switch--mini')
  get isMini(): boolean { return this.size() === 'mini'; }

  @HostBinding('class.switch--brand')
  get isBrand(): boolean { return this.theme() === 'brand'; }

  @HostBinding('class.switch--neutral')
  get isNeutral(): boolean { return this.theme() === 'neutral'; }

  @HostBinding('class.switch--on')
  get isOn(): boolean { return this.checked(); }

  @HostBinding('class.switch--off')
  get isOff(): boolean { return !this.checked(); }

  @HostBinding('class.switch--disabled')
  get isDisabled(): boolean { return this.disabled(); }

  @HostBinding('class.switch--group')
  get isGroup(): boolean { return !!this.label(); }

  @HostBinding('class.switch--orientation-left')
  get isOrientLeft(): boolean { return this.orientation() === 'left'; }

  @HostBinding('class.switch--orientation-right')
  get isOrientRight(): boolean { return this.orientation() === 'right'; }

  @HostBinding('class.switch--keyboard-focus')
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
