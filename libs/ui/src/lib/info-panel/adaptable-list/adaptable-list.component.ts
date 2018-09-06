import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-info-panel-adaptable-list',
  templateUrl: './adaptable-list.component.html',
  styleUrls: ['./adaptable-list.component.scss']
})
export class InfoPanelAdaptableListComponent {
  @Input() titleText: string;
  @Input() items: { text: string; count?: number; eventId?: number }[];
  @Output() iconClicked = new EventEmitter<number>();

  onIconClick(eventId: number) {
    this.iconClicked.emit(eventId);
  }
}
