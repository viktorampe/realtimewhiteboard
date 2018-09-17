import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * @example
 * <campus-adaptable-list 
                         [titleText]="'Geselecteerd items'"
                         [items]="[{text: 'one'},{text: 'two', count: 12},{text: 'two', count: 1, eventId: 3}]"></campus-adaptable-list>
 * 
 * @export
 * @class AdaptableListComponent
 */
@Component({
  selector: 'campus-adaptable-list',
  templateUrl: './adaptable-list.component.html',
  styleUrls: ['./adaptable-list.component.scss']
})
export class AdaptableListComponent {
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
