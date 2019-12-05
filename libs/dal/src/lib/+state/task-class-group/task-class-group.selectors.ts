import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './task-class-group.reducer';

export const selectTaskClassGroupState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectTaskClassGroupState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectTaskClassGroupState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectTaskClassGroupState,
  selectAll
);

export const getCount = createSelector(
  selectTaskClassGroupState,
  selectTotal
);

export const getIds = createSelector(
  selectTaskClassGroupState,
  selectIds
);

export const getAllEntities = createSelector(
  selectTaskClassGroupState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * taskClassGroup$: TaskClassGroupInterface[] = this.store.pipe(
    select(TaskClassGroupQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectTaskClassGroupState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * taskClassGroup$: TaskClassGroupInterface = this.store.pipe(
    select(TaskClassGroupQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectTaskClassGroupState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
