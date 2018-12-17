import { Action } from '@ngrx/store';
import { CurrentExerciseInterface } from './current-exercise.reducer';

export enum CurrentExerciseActionTypes {
  StartExercise = '[Current Exercise] Start Exercise',
  CurrentExerciseLoaded = '[Current Exercise] Current Exercise Loaded',
  CurrentExerciseError = '[Current Exercise] Current Exercise Error',
  SaveCurrentExercise = '[Current Exercise] Save Current Exercise',
  ClearCurrentExercise = '[Current Exercise] Clear Current Exercise'
}

export class StartExercise implements Action {
  readonly type = CurrentExerciseActionTypes.StartExercise;
  constructor(
    public payload: {
      userId: number;
      educontentId: number;
      saveToApi: boolean;
      taskId?: number;
      unlockedContentId?: number;
    }
  ) {}
}

export class CurrentExerciseLoaded implements Action {
  readonly type = CurrentExerciseActionTypes.CurrentExerciseLoaded;

  constructor(public payload: CurrentExerciseInterface) {}
}

export class CurrentExerciseError implements Action {
  readonly type = CurrentExerciseActionTypes.CurrentExerciseError;

  constructor(public payload: any) {}
}

export class SaveCurrentExercise implements Action {
  readonly type = CurrentExerciseActionTypes.SaveCurrentExercise;

  constructor(
    public payload: {
      userId: number;
      exercise: CurrentExerciseInterface;
    }
  ) {}
}

export class ClearCurrentExercise implements Action {
  readonly type = CurrentExerciseActionTypes.ClearCurrentExercise;
}

export type CurrentExerciseActions =
  | StartExercise
  | CurrentExerciseLoaded
  | CurrentExerciseError
  | SaveCurrentExercise
  | ClearCurrentExercise;
