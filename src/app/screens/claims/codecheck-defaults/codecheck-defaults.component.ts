import { Component, ChangeDetectionStrategy } from '@angular/core';
import { WipComponent } from '../../global/wip/wip.component';

@Component({
  selector: 'payerpath-codecheck-defaults',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WipComponent],
  template: '<payerpath-wip />',
  styles: [':host { display: flex; flex: 1; }'],
})
export class CodeCheckDefaultsComponent {}
