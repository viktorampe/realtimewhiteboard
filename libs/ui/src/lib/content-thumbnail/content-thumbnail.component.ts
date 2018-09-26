import { Component, Input } from '@angular/core';
import { ListViewItem } from '../list-view/base classes/list-view-item';

@Component({
  selector: 'campus-content-thumbnail',
  templateUrl: './content-thumbnail.component.html',
  styleUrls: ['./content-thumbnail.component.scss'],
  providers: [
    {
      provide: ListViewItem,
      useExisting: ContentThumbnailComponent
    }
  ]
})
export class ContentThumbnailComponent extends ListViewItem {
  @Input() listFormat: string;
  @Input() title: string;
  @Input() contentTypeClass: string;
  @Input() imagePath: string;
  @Input() fileExtensionClass: string;
  @Input() actionArray: any[];
}
