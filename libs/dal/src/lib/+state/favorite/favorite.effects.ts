import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { DalState } from '..';
import {
  FavoritesActionTypes,
  FavoritesLoadError,
  LoadFavorites
} from './favorite.actions';

@Injectable()
export class FavoriteEffects {
  @Effect()
  loadFavorites$ = this.dataPersistence.fetch(
    FavoritesActionTypes.LoadFavorites,
    {
      run: (action: LoadFavorites, state: DalState) => {
        if (!action.payload.force && state.favorites.loaded) return;
        // TODO: uncomment when favoriteService exists
        // return this.favoriteService
        //   .getAllForUser(action.payload.userId)
        //   .pipe(map(favorites => new FavoritesLoaded({ favorites })));
      },
      onError: (action: LoadFavorites, error) => {
        return new FavoritesLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState> // @Inject(FAVORITE_SERVICE_TOKEN)
  ) // private favoriteService: FavoriteServiceInterface
  {}
}
