import {
  AfterContentInit,
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output
} from '@angular/core';
import { ListViewItemInterface } from '../interfaces/list-view-item';
import { ListViewComponent } from '../list-view.component';

/**
 * Decorator for components in campus-list-view
 * Handles selection, passes format to component with Css class.
 *
 * @export
 * @class ListViewItemDirective
 */
@Directive({
  selector: '[campusListItem],[campus-list-item]'
})
export class ListViewItemDirective implements AfterContentInit {
  isSelected: boolean;
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
    return this.parentList.useItemSelectableOverlayStyle === true;
  }

  @HostListener('click')
  clickEvent() {
    this.isSelected = !this.isSelected;
    this.itemSelectionChanged.emit(this);
  }

  constructor(
    private parentList: ListViewComponent,
    private host: ListViewItemInterface
  ) {}

  /**
   * Sets properties on host Component after it has been projected.
   *
   * @memberof ListViewItemDirective
   */
  ngAfterContentInit() {
    this.host.listFormat = this.parentList.listFormat;
  }
}
