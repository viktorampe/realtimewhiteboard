import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';
import { MatCheckbox } from '@angular/material';
import {
  MultiCheckBoxTableChangeEventInterface,
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
  private topLevelSelectedItemsMap = {};

  @Input() selectAllTopLevel = false;

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
    MultiCheckBoxTableChangeEventInterface<
      ItemType,
      ItemColumnType,
      SubLevelItemType
    >
  >();

  @Output() public checkBoxesChanged = new EventEmitter<
    MultiCheckBoxTableChangeEventInterface<
      ItemType,
      ItemColumnType,
      SubLevelItemType
    >[]
  >();

  @Output() public topLevelCheckBoxToggled = new EventEmitter<{
    itemColumn: ItemColumnType;
    selectedValues: number[];
  }>();

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

  public clickSelectAllForTopLevel(
    itemHeader: MultiCheckBoxTableItemColumnInterface<ItemColumnType>,
    checkBox: MatCheckbox
  ) {
    // selected or not?
    this.topLevelSelectedItemsMap[itemHeader.item.id] = !checkBox.checked;

    // pass column item as output
    if (this.topLevelSelectedItemsMap[itemHeader.item.id]) {
      // all selected
      this.topLevelCheckBoxToggled.emit({
        itemColumn: itemHeader.item,
        selectedValues: this.items.map(item => item.header.id)
      });
    } else {
      // all deselected
      this.topLevelCheckBoxToggled.emit({
        itemColumn: itemHeader.item,
        selectedValues: []
      });
    }
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
      previousCheckboxState: checkBox.checked
    });
  }

  public isDisabled(itemColumn: ItemColumnType) {
    return this.topLevelSelectedItemsMap[itemColumn.item.id];
  }
}
