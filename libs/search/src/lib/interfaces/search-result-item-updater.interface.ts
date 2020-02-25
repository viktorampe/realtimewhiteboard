import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const SEARCH_RESULT_ITEM_UPDATER_TOKEN = new InjectionToken(
  'searchResultItemUpdater'
);

export interface SearchResultItemUpdaterInterface {
  updatedEduContentIds$: Observable<number[]>;
  updateSearchResultItem(searchResult): void;
}
