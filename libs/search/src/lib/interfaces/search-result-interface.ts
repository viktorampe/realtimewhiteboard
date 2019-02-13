export interface SearchResultsInterface<T> {
  count: number;
  results: T[];
  filterCriteriaPredictions: Map<string, Map<string | number, number>>;
}
