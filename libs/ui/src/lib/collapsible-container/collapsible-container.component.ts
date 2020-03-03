import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'campus-collapsible-container',
  templateUrl: './collapsible-container.component.html',
  styleUrls: ['./collapsible-container.component.scss']
})
export class CollapsibleContainerComponent {
  @Input() isOpen: boolean;
  @Input() isDisabled = false;

  @HostBinding('class.ui-collapsible-container')
  private uiCollapsibleContainerClass = true;

  constructor() {}
}
