import { InjectionToken } from '@angular/core';
import type { WritableSignal } from '@angular/core';

export interface AccordionGroupRef {
  register(openSignal: WritableSignal<boolean>): void;
  unregister(openSignal: WritableSignal<boolean>): void;
  requestOpen(openSignal: WritableSignal<boolean>): void;
}

export const ACCORDION_GROUP = new InjectionToken<AccordionGroupRef>('AccordionGroup');
