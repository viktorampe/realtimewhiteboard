import { Component } from '@angular/core';

export interface SearchResultInterface<T> {
  count: number;
  results: T[];
  filterCriteriaPredictions: Map<string, Map<string | number, number>>;
}

export interface SearchResultItemComponentInterface extends Component {
  data: any;
}
