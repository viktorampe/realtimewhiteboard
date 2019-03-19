export interface SearchFilterCriteriaInterface {
  name: string;
  label: string;
  keyProperty: string;
  displayProperty: string;
  values: SearchFilterCriteriaValuesInterface[];
}

export interface SearchFilterCriteriaValuesInterface {
  data: any;
  selected?: boolean;
  prediction?: number;
  visible?: boolean;
  child?: SearchFilterCriteriaInterface;
  hasChild?: boolean;
}
