import { KeyWithPropertyType } from './key-with-property-type.type';

export interface SearchStateInterface<T> {
  searchTerm: string;
  filterCriteriaSelections: Map<
    KeyWithPropertyType<T, string>,
    KeyWithPropertyType<T, string | number>[]
  >;
  from?: number;
  sort?: string;
}
