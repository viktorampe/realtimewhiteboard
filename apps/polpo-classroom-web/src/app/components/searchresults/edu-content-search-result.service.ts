import { Injectable } from '@angular/core';
import {
  DalState,
  EduContentActions,
  EduContentInterface,
  FavoriteActions,
  FavoriteInterface,
  FavoriteQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EduContentSearchResultItemServiceInterface } from './edu-content-search-result.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EduContentSearchResultItemService
  implements EduContentSearchResultItemServiceInterface {
  constructor(private store: Store<DalState>) {}

  isFavorite$(eduContentId: number): Observable<boolean> {
    return this.store.pipe(
      select(FavoriteQueries.getIsFavoriteEduContent, {
        eduContentId
      })
    );
  }

  toggleFavorite(favorite: FavoriteInterface): void {
    this.store.dispatch(new FavoriteActions.ToggleFavorite({ favorite }));
  }

  upsertEduContentToStore(eduContent: EduContentInterface): void {
    this.store.dispatch(
      new EduContentActions.UpsertEduContent({
        eduContent
      })
    );
  }
}
