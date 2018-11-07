import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NAME,
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
  State
} from './exercise.reducer';

export const selectExerciseState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectExerciseState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectExerciseState,
  (state: State) => state.loaded
);

export const getAll = createSelector(selectExerciseState, selectAll);

export const getCount = createSelector(selectExerciseState, selectTotal);

export const getIds = createSelector(selectExerciseState, selectIds);

export const getAllEntities = createSelector(
  selectExerciseState,
  selectEntities
);

/**
 * returns array of objects in the order of the given ids
 * @example
 * exercise$: ExerciseInterface[] = this.store.pipe(
    select(ExerciseQueries.getByIds, { ids: [2, 1, 3] })
  );
 */
export const getByIds = createSelector(
  selectExerciseState,
  (state: State, props: { ids: number[] }) => {
    return props.ids.map(id => state.entities[id]);
  }
);


/**
 * returns array of objects in the order of the given ids
 * @example
 * exercise$: ExerciseInterface = this.store.pipe(
    select(ExerciseQueries.getById, { id: 3 })
  );
 */
export const getById = createSelector(
  selectExerciseState,
  (state: State, props: { id: number }) => state.entities[props.id]
);
