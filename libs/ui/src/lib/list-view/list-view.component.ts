import {
  Component,
  Input,
  AfterContentInit,
  ContentChildren,
  QueryList
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
export class ListViewComponent implements AfterContentInit {
  @Input() listFormat: string;
  @Input() multiSelect = false;
  @Input() placeHolderText = 'Er zijn geen beschikbare items.';

  contentArray: ListItemDirective[] = [];
  itemsAmount: number;

  @ContentChildren(ListItemDirective) items: QueryList<ListItemDirective>;
  ngAfterContentInit() {
    this.items.forEach(i => {
      i.itemClicked.subscribe(event => {
        i.isSelected = !i.isSelected;
        console.log(i.isSelected);
      });
    });
    this.contentArray = this.items.toArray();
    this.itemsAmount = this.items.length;
  }

  //TODO: verwijderen
  setForm(form: string) {
    this.listFormat = form;
    console.log(form);
  }
}
