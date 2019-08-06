import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import {
  MultiCheckBoxTableItemColumnInterface,
  MultiCheckBoxTableItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface,
  MultiCheckBoxTableSubLevelInterface
} from './multi-check-box-table.interface';

export {
  MultiCheckBoxTableItemColumnInterface as ItemColumnInterface,
  MultiCheckBoxTableItemInterface as ItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface as RowHeaderColumnInterface,
  MultiCheckBoxTableSubLevelInterface as SubLevelInterface
};

@Component({
  selector: 'campus-multi-check-box-table',
  templateUrl: './multi-check-box-table.component.html',
  styleUrls: ['./multi-check-box-table.component.scss']
})
export class MultiCheckBoxTableComponent<
  SubLevelItemType,
  ItemType,
  ItemColumnType
> {
  // Pay some attention to the interfaces of the inputs
  // There is some overlap in the generic types

  // Only use either subLevels or items
  @Input() public subLevels: MultiCheckBoxTableSubLevelInterface<
    SubLevelItemType,
    ItemType
  >[] = [];
  @Input() public items: MultiCheckBoxTableItemInterface<ItemType>[] = [];

  @Input() public rowHeaderColumns: MultiCheckBoxTableRowHeaderColumnInterface<
    ItemType
  >[] = [];
  @Input() public itemColumns: MultiCheckBoxTableItemColumnInterface<
    ItemColumnType
  >[] = [];

  @Output() public checkBoxChanged = new EventEmitter<{
    column: ItemColumnType;
    item: ItemType;
    subLevel: SubLevelItemType;
    value: boolean;
  }>();

  @HostBinding('class.ui-multi-check-box-table')
  get isMultiCheckBoxTable() {
    return true;
  }

  public selectAllForSubLevel(subLevel, itemHeader) {}

  public clickCheckbox(
    item: ItemType,
    column: ItemColumnType,
    subLevel: SubLevelItemType,
    event: MatCheckboxChange
  ) {
    this.checkBoxChanged.emit({ column, item, subLevel, value: event.checked });
  }
}
