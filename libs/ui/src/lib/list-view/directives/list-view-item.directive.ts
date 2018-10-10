import {
  AfterContentInit,
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ListViewItemInterface } from '../interfaces/list-view-item';
import { ListViewComponent } from '../list-view.component';

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
export class ListViewItemDirective implements AfterContentInit, OnDestroy {
  isSelected: boolean;
  private subscriptions = new Subscription();

  @Input() dataObject: object;

  @Output() itemSelectionChanged = new EventEmitter<ListViewItemDirective>();

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
    return this.parentList.useItemSelectableOverlayStyle;
  }

  @HostListener('click')
  clickEvent() {
    this.isSelected = !this.isSelected;
    this.itemSelectionChanged.emit(this);
  }

  constructor(
    private parentList: ListViewComponent,
    public host: ListViewItemInterface
  ) {}

  ngAfterContentInit() {
    this.subscriptions.add(
      this.parentList.listFormat$.subscribe(x => (this.host.listFormat = x))
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
