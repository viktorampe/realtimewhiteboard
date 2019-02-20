export interface SearchResultInterface<T> {
  count: number;
  results: T[];
  filterCriteriaPredictions: Map<string, Map<string | number, number>>;
}

export interface SearchResultItemInterface {
  data: any;
}

export interface SortInterface {
  order: 'asc' | 'desc';
  name: string;
  priority: number;
}
