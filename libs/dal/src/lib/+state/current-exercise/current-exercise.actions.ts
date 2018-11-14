import { Action } from '@ngrx/store';
import { CurrentExerciseInterface } from './current-exercise.reducer';

export enum ExercisesActionTypes {
  StartExercise = '[Current Exercise] Start Exercise',
  CurrentExerciseLoaded = '[Current Exercise] Current Exercise Loaded',
  CurrentExerciseError = '[Current Exercise] Current Exercise Error',
  SaveCurrentExercise = '[Current Exercise] Save Current Exercise',
  UpdateCurrentExercise = '[Current Exercise] Update Current Exercise',
  ClearCurrentExercise = '[Current Exercise] Clear Current Exercise'
}

export class StartExercise implements Action {
  readonly type = ExercisesActionTypes.StartExercise;

  constructor(
    public payload: {
      userId: number;
      educontentId: number;
      taskId?: number;
      unlockedContentId?: number;
    }
  ) {}
}

export class CurrentExerciseLoaded implements Action {
  readonly type = ExercisesActionTypes.CurrentExerciseLoaded;

  constructor(public payload: CurrentExerciseInterface) {}
}

export class CurrentExerciseError implements Action {
  readonly type = ExercisesActionTypes.CurrentExerciseError;

  constructor(public payload: any) {}
}

export class SaveCurrentExercise implements Action {
  readonly type = ExercisesActionTypes.SaveCurrentExercise;

  constructor(
    public payload: {
      userId: number;
      exercise: CurrentExerciseInterface;
    }
  ) {}
}

export class ClearCurrentExercise implements Action {
  readonly type = ExercisesActionTypes.ClearCurrentExercise;
}

export type ExercisesActions =
  | StartExercise
  | CurrentExerciseLoaded
  | CurrentExerciseError
  | SaveCurrentExercise
  | ClearCurrentExercise;
