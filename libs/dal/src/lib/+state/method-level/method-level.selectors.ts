import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './method-level.reducer';

export const selectMethodLevelState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectMethodLevelState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectMethodLevelState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectMethodLevelState, selectAll);

export const getCount = createSelector(selectMethodLevelState, selectTotal);

export const getIds = createSelector(selectMethodLevelState, selectIds);

export const getAllEntities = createSelector(
  selectMethodLevelState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * methodLevel$: MethodLevelInterface[] = this.store.pipe(
    select(MethodLevelQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectMethodLevelState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);


/**
 * returns array of objects in the order of the given ids
 * @example
 * methodLevel$: MethodLevelInterface = this.store.pipe(
    select(MethodLevelQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectMethodLevelState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
