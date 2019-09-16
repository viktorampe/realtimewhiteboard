export interface SearchResultInterface {
  count: number;
  results: any[];
  filterCriteriaPredictions: Map<string, Map<string | number, number>>;
}
