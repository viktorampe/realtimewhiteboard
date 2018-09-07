import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-info-panel-adaptable-list',
  templateUrl: './adaptable-list.component.html',
  styleUrls: ['./adaptable-list.component.scss']
})
export class InfoPanelAdaptableListComponent {
  @Input() titleText: string;
  @Input() items: { text: string; count?: number; eventId?: number }[];
  @Input() showIcon: boolean;
  @Output() iconClicked = new EventEmitter<boolean>();
  @Output() itemIconClicked = new EventEmitter<number>();

  onItemIconClick(eventId: number) {
    this.itemIconClicked.emit(eventId);
  }

  onIconClick(): void {
    this.iconClicked.emit(true);
  }

}
