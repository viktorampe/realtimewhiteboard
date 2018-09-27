import { Component, Input } from '@angular/core';
import { ListViewItemInterface } from '../list-view/base classes/list-view-item';

@Component({
  selector: 'campus-content-thumbnail',
  templateUrl: './content-thumbnail.component.html',
  styleUrls: ['./content-thumbnail.component.scss'],
  providers: [
    {
      provide: ListViewItemInterface,
      useExisting: ContentThumbnailComponent
    }
  ]
})
export class ContentThumbnailComponent implements ListViewItemInterface {
  @Input() listFormat: string;
  @Input() title: string;
  @Input() contentTypeClass: string;
  @Input() imagePath: string;
  @Input() fileExtensionClass: string;
  @Input() actionArray: any[];
}
