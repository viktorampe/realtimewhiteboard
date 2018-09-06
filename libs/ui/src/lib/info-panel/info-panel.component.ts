import { Component } from '@angular/core';

@Component({
  selector: 'campus-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent {
  iconClickedEvent(text: string) {
    console.log(text + ' icon clicked');
  }
}
