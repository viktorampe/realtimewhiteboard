import { Observable } from 'rxjs';
import { SearchModeInterface } from './search-mode-interface';
import { SearchResultInterface } from './search-result-interface';
import { SearchStateInterface } from './search-state.interface';

export interface SearcherInterface {
  searchResults$: Observable<SearchResultInterface>;
  searchState$: Observable<SearchStateInterface>;

  requestAutoComplete?(searchTerm: string): Observable<string[]>;
  getInitialSearchState(): Observable<SearchStateInterface>;
  getSearchMode(mode: string): Observable<SearchModeInterface>;
  updateSearchState(state: SearchStateInterface);
}
