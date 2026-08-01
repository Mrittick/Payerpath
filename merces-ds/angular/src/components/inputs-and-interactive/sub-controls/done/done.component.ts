import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  HostBinding,
  HostListener,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';

export type DoneSize  = 'base' | 'mini';
export type DoneLevel = 'primary' | 'secondary' | 'tertiary';
export type DoneState = 'hidden' | 'default' | 'disabled';

@Component({
  selector: 'merces-done',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './done.component.html',
  styleUrl: './done.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.done--base]': 'size() === "base"',
    '[class.done--mini]': 'size() === "mini"',
    '[class.done--primary]': 'level() === "primary"',
    '[class.done--secondary]': 'level() === "secondary"',
    '[class.done--tertiary]': 'level() === "tertiary"',
    '[class.done--hidden]': 'state() === "hidden"',
    '[class.done--disabled]': 'state() === "disabled"',
    '[class.done--has-label]': 'showLabel()',
    '[attr.aria-disabled]': 'state() === "disabled" ? "true" : null',
    'role': 'button',
    '[tabindex]': 'state() === "disabled" || state() === "hidden" ? -1 : 0',
  },
})
export class DoneComponent {
  /* ── Inputs ── */
  readonly size      = input<DoneSize>('base');
  readonly level     = input<DoneLevel>('primary');
  readonly state     = input<DoneState>('default');
  readonly label     = input<boolean>(false);
  readonly labelText = input<string>('Done');

  /* ── Output ── */
  readonly done = output<void>();

  /* ── Computed ── */
  readonly showLabel = computed(() => this.label() && this.size() === 'base');

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;

  @HostBinding('class.done--keyboard-focused')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

  @HostListener('keydown.enter') onEnter(): void { this._emitIfEnabled(); }
  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    this._emitIfEnabled();
  }
  @HostListener('click') onClick(): void { this._emitIfEnabled(); }

  @HostListener('focus') onFocus(): void {
    /* Only mark keyboard-focused if no recent mouse activity */
  }
  @HostListener('blur') onBlur(): void { this._keyboardFocused = false; }
  @HostListener('mousedown') onMouseDown(): void {
    this._keyboardFocused = false;
  }

  @HostListener('document:keydown.tab')
  @HostListener('document:keydown.shift.tab')
  onTabKey(): void { this._keyboardFocused = true; }

  private _emitIfEnabled(): void {
    if (this.state() !== 'disabled' && this.state() !== 'hidden') {
      this.done.emit();
    }
  }
}
