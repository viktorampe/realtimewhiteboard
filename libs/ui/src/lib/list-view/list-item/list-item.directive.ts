import { ListViewComponent } from './../list-view.component';
import {
  EventEmitter,
  Output,
  Directive,
  HostBinding,
  HostListener,
  forwardRef,
  Inject
} from '@angular/core';

/**
 * @export
 * @class ListItemDirective
 */
@Directive({
  selector: '[campus-list-item]'
})
export class ListItemDirective {
  isSelected: boolean;
  parentList: ListViewComponent;
  @Output() itemClicked = new EventEmitter<ListItemDirective>();

  @HostBinding('class.item-selected')
  get isSelectedClass() {
    return this.isSelected;
  }

  @HostBinding('class.flex-grid-item')
  get isGridClass() {
    return this.parentList.listFormat === 'grid';
  }

  @HostBinding('class.flex-list-item')
  get isListClass() {
    return this.parentList.listFormat === 'list';
  }

  @HostBinding('class.item-selectoverlay')
  get isMultiSelectableClass() {
    return this.parentList.itemSelectStyle === true;
  }

  @HostListener('click')
  clickEvent() {
    this.itemClicked.emit(this);
  }

  constructor(
    @Inject(forwardRef(() => ListViewComponent))
    parentList
  ) {
    this.parentList = parentList;
  }
}
