import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ExerciseInterface } from './../../+models/Exercise.interface';
import { ExercisesActions, ExercisesActionTypes } from './exercise.actions';

export const NAME = 'exercises';

export interface State extends EntityState<ExerciseInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
  currentExercise?: ExerciseInterface;
}

export const adapter: EntityAdapter<ExerciseInterface> = createEntityAdapter<
  ExerciseInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(state = initialState, action: ExercisesActions): State {
  switch (action.type) {
    case ExercisesActionTypes.ClearCurrentExercise: {
      return { ...state, currentExercise: null };
    }

    case ExercisesActionTypes.CurrentExerciseLoaded: {
      return { ...state, currentExercise: action.payload };
    }

    case ExercisesActionTypes.CurrentExerciseError: {
      return { ...state, currentExercise: null, error: action.payload };
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
