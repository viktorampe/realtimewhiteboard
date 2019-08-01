import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './user-lesson.reducer';

export const selectUserLessonState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectUserLessonState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectUserLessonState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectUserLessonState, selectAll);

export const getCount = createSelector(selectUserLessonState, selectTotal);

export const getIds = createSelector(selectUserLessonState, selectIds);

export const getAllEntities = createSelector(
  selectUserLessonState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * userLesson$: UserLessonInterface[] = this.store.pipe(
    select(UserLessonQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectUserLessonState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);


/**
 * returns array of objects in the order of the given ids
 * @example
 * userLesson$: UserLessonInterface = this.store.pipe(
    select(UserLessonQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectUserLessonState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
