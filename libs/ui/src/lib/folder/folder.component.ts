import { Component, Input } from '@angular/core';
import { ListFormat } from '../list-view/enums/list-format.enum';
import { ListViewItemInterface } from '../list-view/interfaces/list-view-item';

@Component({
  selector: 'campus-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss'],
  providers: [
    {
      provide: ListViewItemInterface,
      useExisting: FolderComponent
    }
  ]
})
export class FolderComponent implements ListViewItemInterface {
  showEmptyError: boolean;

  @Input() title: string;
  @Input() icon: string;
  @Input() itemCount: string;
  @Input() backgroundColor = '#000000';
  @Input() listFormat: ListFormat;
  @Input() progress?: number;

  protected listFormatEnum = ListFormat;
  /**
   * Whether to show an exclamation mark when folder is empty (itemCount is zero).
   *
   * @memberof FolderComponent
   */
  @Input()
  set errorOnEmpty(value) {
    if (value) {
      if (
        isNaN(parseInt(this.itemCount, 10)) ||
        parseInt(this.itemCount, 10) === 0
      ) {
        this.showEmptyError = true;
      }
    }
  }
}
