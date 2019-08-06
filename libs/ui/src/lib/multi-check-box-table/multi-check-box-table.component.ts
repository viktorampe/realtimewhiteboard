import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import {
  ItemColumnInterface,
  ItemInterface,
  RowHeaderColumnInterface,
  SubLevelInterface
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
  @Input() public subLevels: SubLevelInterface<
    SubLevelItemType,
    ItemType
  >[] = [];
  @Input() public items: ItemInterface<ItemType>[] = [];

  @Input() public rowHeaderColumns: RowHeaderColumnInterface<ItemType>[] = [];
  @Input() public itemColumns: ItemColumnInterface<ItemColumnType>[] = [];

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
