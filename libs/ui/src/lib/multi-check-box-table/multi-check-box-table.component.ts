import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';
import {
  CheckBoxChangeInterface,
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
    CheckBoxChangeInterface
  >();

  @Output() public checkBoxesChanged = new EventEmitter<
    CheckBoxChangeInterface[]
  >();

  @HostBinding('class.ui-multi-check-box-table')
  isMultiCheckBoxTable = true;

  public clickSelectAllForSubLevel(
    subLevel: { children: { header: unknown[] }[]; item: unknown }, // { children: {header: lpg }[]}, item: toc ...}
    itemHeader: { item: unknown } //{ item: classgroup ...}
  ) {
    this.checkBoxesChanged.emit(
      subLevel.children.map(child => ({
        column: itemHeader.item,
        item: child.header,
        subLevel: subLevel.item
      }))
    );
  }

  public clickCheckbox(
    item: ItemType, // lpg
    column: ItemColumnType, // classgroup
    subLevel: SubLevelItemType // toc
  ) {
    this.checkBoxChanged.emit({ column, item, subLevel });
  }
}
