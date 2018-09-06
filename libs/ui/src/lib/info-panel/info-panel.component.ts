import { Component } from '@angular/core';

@Component({
  selector: 'campus-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent {
  items: { text: string; count?: number; eventId?: number }[] = [
    { text: 'Wetenschappen - Wiskunde 1', count: 20, eventId: 1 },
    { text: 'Wetenschappen - Wiskunde 2', count: 9 },
    { text: 'Wetenschappen - Wiskunde 3' },
    { text: 'Wetenschappen - Wiskunde 4', eventId: 2 }
  ];

  iconClickedEvent(text: string) {
    console.log(text + ' icon clicked');
  }
  itemIconClickedEvent(id: number) {
    console.log('item ' + id + ' icon clicked');
  }
}
