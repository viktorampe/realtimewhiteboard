import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NAME, State } from './exercise.reducer';

export const selectExerciseState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectExerciseState,
  (state: State) => state.error
);

export const getLoaded = createSelector(
  selectExerciseState,
  (state: State) => state.loaded
);

export const getCurrentExercise = createSelector(
  selectExerciseState,
  (state: State) => state.currentExercise
);
