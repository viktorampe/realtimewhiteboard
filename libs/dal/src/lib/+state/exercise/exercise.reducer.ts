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
    case ExercisesActionTypes.AddExercise: {
      return adapter.addOne(action.payload.exercise, state);
    }

    case ExercisesActionTypes.UpsertExercise: {
      return adapter.upsertOne(action.payload.exercise, state);
    }

    case ExercisesActionTypes.AddExercises: {
      return adapter.addMany(action.payload.exercises, state);
    }

    case ExercisesActionTypes.UpsertExercises: {
      return adapter.upsertMany(action.payload.exercises, state);
    }

    case ExercisesActionTypes.UpdateExercise: {
      return adapter.updateOne(action.payload.exercise, state);
    }

    case ExercisesActionTypes.UpdateExercises: {
      return adapter.updateMany(action.payload.exercises, state);
    }

    case ExercisesActionTypes.DeleteExercise: {
      return adapter.removeOne(action.payload.id, state);
    }

    case ExercisesActionTypes.DeleteExercises: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case ExercisesActionTypes.ExercisesLoaded: {
      return adapter.addAll(action.payload.exercises, {
        ...state,
        loaded: true
      });
    }

    case ExercisesActionTypes.ExercisesLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case ExercisesActionTypes.ClearExercises: {
      return adapter.removeAll(state);
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
