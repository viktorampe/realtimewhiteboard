import {
  Directive,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Output
} from '@angular/core';
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
export class ListItemDirective {
  isSelected: boolean;
  @Output() itemSelectionChanged = new EventEmitter<ListItemDirective>();

  @HostBinding('class.item--selected')
  get isSelectedClass() {
    return this.isSelected;
  }

  @HostBinding('class.flex-item--grid')
  get isGridClass() {
    return this.parentList.listFormat === 'grid';
  }

  @HostBinding('class.flex-item--line')
  get isListClass() {
    return this.parentList.listFormat === 'line';
  }

  @HostBinding('class.item__selectoverlay')
  get isMultiSelectableClass() {
    return this.parentList.useItemSelectableOverlayStyle === true;
  }

  @HostListener('click')
  clickEvent() {
    this.isSelected = !this.isSelected;
    this.itemSelectionChanged.emit(this);
  }

  constructor(
    @Inject(forwardRef(() => ListViewComponent))
    private parentList
  ) {}
}
