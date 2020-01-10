import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './teacher-student.reducer';

export const selectTeacherStudentState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectTeacherStudentState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectTeacherStudentState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectTeacherStudentState, selectAll);

export const getCount = createSelector(selectTeacherStudentState, selectTotal);

export const getIds = createSelector(selectTeacherStudentState, selectIds);

export const getAllEntities = createSelector(
  selectTeacherStudentState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * teacherStudent$: TeacherStudentInterface[] = this.store.pipe(
    select(TeacherStudentQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectTeacherStudentState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * teacherStudent$: TeacherStudentInterface[] = this.store.pipe(
    select(TeacherStudentQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectTeacherStudentState,
  (state: State, props: { id: number }) => state.entities[props.id]
);

/**
 * returns array of ids (number[]) of the linked persons
 */
export const getTeacherIdsFromTeacherStudents = createSelector(
  selectTeacherStudentState,
  (state: State) =>
    Object.values(state.entities).map(
      teacherStudent => teacherStudent.teacherId
    )
);

/**
 * returns array of ids (number[]) of the linked persons
 */
export const getCoupledTeacherIds = createSelector(
  selectTeacherStudentState,
  (state: State, props: { userId: number }) => {
    return Object.values(state.entities)
      .map(teacherStudent => {
        return teacherStudent.teacherId;
      })
      .filter(id => id !== props.userId);
  }
);
