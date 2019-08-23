import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { LearningPlanGoalProgressInterface } from '../../+models';
import {
  CustomFeedbackHandlersInterface,
  FeedbackTriggeringAction
} from '../effect-feedback';

export enum LearningPlanGoalProgressesActionTypes {
  LearningPlanGoalProgressesLoaded = '[LearningPlanGoalProgresses] LearningPlanGoalProgresses Loaded',
  LearningPlanGoalProgressesLoadError = '[LearningPlanGoalProgresses] Load Error',
  LoadLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Load LearningPlanGoalProgresses',
  AddLearningPlanGoalProgress = '[LearningPlanGoalProgresses] Add LearningPlanGoalProgress',
  UpsertLearningPlanGoalProgress = '[LearningPlanGoalProgresses] Upsert LearningPlanGoalProgress',
  AddLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Add LearningPlanGoalProgresses',
  UpsertLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Upsert LearningPlanGoalProgresses',
  UpdateLearningPlanGoalProgress = '[LearningPlanGoalProgresses] Update LearningPlanGoalProgress',
  UpdateLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Update LearningPlanGoalProgresses',
  DeleteLearningPlanGoalProgress = '[LearningPlanGoalProgresses] Delete LearningPlanGoalProgress',
  DeleteLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Delete LearningPlanGoalProgresses',
  ClearLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Clear LearningPlanGoalProgresses',
  ToggleLearningPlanGoalProgress = '[LearningPlanGoalProgresses] Toggle LearningPlanGoalProgresses',
  StartAddLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Start Add LearningPlanGoalProgresses',
  BulkAddLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Bulk Add LearningPlanGoalProgresses',
  StartAddManyLearningPlanGoalProgresses = '[LearningPlanGoalProgresses] Start Add many LearningPlanGoalProgresses'
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

export class DeleteLearningPlanGoalProgress
  implements FeedbackTriggeringAction {
  readonly type =
    LearningPlanGoalProgressesActionTypes.DeleteLearningPlanGoalProgress;

  constructor(
    public payload: {
      id: number;
      userId: number;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class DeleteLearningPlanGoalProgresses
  implements FeedbackTriggeringAction {
  readonly type =
    LearningPlanGoalProgressesActionTypes.DeleteLearningPlanGoalProgresses;

  constructor(
    public payload: {
      ids: number[];
      userId: number;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class ClearLearningPlanGoalProgresses implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.ClearLearningPlanGoalProgresses;
}

export class ToggleLearningPlanGoalProgress
  implements FeedbackTriggeringAction {
  readonly type =
    LearningPlanGoalProgressesActionTypes.ToggleLearningPlanGoalProgress;

  constructor(
    public payload: {
      classGroupId: number;
      eduContentTOCId?: number;
      userLessonId?: number;
      eduContentBookId: number;
      learningPlanGoalId: number;
      personId: number;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class BulkAddLearningPlanGoalProgresses implements Action {
  readonly type =
    LearningPlanGoalProgressesActionTypes.BulkAddLearningPlanGoalProgresses;

  constructor(
    public payload: {
      classGroupId: number;
      eduContentTOCId?: number;
      userLessonId?: number;
      eduContentBookId: number;
      learningPlanGoalIds: number[];
      personId: number;
    }
  ) {}
}

export class StartAddLearningPlanGoalProgresses
  implements FeedbackTriggeringAction {
  readonly type =
    LearningPlanGoalProgressesActionTypes.StartAddLearningPlanGoalProgresses;

  constructor(
    public payload: {
      classGroupId: number;
      eduContentTOCId?: number;
      userLessonId?: number;
      eduContentBookId: number;
      learningPlanGoalIds: number[];
      personId: number;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class StartAddManyLearningPlanGoalProgresses
  implements FeedbackTriggeringAction {
  readonly type =
    LearningPlanGoalProgressesActionTypes.StartAddManyLearningPlanGoalProgresses;

  constructor(
    public payload: {
      learningPlanGoalProgresses: (
        | MinimalLearningPlanGoalProgressEduContentTocInterface
        | MinimalLearningPlanGoalProgressUserLessonInterface)[];
      personId: number;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
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
  | StartAddLearningPlanGoalProgresses
  | BulkAddLearningPlanGoalProgresses
  | StartAddManyLearningPlanGoalProgresses;

interface MinimalLearningPlanGoalProgressUserLessonInterface
  extends LearningPlanGoalProgressInterface {
  classGroupId: number;
  learningPlanGoalId: number;
  userLessonId: number;
  eduContentBookId: number;
}

interface MinimalLearningPlanGoalProgressEduContentTocInterface
  extends LearningPlanGoalProgressInterface {
  classGroupId: number;
  learningPlanGoalId: number;
  eduContentTocId: number;
}
