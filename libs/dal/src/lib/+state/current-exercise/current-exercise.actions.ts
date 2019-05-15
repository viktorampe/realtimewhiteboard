import { ScormCmiMode } from '@campus/scorm';
import { Action } from '@ngrx/store';
import { ResultInterface } from '../../+models';
import {
  CustomFeedbackHandlersInterface,
  FeedbackTriggeringAction
} from '../effect-feedback';
import { CurrentExerciseInterface } from './current-exercise.reducer';

export enum CurrentExerciseActionTypes {
  LoadExercise = '[Current Exercise] Load Exercise',
  CurrentExerciseLoaded = '[Current Exercise] Current Exercise Loaded',
  CurrentExerciseError = '[Current Exercise] Current Exercise Error',
  SaveCurrentExercise = '[Current Exercise] Save Current Exercise',
  ClearCurrentExercise = '[Current Exercise] Clear Current Exercise'
}

export class LoadExercise implements Action {
  readonly type = CurrentExerciseActionTypes.LoadExercise;
  constructor(
    public payload: {
      userId: number;
      educontentId: number;
      saveToApi: boolean;
      cmiMode: ScormCmiMode;
      taskId?: number;
      unlockedContentId?: number;
      result?: ResultInterface;
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

export class SaveCurrentExercise implements FeedbackTriggeringAction {
  readonly type = CurrentExerciseActionTypes.SaveCurrentExercise;

  constructor(
    public payload: {
      userId: number;
      exercise: CurrentExerciseInterface;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class ClearCurrentExercise implements Action {
  readonly type = CurrentExerciseActionTypes.ClearCurrentExercise;
}

export type CurrentExerciseActions =
  | LoadExercise
  | CurrentExerciseLoaded
  | CurrentExerciseError
  | SaveCurrentExercise
  | ClearCurrentExercise;
