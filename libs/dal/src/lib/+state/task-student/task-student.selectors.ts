import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './task-student.reducer';

export const selectTaskStudentState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectTaskStudentState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectTaskStudentState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectTaskStudentState, selectAll);

export const getCount = createSelector(selectTaskStudentState, selectTotal);

export const getIds = createSelector(selectTaskStudentState, selectIds);

export const getAllEntities = createSelector(
  selectTaskStudentState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * taskStudent$: TaskStudentInterface[] = this.store.pipe(
    select(TaskStudentQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectTaskStudentState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);


/**
 * returns array of objects in the order of the given ids
 * @example
 * taskStudent$: TaskStudentInterface = this.store.pipe(
    select(TaskStudentQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectTaskStudentState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
