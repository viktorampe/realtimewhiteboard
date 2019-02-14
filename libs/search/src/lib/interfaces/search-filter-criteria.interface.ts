import { KeyWithPropertyType } from './key-with-property-type.type';

export interface SearchFilterCriteriaInterface<T, K> {
  name: string;
  label: string;
  keyProperty: KeyWithPropertyType<T, string | number>;
  displayProperty: KeyWithPropertyType<T, string>;
  values: {
    data: T;
    selected?: boolean;
    prediction?: number;
    visible?: boolean;
    children?: SearchFilterCriteriaInterface<K, unknown>;
  }[];
}
