import {
  Input,
  EventEmitter,
  Output,
  Directive,
  HostBinding,
  HostListener
} from '@angular/core';

/**
 * Placeholder child component
 * TODO: remove
 *
 * @export
 * @class ListItemComponent
 */
@Directive({
  selector: '[campus-list-item]'
})
export class ListItemDirective {
  @Input('campus-list-item') elementForm: 'grid' | 'list';

  isSelected: boolean;

  @Output() itemClicked = new EventEmitter<ListItemDirective>();

  @HostBinding('class.item-selected')
  get isSelectedClass() {
    return this.isSelected;
  }

  @HostBinding('class.flex-grid-item')
  get isGridClass() {
    return this.elementForm === 'grid';
  }

  @HostBinding('class.flex-list-item')
  get isListClass() {
    return this.elementForm === 'list';
  }

  @HostListener('click')
  clickEvent() {
    this.itemClicked.emit(this);
  }
}
