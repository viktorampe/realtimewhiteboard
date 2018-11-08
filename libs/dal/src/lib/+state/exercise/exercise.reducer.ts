import { ExerciseInterface } from './../../+models/Exercise.interface';
import { ExercisesActions, ExercisesActionTypes } from './exercise.actions';

export const NAME = 'exercises';

export interface State {
  // additional entities state properties
  loaded: boolean;
  error?: any;
  currentExercise?: ExerciseInterface;
}

export const initialState: State = {
  // additional entity state properties
  loaded: false
};

export function reducer(state = initialState, action: ExercisesActions): State {
  switch (action.type) {
    case ExercisesActionTypes.ClearCurrentExercise: {
      return { ...state, currentExercise: null, loaded: true };
    }

    case ExercisesActionTypes.CurrentExerciseLoaded: {
      return { ...state, currentExercise: action.payload, loaded: true };
    }

    case ExercisesActionTypes.CurrentExerciseError: {
      return {
        ...state,
        currentExercise: null,
        error: action.payload,
        loaded: false
      };
    }

    default: {
      return state;
    }
  }
}
