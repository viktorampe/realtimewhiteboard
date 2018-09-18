import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * @example
 * <campus-editable-inline-tag-list 
                         [titleText]="'Geselecteerd items'"
                         [items]="[{text: 'one'},{text: 'two', count: 12},{text: 'two', count: 1, editable: 3}]"></campus-editable-inline-tag-list>
 * 
 * @export
 * @class EditableInlineTagListComponent
 */
@Component({
  selector: 'campus-editable-inline-tag-list',
  templateUrl: './editable-inline-tag-list.component.html',
  styleUrls: ['./editable-inline-tag-list.component.scss']
})
export class EditableInlineTagListComponent {
  @Input() titleText: string;
  @Input() items: { text: string; count?: number; editable?: number }[];
  @Input() showIcon: boolean;
  @Output() iconClicked = new EventEmitter<boolean>();
  @Output() itemIconClicked = new EventEmitter<any>();

  onItemIconClick(editable: any): void {
    this.itemIconClicked.emit(editable);
  }

  onIconClick(): void {
    this.iconClicked.emit(true);
  }
}
