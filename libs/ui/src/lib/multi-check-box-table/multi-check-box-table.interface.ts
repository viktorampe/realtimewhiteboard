import { MatCheckbox } from '@angular/material';
import { PrimitivePropertiesKeys } from '@campus/utils';

export interface MultiCheckBoxTableSubLevelInterface<
  SubLevelItemType,
  ItemType
> {
  item: SubLevelItemType; // eduContentTOC
  label: PrimitivePropertiesKeys<SubLevelItemType>; // eduContentTOC title
  children: MultiCheckBoxTableItemInterface<ItemType>[];
}

export interface MultiCheckBoxTableRowHeaderColumnInterface<ItemType> {
  caption: string; // literal header of column
  key: PrimitivePropertiesKeys<ItemType>; // property to show in column
}

export interface MultiCheckBoxTableItemColumnInterface<ItemColumnType> {
  item: ItemColumnType; // classGroup
  key: PrimitivePropertiesKeys<ItemColumnType>; // property to use in ItemInterface.content
  label: PrimitivePropertiesKeys<ItemColumnType>; // property to show in header
}

export interface MultiCheckBoxTableItemInterface<ItemType> {
  header: ItemType; // learningPlanGoal
  content: {
    [key: number]: boolean; // key = ItemColumnType.key, boolean = if checked
  };
}

export interface MultiCheckBoxTableChangeEventInterface<
  ItemType,
  ItemColumnType,
  SubLevelItemType
> {
  column: ItemColumnType;
  item: ItemType;
  subLevel: SubLevelItemType;
  checkBox?: MatCheckbox;
}
