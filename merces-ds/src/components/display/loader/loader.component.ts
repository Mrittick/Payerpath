import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'merces-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
  host: {
    '[style.--loader-size]': 'size() + "px"',
    'role': 'status',
    '[attr.aria-label]': 'label()',
  },
})
export class LoaderComponent {
  readonly size = input<number>(80);
  readonly label = input<string>('Loading');
}
