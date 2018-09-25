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
 *
 * @export
 * @class ListItemDirective
 */
@Directive({
  selector: '[campusListItem], [campus-list-item]'
})
export class ListItemDirective {
  isSelected: boolean;
  @Output() itemSelectionChanged = new EventEmitter<ListItemDirective>();

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
    return this.parentList.itemSelectableStyle === true;
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
