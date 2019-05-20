import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './history.reducer';

export const selectHistoryState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectHistoryState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectHistoryState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectHistoryState, selectAll);

export const getCount = createSelector(selectHistoryState, selectTotal);

export const getIds = createSelector(selectHistoryState, selectIds);

export const getAllEntities = createSelector(
  selectHistoryState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * history$: HistoryInterface[] = this.store.pipe(
    select(HistoryQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectHistoryState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);


/**
 * returns array of objects in the order of the given ids
 * @example
 * history$: HistoryInterface = this.store.pipe(
    select(HistoryQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectHistoryState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
