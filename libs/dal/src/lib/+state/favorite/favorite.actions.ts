import { Action } from '@ngrx/store';
import { FavoriteInterface } from '../../+models';

export enum FavoritesActionTypes {
  FavoritesLoaded = '[Favorites] Favorites Loaded',
  FavoritesLoadError = '[Favorites] Load Error',
  LoadFavorites = '[Favorites] Load Favorites',
  AddFavorite = '[Favorites] Add Favorite',
  AddFavorites = '[Favorites] Add Favorites',
  DeleteFavorite = '[Favorites] Delete Favorite',
  DeleteFavorites = '[Favorites] Delete Favorites',
  ClearFavorites = '[Favorites] Clear Favorites',
  ToggleFavorite = '[Favorites] Toggle Favorite'
}

export class LoadFavorites implements Action {
  readonly type = FavoritesActionTypes.LoadFavorites;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class FavoritesLoaded implements Action {
  readonly type = FavoritesActionTypes.FavoritesLoaded;

  constructor(public payload: { favorites: FavoriteInterface[] }) {}
}

export class FavoritesLoadError implements Action {
  readonly type = FavoritesActionTypes.FavoritesLoadError;
  constructor(public payload: any) {}
}

export class AddFavorite implements Action {
  readonly type = FavoritesActionTypes.AddFavorite;

  constructor(public payload: { favorite: FavoriteInterface }) {}
}
export class ToggleFavorite implements Action {
  readonly type = FavoritesActionTypes.ToggleFavorite;

  constructor(public payload: { favorite: FavoriteInterface }) {}
}

export class AddFavorites implements Action {
  readonly type = FavoritesActionTypes.AddFavorites;

  constructor(public payload: { favorites: FavoriteInterface[] }) {}
}
export class DeleteFavorite implements Action {
  readonly type = FavoritesActionTypes.DeleteFavorite;

  constructor(public payload: { id: number }) {}
}

export class DeleteFavorites implements Action {
  readonly type = FavoritesActionTypes.DeleteFavorites;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearFavorites implements Action {
  readonly type = FavoritesActionTypes.ClearFavorites;
}

export type FavoritesActions =
  | LoadFavorites
  | FavoritesLoaded
  | FavoritesLoadError
  | AddFavorite
  | AddFavorites
  | DeleteFavorite
  | DeleteFavorites
  | ClearFavorites
  | ToggleFavorite;
