import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './student-content-status.reducer';

export const selectStudentContentStatusesState = createFeatureSelector<State>(
  NAME
);

export const getError = createSelector(
  selectStudentContentStatusesState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectStudentContentStatusesState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectStudentContentStatusesState,
  selectAll
);

export const getCount = createSelector(
  selectStudentContentStatusesState,
  selectTotal
);

export const getIds = createSelector(
  selectStudentContentStatusesState,
  selectIds
);

export const getAllEntities = createSelector(
  selectStudentContentStatusesState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * studentContentStatus$: StudentContentStatusInterface[] = this.store.pipe(
    select(StudentContentStatusQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectStudentContentStatusesState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * studentContentStatus$: StudentContentStatusInterface = this.store.pipe(
    select(StudentContentStatusQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectStudentContentStatusesState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
