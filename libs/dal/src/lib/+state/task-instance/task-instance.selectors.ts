import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './task-instance.reducer';

export const selectTaskInstanceState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectTaskInstanceState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectTaskInstanceState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectTaskInstanceState, selectAll);

export const getCount = createSelector(selectTaskInstanceState, selectTotal);

export const getIds = createSelector(selectTaskInstanceState, selectIds);

export const getAllEntities = createSelector(
  selectTaskInstanceState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * taskInstance$: TaskInstanceInterface[] = this.store.pipe(
    select(TaskInstanceQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectTaskInstanceState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * taskInstance$: TaskInstanceInterface = this.store.pipe(
    select(TaskInstanceQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectTaskInstanceState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
