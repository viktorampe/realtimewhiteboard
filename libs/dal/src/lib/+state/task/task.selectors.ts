import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './task.reducer';

export const selectTaskState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectTaskState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectTaskState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectTaskState, selectAll);

export const getCount = createSelector(selectTaskState, selectTotal);

export const getIds = createSelector(selectTaskState, selectIds);

export const getAllEntities = createSelector(selectTaskState, selectEntities);

/**
 * returns array of objects in the order of the given ids
 * @example
 * task$: TaskInterface[] = this.store.pipe(
    select(TaskQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectTaskState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * task$: TaskInterface = this.store.pipe(
    select(TaskQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectTaskState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
