export interface SearchStateInterface<T> {
  searchTerm: string;
  filterCriteriaSelections: Map<string, number[] | string[]>;
  from?: number;
  sort?: string;
}
