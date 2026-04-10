import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ClearComponent } from '../../inputs-and-interactive/sub-controls/clear/clear.component';
import { IconComponent } from '../../../assets/icon/icon.component';
import { StringfieldMessageComponent } from '../stringfield-plain/stringfield-plain-message/stringfield-plain-message.component';
import { CalendarUiComponent } from '../../inputs-and-interactive/calendar/calendar-ui.component';

@Component({
  selector: 'merces-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ClearComponent, IconComponent, StringfieldMessageComponent, CalendarUiComponent],
  host: {
    '[class.calf--empty]': 'isEmpty()',
    '[class.calf--filled]': '!isEmpty()',
    '[class.calf--open]': '_open()',
    '[class.calf--open-above]': '_openAbove()',
    '[class.calf--disabled]': 'disabled()',
    '[class.calf--warning]': 'validationState() === "warning"',
    '[class.calf--error]': 'validationState() === "error"',
    '[class.calf--padding-span]': 'padding() === "span"',
    '(document:pointerdown)': 'onDocumentPointerdown($event)',
    '(focusout)': 'onFocusout($event)',
  },
})
export class CalendarComponent implements OnDestroy {
  /** Two-way bound selected date. */
  value = model<Date | null>(null);

  placeholder = input('Select date');
  disabled = input(false);
  validationState = input<'default' | 'warning' | 'error'>('default');
  message = input('');
  /** Visible label text rendered above the field. Also used as aria-label on the trigger. */
  label = input('Date picker');
  /** Padding variant — 'span' adds var(--gap-2xl) horizontal padding to the label row,
   *  aligning it with content in a container that has its own horizontal padding. */
  padding = input<'default' | 'span'>('default');

  /** Emitted on selection or clear. */
  dateChanged = output<Date | null>();

  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _calendarUiRef = viewChild(CalendarUiComponent);

  _open = signal(false);
  _openAbove = signal(false);

  isEmpty = computed(() => this.value() === null);

  constructor() {
    effect(() => {
      if (this._open()) {
        document.addEventListener('scroll', this._onAncestorScroll, true);
      } else {
        document.removeEventListener('scroll', this._onAncestorScroll, true);
      }
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('scroll', this._onAncestorScroll, true);
  }

  private readonly _onAncestorScroll = (): void => {
    this._open.set(false);
  };

  private _positionOverlay(): void {
    const el        = this._el.nativeElement as HTMLElement;
    const fieldWrap = el.querySelector('.calf__field-wrap') as HTMLElement | null;
    const overlay   = el.querySelector('.calf__overlay')   as HTMLElement | null;
    if (!fieldWrap) return;

    const rect    = fieldWrap.getBoundingClientRect();
    const rootStyle = getComputedStyle(document.documentElement);
    const gapMd    = parseFloat(rootStyle.getPropertyValue('--gap-md')) || 8;
    const vh       = window.innerHeight;

    const overlayH = overlay ? overlay.getBoundingClientRect().height : 0;

    const spaceBelow = vh - rect.bottom - gapMd;
    const spaceAbove = rect.top - gapMd;
    const openAbove  = spaceBelow < overlayH && spaceAbove >= overlayH;

    this._openAbove.set(openAbove);
    el.style.setProperty('--_overlay-top',    `${rect.bottom}px`);
    el.style.setProperty('--_overlay-bottom',  `${vh - rect.top}px`);
    el.style.setProperty('--_overlay-left',   `${rect.left}px`);
  }

  displayText = computed(() => {
    const d = this.value();
    if (!d) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  });

  clearState = computed(
    (): 'default' | 'disabled' => (this.disabled() ? 'disabled' : 'default'),
  );

  showMessage = computed(
    () =>
      (this.validationState() === 'warning' || this.validationState() === 'error') &&
      this.message().length > 0,
  );

  onDocumentPointerdown(event: PointerEvent): void {
    if (!this._open()) return;
    if (!this._el.nativeElement.contains(event.target as Node)) {
      this._open.set(false);
    }
  }

  onFocusout(event: FocusEvent): void {
    const related = event.relatedTarget as HTMLElement | null;
    // Focus stayed inside the component — no action.
    if (related && this._el.nativeElement.contains(related)) return;
    // A level-switch dissolve removes the focused cell from the DOM, causing
    // focusout with relatedTarget=null. Suppress close during that window.
    if (this._calendarUiRef()?.transitioning) return;
    this._open.set(false);
  }

  onFrameClick(): void {
    if (this.disabled()) return;
    if (this._open()) {
      this._open.set(false);
    } else {
      this._positionOverlay();
      this._open.set(true);
      this._calendarUiRef()?.syncToDate();
    }
  }

  onKeydownActivate(event: Event): void {
    if (this.disabled()) return;
    event.preventDefault();
    if (!this._open()) {
      this._positionOverlay();
      this._open.set(true);
      this._calendarUiRef()?.syncToDate();
    } else {
      this._open.set(false);
    }
  }

  onEscape(): void {
    this._open.set(false);
  }

  onDateSelected(_date: Date): void {
    // value already updated via [(selectedDate)] two-way binding in template.
    // Just close the panel and notify parent.
    this._open.set(false);
    this.dateChanged.emit(this.value());
  }

  onClear(): void {
    this.value.set(null);
    this.dateChanged.emit(null);
  }

  onOverlayTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName === 'visibility' && !this._open()) {
      const el = this._el.nativeElement as HTMLElement;
      el.style.removeProperty('--_overlay-top');
      el.style.removeProperty('--_overlay-bottom');
      el.style.removeProperty('--_overlay-left');
    }
  }
}
