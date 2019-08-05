import { Component, Input, OnInit } from '@angular/core';
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
> implements OnInit {
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

  constructor() {}

  ngOnInit() {}

  public selectAllForSubLevel(subLevel, itemHeader) {
    console.log('log: selectAllForSubLevel -> subLevel', subLevel);
    console.log('log: selectAllForSubLevel -> itemHeader', itemHeader);
  }

  public clickCheckBox(item, column) {
    console.log('log: clickCheckBox -> item', item);
    console.log('log: clickCheckBox -> column', column);
  }
}
