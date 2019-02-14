export interface SearchFilter {
  criteria:
    | SearchFilterCriteriaInterface<unknown>
    | SearchFilterCriteriaInterface<unknown>[];
  component: SearchFilterComponentInterface;
  domHost: string;
  options?: any;
}

export interface SearchFilterFactory {
  getFilters(SearchStateInterface: FilterCriteria[]): SearchFilter[];
}
