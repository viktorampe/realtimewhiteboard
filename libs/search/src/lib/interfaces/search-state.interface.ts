export interface SearchStateInterface {
  searchTerm: string;
  filterCriteriaSelections: Map<string, (number | string)[]>;
  filterCriteriaOptions?: Map<string, number | string | boolean>;
  from?: number;
  sort?: string;
}
