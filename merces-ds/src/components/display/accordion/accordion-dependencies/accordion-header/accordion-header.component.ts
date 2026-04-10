import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  input,
  output,
} from '@angular/core';
import { IconComponent } from '../../../../../assets/icon/icon.component';
import { CheckboxComponent } from '../../../../inputs-and-interactive/checkboxes/checkbox/checkbox.component';
import type { AccordionHeaderFlavour, AccordionHeaderHierarchy } from './accordion-header.types';
import type { AccordionHeaderCheckboxState } from './accordion-header.types';

@Component({
  selector: 'merces-accordion-header',
  standalone: true,
  imports: [IconComponent, CheckboxComponent],
  templateUrl: './accordion-header.component.html',
  styleUrl: './accordion-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'button',
    '[attr.aria-expanded]': 'isOpen()',
    '[tabindex]': '0',
    '[class.accordion-header--brand]':              'flavour() === "brand"',
    '[class.accordion-header--emphasis]':           'flavour() === "emphasis"',
    '[class.accordion-header--danger]':             'flavour() === "danger"',
    '[class.accordion-header--hierarchy-base]':     'hierarchy() === "base"',
    '[class.accordion-header--hierarchy-emphasis]': 'hierarchy() === "emphasis"',
    '[class.accordion-header--hierarchy-strong]':   'hierarchy() === "strong"',
    '[class.accordion-header--open]':               'isOpen()',
  },
})
export class AccordionHeaderComponent {
  readonly flavour              = input<AccordionHeaderFlavour>('brand');
  readonly hierarchy            = input<AccordionHeaderHierarchy>('base');
  readonly label                = input<string>('Accordion Header');
  readonly isOpen               = input<boolean>(false);
  readonly multiSelect          = input<boolean>(false);
  readonly headerCheckboxState  = input<AccordionHeaderCheckboxState>('unchecked');

  readonly headerClick         = output<void>();
  readonly headerCheckboxChange = output<void>();

  private _keyFocused = false;
  private _fromMouse  = false;

  @HostBinding('class.accordion-header--keyboard-focus')
  get keyFocused(): boolean { return this._keyFocused; }

  @HostListener('mousedown') onMouseDown(): void {
    this._fromMouse = true;
    this._keyFocused = false;
  }

  @HostListener('focus') onFocus(): void {
    this._keyFocused = !this._fromMouse;
    this._fromMouse = false;
  }

  @HostListener('blur') onBlur(): void { this._keyFocused = false; }

  @HostListener('click') onClick(): void { this.headerClick.emit(); }

  onCheckboxChange(): void { this.headerCheckboxChange.emit(); }

  @HostListener('keydown.enter') onEnter(): void { this.headerClick.emit(); }

  @HostListener('keydown.space', ['$event']) onSpace(e: Event): void {
    e.preventDefault();
    this.headerClick.emit();
  }
}
