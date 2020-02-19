import { Observable, of } from 'rxjs';
import {
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '../interfaces';

export class EmptyFilterFactory implements SearchFilterFactory {
  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    return of([]);
  }

  getPredictionFilterNames(searchState: SearchStateInterface): string[] {
    return [];
  }
}
