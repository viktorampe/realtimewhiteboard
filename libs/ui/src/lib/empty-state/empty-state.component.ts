import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  @Input() image: string;
  @Input() title?: string;
  @Input() description: string;
  @Input() ctaLabel?: string;

  @Output() clickCta = new EventEmitter<void>();

  constructor() {}
}
