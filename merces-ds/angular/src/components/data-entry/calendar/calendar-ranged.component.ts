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
import { IconComponent } from '../../../assets/icon/icon.component';
import { CalendarUiRangedComponent } from '../../inputs-and-interactive/calendar/calendar-ui-ranged.component';

@Component({
  selector: 'merces-calendar-ranged',
  templateUrl: './calendar-ranged.component.html',
  styleUrl: './calendar-ranged.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IconComponent, CalendarUiRangedComponent],
  host: {
    '[class.calrf--open]':          '_open()',
    '[class.calrf--open-above]':    '_openAbove()',
    '[class.calrf--disabled]':      'disabled()',
    '[class.calrf--start-filled]':  'rangeStart() !== null',
    '[class.calrf--end-filled]':    'rangeEnd() !== null',
    '[class.calrf--padding-span]':  'padding() === "span"',
    '[class.calrf--standalone]':    'layout() === "standalone"',
    '(document:pointerdown)':      'onDocumentPointerdown($event)',
    '(focusout)':                  'onFocusout($event)',
  },
})
export class CalendarRangedComponent implements OnDestroy {
  /** Two-way bound range dates — null on either means incomplete. */
  rangeStart = model<Date | null>(null);
  rangeEnd   = model<Date | null>(null);

  disabled         = input(false);
  label            = input('Date Range');
  startPlaceholder = input('Start');
  endPlaceholder   = input('End');
  /** Padding variant — 'span' adds var(--gap-2xl) horizontal padding to the label row. */
  padding          = input<'default' | 'span'>('default');
  /**
   * Layout variant.
   * 'default'    — label row + input fields (all existing variants)
   * 'standalone' — input fields only, no label row (Figma: Layout=Standalone, Padding=Default)
   *                Use when the parent already provides a section label.
   */
  layout           = input<'default' | 'standalone'>('default');

  /** Emitted whenever the range changes. */
  rangeChanged = output<{ start: Date | null; end: Date | null }>();

  private readonly _el           = inject(ElementRef<HTMLElement>);
  private readonly _calRangedRef = viewChild(CalendarUiRangedComponent);

  _open      = signal(false);
  _openAbove = signal(false);

  constructor() {
    // Mirror dropdown: add/remove ancestor-scroll listener in sync with open state.
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

  /** Close when any scrollable ancestor scrolls — keeps overlay in sync with trigger. */
  private readonly _onAncestorScroll = (): void => {
    this._open.set(false);
  };

  /** Reads the field-wrap's viewport rect, decides open direction, and writes position
   *  custom properties onto the host — all before the overlay becomes visible.
   *  Mirrors the dropdown's _positionPanel() pattern. */
  private _positionOverlay(): void {
    const el        = this._el.nativeElement as HTMLElement;
    const fieldWrap = el.querySelector('.calrf__field-wrap') as HTMLElement | null;
    const overlay   = el.querySelector('.calrf__overlay')   as HTMLElement | null;
    if (!fieldWrap) return;

    const rect    = fieldWrap.getBoundingClientRect();
    const rootStyle = getComputedStyle(document.documentElement);
    const gapMd    = parseFloat(rootStyle.getPropertyValue('--gap-md')) || 8;
    const vh       = window.innerHeight;

    // Measure the rendered overlay height (it's in the DOM but opacity:0).
    const overlayH = overlay ? overlay.getBoundingClientRect().height : 0;

    const spaceBelow = vh - rect.bottom - gapMd;
    const spaceAbove = rect.top - gapMd;
    const openAbove  = spaceBelow < overlayH && spaceAbove >= overlayH;

    this._openAbove.set(openAbove);
    el.style.setProperty('--_overlay-top',    `${rect.bottom}px`);
    el.style.setProperty('--_overlay-bottom',  `${vh - rect.top}px`);
    el.style.setProperty('--_overlay-left',   `${rect.left}px`);
  }

  startDisplayText = computed(() => {
    const d = this.rangeStart();
    if (!d) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  });

  endDisplayText = computed(() => {
    const d = this.rangeEnd();
    if (!d) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  });

  onDocumentPointerdown(event: PointerEvent): void {
    if (!this._open()) return;
    if (!this._el.nativeElement.contains(event.target as Node)) {
      this._open.set(false);
    }
  }

  onFocusout(event: FocusEvent): void {
    const related = event.relatedTarget as HTMLElement | null;
    if (related && this._el.nativeElement.contains(related)) return;
    // A level switch inside the ranged UI removes the focused element from the DOM,
    // firing focusout with relatedTarget=null. Suppress close during that window.
    if (this._calRangedRef()?.transitioning) return;
    this._open.set(false);
  }

  onFrameClick(): void {
    if (this.disabled()) return;
    if (this._open()) {
      this._open.set(false);
    } else {
      this._positionOverlay();
      this._open.set(true);
      this._calRangedRef()?.syncToDate();
    }
  }

  onKeydownActivate(event: Event): void {
    if (this.disabled()) return;
    event.preventDefault();
    if (!this._open()) {
      this._positionOverlay();
      this._open.set(true);
      this._calRangedRef()?.syncToDate();
    } else {
      this._open.set(false);
    }
  }

  onEscape(): void {
    this._open.set(false);
  }

  /** Auto-closes when the range is complete (both start and end are set). */
  onRangeChanged(event: { start: Date | null; end: Date | null }): void {
    if (event.start && event.end) {
      this._open.set(false);
    }
    this.rangeChanged.emit(event);
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
