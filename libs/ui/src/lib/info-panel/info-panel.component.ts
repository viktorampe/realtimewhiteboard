import { Component } from '@angular/core';

@Component({
  selector: 'campus-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent {
  redIconClickedEvent() {
    console.log('red icon clicked');
  }
  grayIconClickedEvent() {
    console.log('gray icon clicked');
  }
}
