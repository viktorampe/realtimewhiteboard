import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './task-group.reducer';

export const selectTaskGroupState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectTaskGroupState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectTaskGroupState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectTaskGroupState, selectAll);

export const getCount = createSelector(selectTaskGroupState, selectTotal);

export const getIds = createSelector(selectTaskGroupState, selectIds);

export const getAllEntities = createSelector(
  selectTaskGroupState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * taskGroup$: TaskGroupInterface[] = this.store.pipe(
    select(TaskGroupQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectTaskGroupState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * taskGroup$: TaskGroupInterface = this.store.pipe(
    select(TaskGroupQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectTaskGroupState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
