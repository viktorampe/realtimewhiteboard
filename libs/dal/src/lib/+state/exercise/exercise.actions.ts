import { Action } from '@ngrx/store';
import { ExerciseInterface } from './../../+models/Exercise.interface';

export enum ExercisesActionTypes {
  StartExercise = '[Exercises] Start Exercise',
  CurrentExerciseLoaded = '[Exercises] Current Exercise Loaded',
  CurrentExerciseError = '[Exercises] Current Exercise Error',
  SaveCurrentExercise = '[Exercises] Save Current Exercise',
  UpdateCurrentExercise = '[Exercises] Update Current Exercise',
  ClearCurrentExercise = '[Exercises] Clear Current Exercise'
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

  constructor(public payload: ExerciseInterface) {}
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
      exercise: ExerciseInterface;
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
