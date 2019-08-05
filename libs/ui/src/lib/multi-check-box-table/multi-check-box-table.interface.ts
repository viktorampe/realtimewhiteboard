export interface SubLevelInterface<SubLevelItemType, ItemType> {
  item: SubLevelItemType; // eduContentTOC
  label: keyof SubLevelItemType; // eduContentTOC title
  children: ItemInterface<ItemType>[];
}

export interface RowHeaderColumnInterface<ItemType> {
  caption: string; // literal header of column
  key: keyof ItemType; // property to show in column
}

export interface ItemColumnInterface<ItemColumnType> {
  item: ItemColumnType; // classGroup
  key: keyof ItemColumnType; // property to use in ItemInterface.content
  label: keyof ItemColumnType; // property to show in header
}

export interface ItemInterface<ItemType> {
  header: ItemType; // learningPlanGoal
  content: {
    [key: number]: boolean; // key = ItemColumnType.key, boolean = if checked
  };
}
