import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { FavoriteInterface } from '../../+models';
import { FavoritesActions, FavoritesActionTypes } from './favorite.actions';

export const NAME = 'favorites';

export interface State extends EntityState<FavoriteInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<FavoriteInterface> = createEntityAdapter<
  FavoriteInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(state = initialState, action: FavoritesActions): State {
  switch (action.type) {
    case FavoritesActionTypes.AddFavorite: {
      return adapter.addOne(action.payload.favorite, state);
    }

    case FavoritesActionTypes.AddFavorites: {
      return adapter.addMany(action.payload.favorites, state);
    }

    case FavoritesActionTypes.UpdateFavorite: {
      return adapter.updateOne(action.payload.favorite, state);
    }

    case FavoritesActionTypes.DeleteFavorite: {
      return adapter.removeOne(action.payload.id, state);
    }

    case FavoritesActionTypes.DeleteFavorites: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case FavoritesActionTypes.FavoritesLoaded: {
      return adapter.addAll(action.payload.favorites, {
        ...state,
        loaded: true
      });
    }

    case FavoritesActionTypes.FavoritesLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case FavoritesActionTypes.ClearFavorites: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
