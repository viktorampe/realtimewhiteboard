import {
  AfterContentInit,
  Component,
  ContentChildren,
  Directive,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ListFormat } from './enums/list-format.enum';
import { ListViewItemInterface } from './interfaces/list-view-item';
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
export class ListViewComponent<dataObjectType>
  implements AfterContentInit, OnDestroy, OnChanges {
  /**
   * (boolean) - When multiselecting, add a css class to style the selectable items
   *
   * @memberof ListViewComponent
   */
  useItemSelectableOverlayStyle$ = new BehaviorSubject(false);

  private itemsSubscription = new Subscription();

  @Input() listFormat: ListFormat;
  @Input() multiSelect = false;
  @Input() placeHolderText = 'Er zijn geen beschikbare items.';

  @Output() selectedItems$ = new BehaviorSubject<dataObjectType[]>([]);
  @Output() listFormat$ = new BehaviorSubject(this.listFormat);

  // tslint:disable-next-line
  @ContentChildren(forwardRef(() => ListViewItemDirective))
  items: QueryList<ListViewItemDirective<dataObjectType>>;

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
  }

  protected onItemSelectionChanged(
    item: ListViewItemDirective<dataObjectType>
  ) {
    if (!this.multiSelect) {
      if (item.isSelected) {
        this.items.filter(i => i !== item).forEach(j => (j.isSelected = false));
      }
    } else {
      this.useItemSelectableOverlayStyle$.next(
        this.items.some(i => i.isSelected)
      );
    }

    this.selectedItems$.next(
      this.items
        .filter(i => i.isSelected)
        .map((i): dataObjectType => i.dataObject)
    );
  }

  selectAllItems() {
    if (this.multiSelect) {
      this.items.forEach(i => (i.isSelected = true));
    }
  }
  deselectAllItems() {
    this.items.forEach(i => (i.isSelected = false));
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

/**
 * Decorator for components in campus-list-view
 * Handles selection, passes format to component.
 *
 * @export
 * @class ListViewItemDirective
 */
@Directive({
  selector: '[campusListItem], [campus-list-item]'
})
export class ListViewItemDirective<dataObjectType>
  implements AfterContentInit, OnDestroy {
  private _isSelected = false;
  public get isSelected(): boolean {
    return this._isSelected;
  }

  public set isSelected(value: boolean) {
    if (value !== this._isSelected) {
      this._isSelected = value;
      this.itemSelectionChanged.emit(this);
    }
  }

  private subscriptions = new Subscription();

  @Input() dataObject: dataObjectType;
  @Input() selectable = true;

  @Output()
  itemSelectionChanged = new EventEmitter<
    ListViewItemDirective<dataObjectType>
  >();

  @HostBinding('class.ui-list-view__list__item--selected')
  get isSelectedClass() {
    return this.isSelected;
  }

  @HostBinding('class.ui-list-view__list__item')
  get isListItemClass() {
    return true;
  }

  @HostBinding('class.ui-list-view__list__item__selectoverlay')
  get useItemSelectableOverlayClass() {
    return this.parentList.useItemSelectableOverlayStyle$.value;
  }

  @HostBinding('class.ui-list-view__list__item--notselectable')
  get isNotSelectableClass() {
    return !this.selectable;
  }

  @HostListener('click')
  clickEvent() {
    if (this.selectable) {
      this.isSelected = !this.isSelected;
    }
  }

  constructor(
    private parentList: ListViewComponent<dataObjectType>,
    public host: ListViewItemInterface
  ) {}

  ngAfterContentInit() {
    this.subscriptions.add(
      this.parentList.listFormat$.subscribe(lf => (this.host.listFormat = lf))
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
