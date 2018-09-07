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

  actionIconClickedEvent(text: string): void {
    console.log(text + ' icon clicked');
  }
  listItemIconClickedEvent(id: number): void {
    console.log('item ' + id + ' icon clicked');
  }
  listIconClickedEvent(): void {
    console.log('list icon clicked');
  }

  saveTitleEvent(title: string): void {
    console.log('title save: ' + title);
  }

  saveDescriptionEvent(description: string): void {
    console.log('description save: ' + description);
  }
}
