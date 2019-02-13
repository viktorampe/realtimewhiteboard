export interface SearchResultInterface<T> {
  count: number;
  results: T[];
  filterCriteriaPredictions: Map<string, Map<string | number, number>>;
}
