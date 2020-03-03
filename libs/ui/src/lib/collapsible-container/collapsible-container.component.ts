import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'campus-collapsible-container',
  templateUrl: './collapsible-container.component.html',
  styleUrls: ['./collapsible-container.component.scss']
})
export class CollapsibleContainerComponent {
  @HostBinding('class.ui-collapsible-container')
  private uiCollapsibleContainerClass = true;

  constructor() {}
}
