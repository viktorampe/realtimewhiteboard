export interface MultiCheckBoxTableSubLevelInterface<
  SubLevelItemType,
  ItemType
> {
  item: SubLevelItemType; // eduContentTOC
  label: keyof SubLevelItemType; // eduContentTOC title
  children: MultiCheckBoxTableItemInterface<ItemType>[];
}

export interface MultiCheckBoxTableRowHeaderColumnInterface<ItemType> {
  caption: string; // literal header of column
  key: keyof ItemType; // property to show in column
}

export interface MultiCheckBoxTableItemColumnInterface<ItemColumnType> {
  item: ItemColumnType; // classGroup
  key: keyof ItemColumnType; // property to use in ItemInterface.content
  label: keyof ItemColumnType; // property to show in header
}

export interface MultiCheckBoxTableItemInterface<ItemType> {
  header: ItemType; // learningPlanGoal
  content: {
    [key: number]: boolean; // key = ItemColumnType.key, boolean = if checked
  };
}

export interface CheckBoxChangeInterface {
  column: unknown;
  item: unknown;
  subLevel: unknown;
}
