import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'merces-overlay-scroll',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './overlay-scroll.component.html',
  styleUrl: './overlay-scroll.component.css',
})
export class OverlayScrollComponent implements AfterViewInit, OnDestroy {
  @ViewChild('viewport') private readonly _vp!: ElementRef<HTMLElement>;
  @ViewChild('content')  private readonly _ct!: ElementRef<HTMLElement>;

  private readonly _zone = inject(NgZone);

  /* ── Vertical ── */
  protected readonly hasScrollY = signal(false);
  protected readonly draggingY  = signal(false);
  protected readonly thumbH     = signal(0);
  protected readonly thumbTop   = signal(0);

  /* ── Horizontal ── */
  protected readonly hasScrollX = signal(false);
  protected readonly draggingX  = signal(false);
  protected readonly thumbW     = signal(0);
  protected readonly thumbLeft  = signal(0);

  private _ro?: ResizeObserver;
  private _dragStartY          = 0;
  private _dragStartScrollTop  = 0;
  private _dragStartX          = 0;
  private _dragStartScrollLeft = 0;

  ngAfterViewInit(): void {
    this._zone.runOutsideAngular(() => {
      this._ro = new ResizeObserver(() => this._zone.run(() => this._sync()));
      this._ro.observe(this._vp.nativeElement);
      this._ro.observe(this._ct.nativeElement);
    });
    this._sync();
  }

  ngOnDestroy(): void {
    this._ro?.disconnect();
  }

  protected onScroll(): void {
    this._sync();
  }

  private _sync(): void {
    const vp    = this._vp.nativeElement;
    const style = window.getComputedStyle(vp);

    const scrollableY = vp.scrollHeight > vp.clientHeight + 1 && style.overflowY !== 'hidden';
    this.hasScrollY.set(scrollableY);
    if (scrollableY) {
      const tH        = Math.max(vp.clientHeight * (vp.clientHeight / vp.scrollHeight), 40);
      const maxScroll = vp.scrollHeight - vp.clientHeight;
      this.thumbH.set(tH);
      this.thumbTop.set((maxScroll > 0 ? vp.scrollTop / maxScroll : 0) * (vp.clientHeight - tH));
    }

    const scrollableX = vp.scrollWidth > vp.clientWidth + 1 && style.overflowX !== 'hidden';
    this.hasScrollX.set(scrollableX);
    if (scrollableX) {
      const tW        = Math.max(vp.clientWidth * (vp.clientWidth / vp.scrollWidth), 40);
      const maxScroll = vp.scrollWidth - vp.clientWidth;
      this.thumbW.set(tW);
      this.thumbLeft.set((maxScroll > 0 ? vp.scrollLeft / maxScroll : 0) * (vp.clientWidth - tW));
    }
  }

  /* ── Vertical interactions ── */

  protected onThumbYMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingY.set(true);
    this._dragStartY        = event.clientY;
    this._dragStartScrollTop = this._vp.nativeElement.scrollTop;
  }

  protected onTrackYMouseDown(event: MouseEvent): void {
    if (event.target !== event.currentTarget) return;
    const vp   = this._vp.nativeElement;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    vp.scrollTop = ((event.clientY - rect.top) / rect.height) * (vp.scrollHeight - vp.clientHeight);
    this._sync();
  }

  /* ── Horizontal interactions ── */

  protected onThumbXMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingX.set(true);
    this._dragStartX         = event.clientX;
    this._dragStartScrollLeft = this._vp.nativeElement.scrollLeft;
  }

  protected onTrackXMouseDown(event: MouseEvent): void {
    if (event.target !== event.currentTarget) return;
    const vp   = this._vp.nativeElement;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    vp.scrollLeft = ((event.clientX - rect.left) / rect.width) * (vp.scrollWidth - vp.clientWidth);
    this._sync();
  }

  /* ── Global mouse tracking ── */

  @HostListener('document:mousemove', ['$event'])
  onDocMouseMove(e: MouseEvent): void {
    if (this.draggingY()) {
      const vp        = this._vp.nativeElement;
      const trackH    = vp.clientHeight - this.thumbH();
      const maxScroll = vp.scrollHeight - vp.clientHeight;
      vp.scrollTop    = Math.max(0, Math.min(
        this._dragStartScrollTop + (trackH > 0 ? (e.clientY - this._dragStartY) / trackH : 0) * maxScroll,
        maxScroll,
      ));
      this._sync();
    }
    if (this.draggingX()) {
      const vp        = this._vp.nativeElement;
      const trackW    = vp.clientWidth - this.thumbW();
      const maxScroll = vp.scrollWidth - vp.clientWidth;
      vp.scrollLeft   = Math.max(0, Math.min(
        this._dragStartScrollLeft + (trackW > 0 ? (e.clientX - this._dragStartX) / trackW : 0) * maxScroll,
        maxScroll,
      ));
      this._sync();
    }
  }

  @HostListener('document:mouseup')
  onDocMouseUp(): void {
    if (this.draggingY()) this.draggingY.set(false);
    if (this.draggingX()) this.draggingX.set(false);
  }
}
