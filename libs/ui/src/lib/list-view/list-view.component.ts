import {
  AfterContentInit,
  Component,
  ContentChildren,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges
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
export class ListViewComponent
  implements AfterContentInit, OnDestroy, OnChanges {
  /**
   * (boolean) - When multiselecting, add a css class to style the selectable items
   *
   * @memberof ListViewComponent
   */
  useItemSelectableOverlayStyle = false;

  private itemsSubscription = new Subscription();
  private formatSubscription = new Subscription();

  @Input() listFormat: ListFormat;
  @Input() multiSelect = false;
  @Input() placeHolderText = 'Er zijn geen beschikbare items.';

  @Output() selectedItems$ = new BehaviorSubject([]);
  @Output() listFormat$ = new BehaviorSubject(this.listFormat);

  @ContentChildren(forwardRef(() => ListViewItemDirective))
  items: QueryList<ListViewItemDirective>;

  ngAfterContentInit() {
    this.setupSelectionSubscriptionsForListItems();

    // nieuwe subscription als items veranderen
    this.items.changes.subscribe(() => {
      this.setupSelectionSubscriptionsForListItems();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.listFormat) {
      this.listFormat$.next(this.listFormat);
    }
  }

  ngOnDestroy() {
    this.itemsSubscription.unsubscribe();
    this.formatSubscription.unsubscribe();
  }

  protected onItemSelectionChanged(item: ListViewItemDirective) {
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
      const selectedItemsArray = this.items.toArray();
      this.selectedItems$.next(selectedItemsArray);
    }
  }
  deselectAllItems() {
    this.items.forEach(i => (i.isSelected = false));
    this.useItemSelectableOverlayStyle = false;
    const selectedItemsArray = this.items.filter(i => i.isSelected);
    this.selectedItems$.next(selectedItemsArray);
  }

  private setupSelectionSubscriptionsForListItems() {
    if (this.itemsSubscription !== null) {
      this.itemsSubscription.unsubscribe();
    }
    this.itemsSubscription = new Subscription();

    this.items.forEach(item => {
      this.itemsSubscription.add(
        item.itemSelectionChanged.subscribe(changedItem =>
          this.onItemSelectionChanged(changedItem)
        )
      );
    });
  }
}
