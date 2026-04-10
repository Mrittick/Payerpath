import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import type { WritableSignal } from '@angular/core';
import { ACCORDION_GROUP } from './accordion-group.token';
import type { AccordionGroupRef } from './accordion-group.token';

/**
 * Wraps one or more merces-accordion components.
 *
 * exclusive="false" (default) — all accordions can be open simultaneously.
 * exclusive="true"            — only one accordion can be open at a time;
 *                               opening any accordion closes the others.
 *
 * Usage:
 *   <merces-accordion-group [exclusive]="true">
 *     <merces-accordion label="A" [entries]="..." />
 *     <merces-accordion label="B" [entries]="..." />
 *   </merces-accordion-group>
 */
@Component({
  selector: 'merces-accordion-group',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './accordion-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ACCORDION_GROUP, useExisting: AccordionGroupComponent }],
})
export class AccordionGroupComponent implements AccordionGroupRef {
  readonly exclusive = input<boolean>(false);

  private readonly _registry = new Set<WritableSignal<boolean>>();

  register(openSignal: WritableSignal<boolean>): void {
    this._registry.add(openSignal);
  }

  unregister(openSignal: WritableSignal<boolean>): void {
    this._registry.delete(openSignal);
  }

  /**
   * Called by each child accordion when the user toggles it.
   * In exclusive mode, closes all siblings before opening the target.
   */
  requestOpen(openSignal: WritableSignal<boolean>): void {
    const willOpen = !openSignal();
    if (this.exclusive() && willOpen) {
      this._registry.forEach(sig => {
        if (sig !== openSignal) sig.set(false);
      });
    }
    openSignal.set(willOpen);
  }
}
