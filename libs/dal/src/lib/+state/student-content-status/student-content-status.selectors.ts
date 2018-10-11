import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './student-content-status.reducer';

export const selectStudentContentStatusestate = createFeatureSelector<State>(
  'StudentContentStatuses'
);

export const getError = createSelector(
  selectStudentContentStatusestate,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectStudentContentStatusestate,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectStudentContentStatusestate,
  selectAll
);

export const getCount = createSelector(
  selectStudentContentStatusestate,
  selectTotal
);

export const getIds = createSelector(
  selectStudentContentStatusestate,
  selectIds
);

export const getAllEntities = createSelector(
  selectStudentContentStatusestate,
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
  selectStudentContentStatusestate,
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
  selectStudentContentStatusestate,
  (state: State, props: { id: number }) => state.entities[props.id]
);
