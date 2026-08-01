import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  HostBinding,
  HostListener,
} from '@angular/core';
import { IconComponent } from '../../../../../assets/icon/icon.component';
import {
  DropdownItemMode,
  DropdownItemOrientation,
  DropdownItemState,
} from './dropdown-item.types';

@Component({
  selector: 'merces-dropdown-item',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './dropdown-item.component.html',
  styleUrl: './dropdown-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'option',
    '[class.dropdown-item--single-select]': 'mode() === "single-select"',
    '[class.dropdown-item--multi-select]': 'mode() === "multi-select"',
    '[class.dropdown-item--choice]': 'mode() === "choice"',
    '[class.dropdown-item--left]': 'orientation() === "left"',
    '[class.dropdown-item--right]': 'orientation() === "right"',
    '[class.dropdown-item--checked]': 'checked()',
    '[class.dropdown-item--disabled]': 'state() === "disabled"',
    '[class.dropdown-item--highlighted]': 'highlighted()',
    '[class.dropdown-item--truncate]': 'truncateText()',
    '[attr.id]': 'itemId() || null',
    '[attr.aria-selected]': 'checked()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[tabindex]': 'isDisabled() ? -1 : 0',
  },
})
export class DropdownItemComponent {
  /* ── Inputs ── */
  readonly mode = input<DropdownItemMode>('single-select');
  readonly orientation = input<DropdownItemOrientation>('left');
  readonly checked = input<boolean>(false);
  readonly state = input<DropdownItemState>('default');
  readonly highlighted = input<boolean>(false);
  readonly moreInfo = input<boolean>(false);
  readonly truncateText = input<boolean>(false);
  readonly itemId = input<string | undefined>(undefined);
  readonly label = input<string>('Item');

  /* ── Outputs ── */
  readonly selected = output<void>();
  readonly infoClicked = output<void>();

  /* ── Computed ── */
  readonly isSingleSelect = computed(() => this.mode() === 'single-select');
  readonly isMultiSelect = computed(() => this.mode() === 'multi-select');
  readonly isChoice = computed(() => this.mode() === 'choice');
  readonly isLeft = computed(() => this.orientation() === 'left');
  readonly isDisabled = computed(() => this.state() === 'disabled');

  /* ── Keyboard focus tracking ── */
  private _keyboardFocused = false;
  private _focusFromMouse = false;

  @HostBinding('class.dropdown-item--keyboard-focus')
  get keyboardFocused(): boolean { return this._keyboardFocused; }

  @HostListener('mousedown') onMouseDown(): void {
    this._focusFromMouse = true;
    this._keyboardFocused = false;
  }

  @HostListener('focus') onFocus(): void {
    this._keyboardFocused = !this._focusFromMouse;
    this._focusFromMouse = false;
  }

  @HostListener('blur') onBlur(): void {
    this._keyboardFocused = false;
  }

  @HostListener('click') onClick(): void { this._selectIfEnabled(); }
  @HostListener('keydown.enter') onEnter(): void { this._selectIfEnabled(); }
  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    this._selectIfEnabled();
  }

  onInfoClick(event: Event): void {
    event.stopPropagation();
    this.infoClicked.emit();
  }

  private _selectIfEnabled(): void {
    if (!this.isDisabled()) {
      this.selected.emit();
    }
  }
}
