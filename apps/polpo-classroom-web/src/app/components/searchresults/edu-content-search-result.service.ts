import { Injectable } from '@angular/core';
import {
  DalState,
  FavoriteActions,
  FavoriteInterface,
  FavoriteQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EduContentSearchResultItemService {
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
}
