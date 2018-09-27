import {
  AfterContentInit,
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output
} from '@angular/core';
import { ListViewItemInterface } from '../base classes/list-view-item';
import { ListViewComponent } from '../list-view.component';

/**
 * Decorator for components in campus-list-view
 * Handles selection, passes format to component with Css class.
 *
 * @export
 * @class ListItemDirective
 */
@Directive({
  selector: '[campusListItem]'
})
export class ListItemDirective implements AfterContentInit {
  isSelected: boolean;
  @Output() itemSelectionChanged = new EventEmitter<ListItemDirective>();

  @HostBinding('class.ui-list-view__list__item--selected')
  get isSelectedClass() {
    return this.isSelected;
  }

  @HostBinding('class.ui-list-view__list__item--grid')
  get isGridClass() {
    return this.parentList.listFormat === 'grid';
  }

  @HostBinding('class.ui-list-view__list__item--line')
  get isListClass() {
    return this.parentList.listFormat === 'line';
  }

  @HostBinding('class.ui-list-view__list__item__selectoverlay')
  get isMultiSelectableClass() {
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

  ngAfterContentInit() {
    this.host.listFormat = this.parentList.listFormat;
  }
}
