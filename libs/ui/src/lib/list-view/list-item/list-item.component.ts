import { Component, Input, EventEmitter, Output } from '@angular/core';

/**
 * Placeholder child component
 * TODO: remove
 *
 * @export
 * @class ListItemComponent
 */
@Component({
  selector: 'campus-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {
  @Input() folder: Folder;
  @Input() isGridElement: boolean;

  @Output() clicked = new EventEmitter<Folder>();

  onClick() {
    if (this.clicked) {
      this.clicked.emit(this.folder);
    }
  }
}

export class Folder {
  Id: number;
  Name: string;
}
