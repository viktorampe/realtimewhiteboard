import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'campus-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  @Input() svgIcon: string;
  @Input() title?: string;
  @Input() description: string;
  @Input() ctaLabel?: string;

  @HostBinding('class.ui-empty-state--dense')
  @Input()
  dense = false;

  @HostBinding('class.ui-empty-state--horizontal')
  @Input()
  horizontal = false;

  @Output() clickCta = new EventEmitter<void>();

  @HostBinding('class.ui-empty-state')
  uiEmptyStateClass = true;

  constructor() {}

  public ctaClick() {
    this.clickCta.emit();
  }
}
