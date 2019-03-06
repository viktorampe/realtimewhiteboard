import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './favorite.reducer';

export const selectFavoriteState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectFavoriteState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectFavoriteState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectFavoriteState, selectAll);

export const getCount = createSelector(selectFavoriteState, selectTotal);

export const getIds = createSelector(selectFavoriteState, selectIds);

export const getAllEntities = createSelector(
  selectFavoriteState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * favorite$: FavoriteInterface[] = this.store.pipe(
    select(FavoriteQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectFavoriteState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);


/**
 * returns array of objects in the order of the given ids
 * @example
 * favorite$: FavoriteInterface = this.store.pipe(
    select(FavoriteQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectFavoriteState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
