export interface SearchFilterCriteriaInterface {
  name: string;
  label: string;
  keyProperty: string;
  displayProperty: string;
  values: {
    data: any;
    selected?: boolean;
    prediction?: number;
    visible?: boolean;
    children?: any;
  }[];
}
