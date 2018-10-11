import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './unlocked-boeke-student.reducer';

export const selectUnlockedBoekeStudentState = createFeatureSelector<State>(
  'unlockedBoekeStudents'
);

export const getError = createSelector(
  selectUnlockedBoekeStudentState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectUnlockedBoekeStudentState,
  (state: State) => state.loaded
);

export const getAll = createSelector(
  selectUnlockedBoekeStudentState,
  selectAll
);

export const getCount = createSelector(
  selectUnlockedBoekeStudentState,
  selectTotal
);

export const getIds = createSelector(
  selectUnlockedBoekeStudentState,
  selectIds
);

export const getAllEntities = createSelector(
  selectUnlockedBoekeStudentState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * unlockedBoekeStudent$: UnlockedBoekeStudentInterface[] = this.store.pipe(
    select(UnlockedBoekeStudentQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectUnlockedBoekeStudentState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * unlockedBoekeStudent$: UnlockedBoekeStudentInterface = this.store.pipe(
    select(UnlockedBoekeStudentQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectUnlockedBoekeStudentState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
