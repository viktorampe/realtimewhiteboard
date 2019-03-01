import { Component } from '@angular/core';

export interface SearchResultInterface {
  count: number;
  results: any[];
  filterCriteriaPredictions: Map<string, Map<string | number, number>>;
}

export interface SearchResultItemComponentInterface extends Component {
  data: any;
  listRef: any;
}
