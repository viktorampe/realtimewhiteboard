import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { FavoriteServiceInterface, FAVORITE_SERVICE_TOKEN } from '../../favorite/favorite.service.interface';
import {
  FavoritesActionTypes,
  FavoritesLoadError,
  LoadFavorites,
  FavoritesLoaded
} from './favorite.actions';
import { DalState } from '..';

@Injectable()
export class FavoriteEffects {
  @Effect()
  loadFavorites$ = this.dataPersistence.fetch(
    FavoritesActionTypes.LoadFavorites,
    {
      run: (action: LoadFavorites, state: DalState) => {
        if (!action.payload.force && state.favorites.loaded) return;
        return this.favoriteService
          .getAllForUser(action.payload.userId)
          .pipe(map(favorites => new FavoritesLoaded({ favorites })));
      },
      onError: (action: LoadFavorites, error) => {
        return new FavoritesLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(FAVORITE_SERVICE_TOKEN)
    private favoriteService: FavoriteServiceInterface
  ) {}
}
