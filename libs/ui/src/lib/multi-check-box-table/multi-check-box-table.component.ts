import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';
import { MatCheckbox } from '@angular/material';
import {
  MultiCheckBoxTableColumnChangeEventInterface,
  MultiCheckBoxTableItemChangeEventInterface,
  MultiCheckBoxTableItemColumnInterface,
  MultiCheckBoxTableItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface,
  MultiCheckBoxTableSubLevelInterface
} from './multi-check-box-table.interface';

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
  @Input() public selectAllForColumnEnabled = false;

  // Pay some attention to the interfaces of the inputs
  // There is some overlap in the generic types
  // Only use either subLevels or items
  @Input() public subLevels: MultiCheckBoxTableSubLevelInterface<
    SubLevelItemType,
    ItemType
  >[];

  @Input() public items: MultiCheckBoxTableItemInterface<ItemType>[];

  @Input() public rowHeaderColumns: MultiCheckBoxTableRowHeaderColumnInterface<
    ItemType
  >[];
  @Input() public itemColumns: MultiCheckBoxTableItemColumnInterface<
    ItemColumnType
  >[];

  @Output() public checkBoxChanged = new EventEmitter<
    MultiCheckBoxTableItemChangeEventInterface<
      ItemType,
      ItemColumnType,
      SubLevelItemType
    >
  >();

  @Output() public checkBoxesChanged = new EventEmitter<
    MultiCheckBoxTableItemChangeEventInterface<
      ItemType,
      ItemColumnType,
      SubLevelItemType
    >[]
  >();

  @Output() public selectAllForColumnChanged = new EventEmitter<
    MultiCheckBoxTableColumnChangeEventInterface<ItemColumnType>
  >();

  @HostBinding('class.ui-multi-check-box-table')
  isMultiCheckBoxTable = true;

  public clickSelectAllForSubLevel(
    subLevel: MultiCheckBoxTableSubLevelInterface<SubLevelItemType, ItemType>,
    itemHeader: MultiCheckBoxTableItemColumnInterface<ItemColumnType>
  ) {
    this.checkBoxesChanged.emit(
      subLevel.children.map(child => ({
        column: itemHeader.item,
        item: child.header,
        subLevel: subLevel.item
      }))
    );
  }

  public clickSelectAllForColumn(
    itemColumn: MultiCheckBoxTableItemColumnInterface<ItemColumnType>,
    checkBox: MatCheckbox
  ) {
    // emit event: for this column item, all row items are selected/deselected
    this.selectAllForColumnChanged.emit({
      itemColumn: itemColumn.item,
      isChecked: !checkBox.checked
    });
  }

  public clickCheckbox(
    item: ItemType,
    column: ItemColumnType,
    subLevel: SubLevelItemType,
    checkBox: MatCheckbox
  ) {
    this.checkBoxChanged.emit({
      column,
      item,
      subLevel,
      isChecked: !checkBox.checked
    });
  }
}
