import { InjectionToken } from '@angular/core';
import { FavoriteInterface } from '@campus/dal';
import { Observable } from 'rxjs';

export const EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN = new InjectionToken(
  'EduContentSearchResultItemService'
);

export interface EduContentSearchResultItemServiceInterface {
  isFavorite$(eduContentId: number): Observable<boolean>;

  toggleFavorite(favorite: FavoriteInterface): void;
}
