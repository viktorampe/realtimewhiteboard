import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './user-content.reducer';

export const selectUserContentState = createFeatureSelector<State>(
  'userContents'
);

export const getError = createSelector(
  selectUserContentState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectUserContentState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectUserContentState, selectAll);

export const getCount = createSelector(selectUserContentState, selectTotal);

export const getIds = createSelector(selectUserContentState, selectIds);

export const getAllEntities = createSelector(
  selectUserContentState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * userContent$: UserContentInterface[] = this.store.pipe(
    select(UserContentQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectUserContentState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * userContent$: UserContentInterface = this.store.pipe(
    select(UserContentQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectUserContentState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
