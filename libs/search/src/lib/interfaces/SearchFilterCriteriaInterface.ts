export interface SearchFilterCriteriaInterface<T, K = {}> {
  name: string;
  label: string;
  keyProperty: keyof T; //update use PrimitivePropertiesKeys here
  displayProperty: keyof T; //update: use PrimitivePropertiesKeys here
  values: {
    data: T;
    selected?: boolean;
    prediction?: number;
    visible?: boolean;
    children?: SearchFilterCriteriaInterface<K>;
  }[];
}
