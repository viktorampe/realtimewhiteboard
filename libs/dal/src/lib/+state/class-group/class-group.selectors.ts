import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './class-group.reducer';

export const selectClassGroupState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectClassGroupState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectClassGroupState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectClassGroupState,
  selectAll
);

export const getCount = createSelector(
  selectClassGroupState,
  selectTotal
);

export const getIds = createSelector(
  selectClassGroupState,
  selectIds
);

export const getAllEntities = createSelector(
  selectClassGroupState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * classGroup$: ClassGroupInterface[] = this.store.pipe(
    select(ClassGroupQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectClassGroupState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * classGroup$: ClassGroupInterface = this.store.pipe(
    select(ClassGroupQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectClassGroupState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
