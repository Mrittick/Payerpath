import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
  signal,
  model,
  viewChild,
  ElementRef,
} from '@angular/core';
import { IconComponent } from '../../../../assets/icon/icon.component';
import { ClearComponent } from '../clear/clear.component';

export type SearchSize = 'base' | 'compact';
export type SearchPalette = 'brand' | 'neutral';

@Component({
  selector: 'merces-search',
  standalone: true,
  imports: [IconComponent, ClearComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  host: {
    '[class.search--base]': 'size() === "base"',
    '[class.search--compact]': 'size() === "compact"',
    '[class.search--disabled]': 'disabled()',
    '[class.search--active]': 'isActive()',
    '[class.search--inactive]': '!isActive() && !disabled()',
    '[class.search--editing]': 'editing()',
    '[class.search--keyboard-focus]': 'keyboardFocused()',
    '[class.search--clearing]': 'clearing()',
    '[class.search--palette-neutral]': 'palette() === "neutral"',
  },
})
export class SearchComponent {
  /** Visual size variant. */
  readonly size = input<SearchSize>('base');

  /** Colour palette — 'brand' (default, purple) or 'neutral' (greys). */
  readonly palette = input<SearchPalette>('brand');

  /** Whether the component is disabled. */
  readonly disabled = input<boolean>(false);

  /** Placeholder text shown when inactive. */
  readonly placeholder = input<string>('Search');

  /** Two-way bound search value. */
  readonly value = model<string>('');

  /** Emitted when the user submits a search (e.g. presses Enter). */
  readonly search = output<string>();

  /** Emitted when the clear button is clicked. */
  readonly cleared = output<void>();

  /** Whether the input is currently focused/being edited. */
  readonly editing = signal<boolean>(false);

  /** Whether focus was initiated via keyboard. */
  readonly keyboardFocused = signal<boolean>(false);

  /** Whether text is fading out before being cleared. */
  readonly clearing = signal<boolean>(false);

  /** Active when value is non-empty. */
  readonly isActive = computed(() => this.value().length > 0);

  /** Clear visible whenever there's a value (active), hidden otherwise. */
  readonly clearState = computed(() =>
    this.isActive() ? 'default' as const : 'hidden' as const
  );

  /** Icon size derived from component size. */
  readonly iconSize = computed(() =>
    this.size() === 'compact' ? 'mini' as const : 'base' as const
  );

  /** Icon type derived from component size. */
  readonly iconType = computed(() =>
    this.size() === 'compact' ? 'bold' as const : 'regular' as const
  );

  /** Reference to the native input element. */
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  /** Tracks whether the upcoming focus is from a mouse click. */
  private _focusFromMouse = false;

  /** Clicking anywhere on the frame focuses the input. */
  onFrameClick(): void {
    if (this.disabled()) return;
    this.inputRef()?.nativeElement.focus();
  }

  onMousedown(): void {
    this._focusFromMouse = true;
  }

  onFocus(): void {
    if (this.disabled()) return;
    this.editing.set(true);
    this.keyboardFocused.set(!this._focusFromMouse);
    this._focusFromMouse = false;
  }

  onBlur(): void {
    this.editing.set(false);
    this.keyboardFocused.set(false);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search.emit(this.value());
    }
  }

  onClear(): void {
    this.clearing.set(true);

    setTimeout(() => {
      this.value.set('');
      this.clearing.set(false);
      this.cleared.emit();
      this.inputRef()?.nativeElement.focus();
    }, 150);
  }
}
