export interface SearchStateInterface {
  searchTerm: string;
  filterCriteriaSelections: Map<string, number[] | string[]>;
  from?: number;
  sort?: string;
}
