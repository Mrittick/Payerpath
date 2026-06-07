import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { CtaButtonComponent } from '@merces/components/inputs-and-interactive/cta-button/cta-button.component';
import { TabButtonComponent } from '@merces/components/inputs-and-interactive/tab-button/tab-button.component';
import { PayerButtonComponent } from '../payer-button/payer-button.component';
import { EcInfoSectionComponent, type EcInfoRow } from '../ec-info-section/ec-info-section.component';
import { EcBenefitsSectionComponent } from '../ec-benefits-section/ec-benefits-section.component';
import { EcAlertsSectionComponent } from '../ec-alerts-section/ec-alerts-section.component';
import { EcRelatedEntitiesSectionComponent } from '../ec-related-entities-section/ec-related-entities-section.component';
import type { EcRowData, EcPayerFound, BenefitGroup, AlertRow, RelatedEntityEntry } from '../data-table-entryrow/data-table-entryrow.types';
import type { BadgeResultOutcome } from '../badge-result/badge-result.component';

type PayerSlot = 'core' | 'primary' | 'secondary' | 'tertiary';

@Component({
  selector: 'payerpath-ec-detail-tray',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CtaButtonComponent, TabButtonComponent, PayerButtonComponent, EcInfoSectionComponent, EcBenefitsSectionComponent, EcAlertsSectionComponent, EcRelatedEntitiesSectionComponent],
  templateUrl: './detail-tray.component.html',
  styleUrl: './detail-tray.component.css',
  host: {
    '[class.tray--open]': 'row() !== null',
  },
})
export class EcDetailTrayComponent implements OnInit, OnDestroy {
  private readonly _el = inject(ElementRef<HTMLElement>);

  readonly row   = input<EcRowData | null>(null);
  readonly close = output<void>();

  ngOnInit(): void {
    // Portal to document.body — escapes the view-transition-name stacking
    // context on .screen so position:fixed + z-index:100 is evaluated in the
    // root stacking context, covering the global header (z-index:10) and nav.
    document.body.appendChild(this._el.nativeElement);
  }

  ngOnDestroy(): void {
    this._el.nativeElement.remove();
  }

  readonly _activePayerId = signal<PayerSlot>('core');
  readonly _activeTab     = signal<'summary' | 'details'>('summary');

  // ── Section open states (two-way bound to each accordion section) ────────────
  // Index: 0=Payer, 1=Transaction, 2=Subscriber, 3=Insurance, 4=Benefits, 5=Alerts, 6=Related Entities
  readonly _sOpen = [signal(true), signal(true), signal(true), signal(true), signal(true), signal(true), signal(true)];

  protected readonly _anyOpen = computed(() => this._sOpen.some(s => s()));

  protected toggleAll(): void {
    const next = !this._anyOpen();
    this._sOpen.forEach(s => s.set(next));
  }

  // Reset payer + section state whenever a new row is opened
  constructor() {
    effect(() => {
      this.row();
      untracked(() => {
        this._activePayerId.set('core');
        this._sOpen.forEach(s => s.set(true));
      });
    });
  }

  // True when every payer slot has found=false — drives the empty state view in Main
  protected readonly _allPayersNotFound = computed(() => {
    const r = this.row();
    if (!r) return false;
    return !r.payers.core.found && !r.payers.primary.found && !r.payers.secondary.found;
  });

  // Flat view model for sidebar buttons — keeps template bindings type-safe
  protected readonly _sidebar = computed(() => {
    const r = this.row();
    if (!r) return null;

    const core      = r.payers.core;
    const primary   = r.payers.primary;
    const secondary = r.payers.secondary;

    return {
      coreFound:        core.found,
      coreEntries:      (core.found      ? [core.name]      : ['Not found']) as string[],
      coreOutcome:      (core.found      ? core.result      : 'unknown')     as BadgeResultOutcome,
      primaryEntries:   (primary.found   ? [primary.name]   : ['Not found']) as string[],
      primaryFound:     primary.found,
      secondaryEntries: (secondary.found ? [secondary.name] : ['Not found']) as string[],
      secondaryFound:   secondary.found,
    };
  });

  // Resolves the active payer — null when slot is not found (all sections show '—')
  protected readonly _activePayer = computed<EcPayerFound | null>(() => {
    const r = this.row();
    if (!r) return null;
    const p = r.payers[this._activePayerId()];
    return p.found ? (p as EcPayerFound) : null;
  });

  protected readonly _payerRows = computed<EcInfoRow[]>(() => {
    if (!this.row()) return [];
    const p = this._activePayer();
    return [
      { label: 'Name',           value: p?.name           ?? null },
      { label: 'Identification', value: p?.identification ?? null },
    ];
  });

  protected readonly _transactionRows = computed<EcInfoRow[]>(() => {
    if (!this.row()) return [];
    const p = this._activePayer();
    return [
      { label: 'Transaction Date', value: p?.transactionDate ?? null },
      { label: 'Provider Name',    value: p?.providerName    ?? null },
      { label: 'NPI',              value: p?.npi             ?? null },
      { label: 'Payerpath TRN',    value: p?.payerpathTrn   ?? null },
    ];
  });

  protected readonly _subscriberRows = computed<EcInfoRow[]>(() => {
    if (!this.row()) return [];
    const p = this._activePayer();
    return [
      { label: 'Name',          value: p?.subscriberName ?? null },
      { label: 'Date of Birth', value: p?.dateOfBirth    ?? null },
      { label: 'Address',       value: p?.address        ?? null },
    ];
  });

  protected readonly _insuranceRows = computed<EcInfoRow[]>(() => {
    if (!this.row()) return [];
    const p = this._activePayer();
    return [{ label: 'Subscriber ID', value: p?.subscriberId ?? null }];
  });

  protected readonly _benefitGroups = computed<BenefitGroup[]>(() => {
    return this._activePayer()?.benefits ?? [];
  });

  protected readonly _alertRows = computed<AlertRow[]>(() => {
    return this._activePayer()?.alerts ?? [];
  });

  protected readonly _relatedEntities = computed<RelatedEntityEntry[]>(() => {
    return this._activePayer()?.relatedEntities ?? [];
  });

  setActivePayerId(id: PayerSlot): void {
    this._activePayerId.set(id);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.row() !== null) this.close.emit();
  }
}
