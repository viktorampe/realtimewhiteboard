import {
  AfterContentInit,
  Component,
  ContentChildren,
  forwardRef,
  Injectable,
  Input,
  Output,
  QueryList
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
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
  itemSelectableStyle = false;

  private subscription = new Subscription();

  @Input() listFormat = 'list';
  @Input() multiSelect = false;
  @Input() placeHolderText = 'Er zijn geen beschikbare items.';

  @Output() selectedItems = new BehaviorSubject([]);

  @ContentChildren(forwardRef(() => ListItemDirective))
  items: QueryList<ListItemDirective>;

  ngAfterContentInit() {
    this.items.forEach(item => {
      this.subscription.add(
        item.itemSelectionChanged.subscribe(changedItem =>
          this.onItemSelectionChanged(changedItem)
        )
      );
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private onItemSelectionChanged(item: ListItemDirective) {
    if (!this.multiSelect) {
      this.items.filter(i => i !== item).forEach(j => (j.isSelected = false));
    } else {
      this.itemSelectableStyle = this.items.some(i => i.isSelected);
    }

    const selectedItemsArray = this.items.filter(i => i.isSelected);
    this.selectedItems.next(selectedItemsArray);
  }

  selectAllItems() {
    if (this.multiSelect) {
      this.items.forEach(i => (i.isSelected = true));
      this.itemSelectableStyle = true;
    }
  }
  deselectAllItems() {
    this.items.forEach(i => (i.isSelected = false));
    this.itemSelectableStyle = false;
  }

  //TODO: verwijderen
  setListFormat(form: string) {
    this.listFormat = form;
  }
}
