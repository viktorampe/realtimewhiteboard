import {
  AfterContentInit,
  Component,
  ContentChildren,
  forwardRef,
  Injectable,
  Input,
  QueryList
} from '@angular/core';
import { ListItemDirective } from './directives/list-view-item.directive';

/**
 * Places decorated components in a Grid or List layout.
 * List items need to be decorated with the campusListItem attribute.
 *
 * @param {boolean} listFormat - Show components in a grid or in a list.
 * @param {boolean} multiSelect - Allow selection of multiple components.
 * @param {string} placeHolderText - Text to display when the list is empty.
 *
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

  @ContentChildren(forwardRef(() => ListItemDirective))
  items: QueryList<ListItemDirective>;
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
      this.itemSelectStyle = true;
    }
  }
  deselectAllItems() {
    this.items.forEach(i => (i.isSelected = false));
    this.itemSelectStyle = false;
  }

  //TODO: verwijderen
  setListFormat(form: string) {
    this.listFormat = form;
  }
}
