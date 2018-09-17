import { Folder } from './../list-view.component';
import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'campus-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {
  @Input() folder: Folder;
  @Input() isGridElement: boolean;

  @Output() clicked = new EventEmitter<number>();

  onClick() {
    this.clicked.emit(this.folder.Id);
  }
}
