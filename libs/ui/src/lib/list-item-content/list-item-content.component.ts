import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'campus-list-item-content',
  templateUrl: './list-item-content.component.html',
  styleUrls: ['./list-item-content.component.scss']
})
export class ListItemContentComponent {
  @HostBinding('class.ui-list-item') private isListItemContent = true;

  @Input() contentRightSeparated = false;
}
