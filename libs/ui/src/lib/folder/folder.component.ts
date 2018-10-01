import { Component, Input } from '@angular/core';
import { ListFormat } from './enums/list-format.enum';

@Component({
  selector: 'campus-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent {
  @Input() title: string;
  @Input() icon: string;
  @Input() itemCount: string;
  @Input() backgroundColor = '#000000';
  @Input() listFormat: ListFormat;
  @Input() progress?: number;

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

  showDefaultIcon = false;
  showEmptyError: boolean;
}
