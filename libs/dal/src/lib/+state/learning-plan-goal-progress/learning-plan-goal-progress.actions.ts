import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { LearningPlanGoalProgressInterface } from '../../+models';

export enum LearningPlanGoalProgressesActionTypes {
  LearningPlanGoalProgressesLoaded = '[LearningPlanGoalProgresses] LearningPlanGoalProgresses Loaded',
  LearningPlanGoalProgressesLoadError = '[LearningPlanGoalProgresses] Load Error',
  LoadLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Load LearningPlanGoalProgresses',
  StartAddLearningPlanGoalProgress = '[LearningPlanGoalProgresses] Start Add LearningPlanGoalProgress',
  AddLearningPlanGoalProgress = '[LearningPlanGoalProgresses] Add LearningPlanGoalProgress',
  UpsertLearningPlanGoalProgress = '[LearningPlanGoalProgresses] Upsert LearningPlanGoalProgress',
  AddLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Add LearningPlanGoalProgresses',
  UpsertLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Upsert LearningPlanGoalProgresses',
  UpdateLearningPlanGoalProgress = '[LearningPlanGoalProgresses] Update LearningPlanGoalProgress',
  UpdateLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Update LearningPlanGoalProgresses',
  DeleteLearningPlanGoalProgress = '[LearningPlanGoalProgresses] Delete LearningPlanGoalProgress',
  DeleteLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Delete LearningPlanGoalProgresses',
  ClearLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Clear LearningPlanGoalProgresses',
  ToggleLearningPlanGoalProgress = '[LearningPlanGoalProgresses] Toggle LearningPlanGoalProgresses'
}

export class LoadLearningPlanGoalProgresses implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.LoadLearningPlanGoalProgresses;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class LearningPlanGoalProgressesLoaded implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.LearningPlanGoalProgressesLoaded;

  constructor(
    public payload: {
      learningPlanGoalProgresses: LearningPlanGoalProgressInterface[];
    }
  ) {}
}

export class LearningPlanGoalProgressesLoadError implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.LearningPlanGoalProgressesLoadError;
  constructor(public payload: any) {}
}

export class StartAddLearningPlanGoalProgress implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.StartAddLearningPlanGoalProgress;

  constructor(
    public payload: {
      learningPlanGoalProgress: LearningPlanGoalProgressInterface;
    }
  ) {}
}
export class AddLearningPlanGoalProgress implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.AddLearningPlanGoalProgress;

  constructor(
    public payload: {
      learningPlanGoalProgress: LearningPlanGoalProgressInterface;
    }
  ) {}
}

export class UpsertLearningPlanGoalProgress implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.UpsertLearningPlanGoalProgress;

  constructor(
    public payload: {
      learningPlanGoalProgress: LearningPlanGoalProgressInterface;
    }
  ) {}
}

export class AddLearningPlanGoalProgresses implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.AddLearningPlanGoalProgresses;

  constructor(
    public payload: {
      learningPlanGoalProgresses: LearningPlanGoalProgressInterface[];
    }
  ) {}
}

export class UpsertLearningPlanGoalProgresses implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.UpsertLearningPlanGoalProgresses;

  constructor(
    public payload: {
      learningPlanGoalProgresses: LearningPlanGoalProgressInterface[];
    }
  ) {}
}

export class UpdateLearningPlanGoalProgress implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.UpdateLearningPlanGoalProgress;

  constructor(
    public payload: {
      learningPlanGoalProgress: Update<LearningPlanGoalProgressInterface>;
    }
  ) {}
}

export class UpdateLearningPlanGoalProgresses implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.UpdateLearningPlanGoalProgresses;

  constructor(
    public payload: {
      learningPlanGoalProgresses: Update<LearningPlanGoalProgressInterface>[];
    }
  ) {}
}

export class DeleteLearningPlanGoalProgress implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.DeleteLearningPlanGoalProgress;

  constructor(public payload: { id: number }) {}
}

export class DeleteLearningPlanGoalProgresses implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.DeleteLearningPlanGoalProgresses;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearLearningPlanGoalProgresses implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.ClearLearningPlanGoalProgresses;
}
export class ToggleLearningPlanGoalProgress implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.ToggleLearningPlanGoalProgress;

  constructor(
    public payload: {
      classGroupId: number;
      eduContentTOCId: number;
      learningPlanGoalId: number;
    }
  ) {}
}

export type LearningPlanGoalProgressesActions =
  | LoadLearningPlanGoalProgresses
  | LearningPlanGoalProgressesLoaded
  | LearningPlanGoalProgressesLoadError
  | AddLearningPlanGoalProgress
  | UpsertLearningPlanGoalProgress
  | AddLearningPlanGoalProgresses
  | UpsertLearningPlanGoalProgresses
  | UpdateLearningPlanGoalProgress
  | UpdateLearningPlanGoalProgresses
  | DeleteLearningPlanGoalProgress
  | DeleteLearningPlanGoalProgresses
  | ClearLearningPlanGoalProgresses
  | ToggleLearningPlanGoalProgress
  | StartAddLearningPlanGoalProgress;
