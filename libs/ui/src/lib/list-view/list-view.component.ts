import {
  Component,
  Input,
  AfterContentInit,
  ContentChildren,
  QueryList,
  EventEmitter,
  Output,
  Injectable
} from '@angular/core';
import { ListItemDirective } from './list-item/list-item.directive';

/**
 * Places an array of components in a Grid or List layout.
 *
 * @param {boolean} isGrid - (true) Show components in a grid or (false) in a list.
 * @param {boolean} multiSelect - Allow selection of multiple components.
 * @param {string} placeHolderText - Text to display when the contentArray is empty.
 *
 * @export
 * @class ListViewComponent
 */
@Component({
  selector: 'campus-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
@Injectable({
  providedIn: ListItemDirective
})
export class ListViewComponent implements AfterContentInit {
  @Input() listFormat = 'list';
  @Input() multiSelect = false;
  @Input() placeHolderText = 'Er zijn geen beschikbare items.';

  itemsAmount: number;
  itemSelectStyle = false;

  @ContentChildren(ListItemDirective) items: QueryList<ListItemDirective>;
  ngAfterContentInit() {
    this.items.forEach(item => {
      item.itemClicked.subscribe(() => this.itemClickHandler(item));
    });
    this.itemsAmount = this.items.length;
  }

  private itemClickHandler(item: ListItemDirective) {
    item.isSelected = !item.isSelected;
    if (!this.multiSelect) {
      this.items.filter(i => i !== item).forEach(j => (j.isSelected = false));
    } else {
      this.itemSelectStyle = this.items.some(i => i.isSelected);
    }
  }

  selectAllItems() {
    if (this.multiSelect) {
      this.items.forEach(i => (i.isSelected = true));
    }
  }
  deselectAllItems() {
    this.items.forEach(i => (i.isSelected = false));
  }

  //TODO: verwijderen
  setListFormat(form: string) {
    this.listFormat = form;
    console.log(form);
  }
}
