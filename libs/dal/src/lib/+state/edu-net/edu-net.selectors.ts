import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './edu-net.reducer';

export const selectEduNetState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectEduNetState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectEduNetState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectEduNetState, selectAll);

export const getCount = createSelector(selectEduNetState, selectTotal);

export const getIds = createSelector(selectEduNetState, selectIds);

export const getAllEntities = createSelector(selectEduNetState, selectEntities);

/**
 * returns array of objects in the order of the given ids
 * @example
 * eduNet$: EduNetInterface[] = this.store.pipe(
    select(EduNetQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectEduNetState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * eduNet$: EduNetInterface = this.store.pipe(
    select(EduNetQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectEduNetState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
