import {
  AfterContentInit,
  Component,
  ContentChildren,
  forwardRef,
  Input,
  Output,
  QueryList
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ListViewItemDirective } from './directives/list-view-item.directive';
import { ListFormat } from './enums/list-format.enum';

/**
 * Places decorated components in a Grid or List layout.
 * List items need to be decorated with the campusListItem attribute.
 *
 * @param {string} listFormat - Show components in a grid or in a line.
 * @param {boolean} multiSelect - Allow selection of multiple components.
 * @param {string} placeHolderText - Text to display when the list is empty.
 *
 * @emits {BehaviorSubject} - A stream of the currently selected items.
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
  /**
   * (boolean) - When multiselecting, add a css class to style the selectable items
   *
   * @memberof ListViewComponent
   */
  useItemSelectableOverlayStyle = false;

  private subscription = new Subscription();

  @Input() listFormat: ListFormat;
  @Input() multiSelect = false;
  @Input() placeHolderText = 'Er zijn geen beschikbare items.';

  @Output() selectedItems$ = new BehaviorSubject([]);

  @ContentChildren(forwardRef(() => ListViewItemDirective))
  items: QueryList<ListViewItemDirective>;

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

  private onItemSelectionChanged(item: ListViewItemDirective) {
    if (!this.multiSelect) {
      this.items.filter(i => i !== item).forEach(j => (j.isSelected = false));
    } else {
      this.useItemSelectableOverlayStyle = this.items.some(i => i.isSelected);
    }

    const selectedItemsArray = this.items.filter(i => i.isSelected);
    this.selectedItems$.next(selectedItemsArray);
  }

  selectAllItems() {
    if (this.multiSelect) {
      this.items.forEach(i => (i.isSelected = true));
      this.useItemSelectableOverlayStyle = true;
    }
  }
  deselectAllItems() {
    this.items.forEach(i => (i.isSelected = false));
    this.useItemSelectableOverlayStyle = false;
  }
}
