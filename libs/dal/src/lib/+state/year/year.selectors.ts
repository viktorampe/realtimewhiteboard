import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './year.reducer';

export const selectYearState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectYearState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectYearState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectYearState, selectAll);

export const getCount = createSelector(selectYearState, selectTotal);

export const getIds = createSelector(selectYearState, selectIds);

export const getAllEntities = createSelector(selectYearState, selectEntities);

/**
 * returns array of objects in the order of the given ids
 * @example
 * year$: YearInterface[] = this.store.pipe(
    select(YearQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectYearState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * year$: YearInterface = this.store.pipe(
    select(YearQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectYearState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
