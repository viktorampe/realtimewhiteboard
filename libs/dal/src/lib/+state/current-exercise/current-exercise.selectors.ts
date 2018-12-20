import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  CurrentExerciseInterface,
  NAME,
  State
} from './current-exercise.reducer';

export const selectExerciseState = createFeatureSelector<State>(NAME);

export const getError = createSelector(
  selectExerciseState,
  (state: State) => state.error
);

export const getCurrentExercise = createSelector(
  selectExerciseState,
  (state: State) => {
    return { ...state } as CurrentExerciseInterface;
  }
);
