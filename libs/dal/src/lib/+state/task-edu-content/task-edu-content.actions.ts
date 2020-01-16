import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { TaskEduContentInterface } from '../../+models';
import {
  CustomFeedbackHandlersInterface,
  FeedbackTriggeringAction
} from '../effect-feedback';

export enum TaskEduContentsActionTypes {
  TaskEduContentsLoaded = '[TaskEduContents] TaskEduContents Loaded',
  TaskEduContentsLoadError = '[TaskEduContents] Load Error',
  LoadTaskEduContents = '[TaskEduContents] Load TaskEduContents',
  AddTaskEduContent = '[TaskEduContents] Add TaskEduContent',
  UpsertTaskEduContent = '[TaskEduContents] Upsert TaskEduContent',
  AddTaskEduContents = '[TaskEduContents] Add TaskEduContents',
  UpsertTaskEduContents = '[TaskEduContents] Upsert TaskEduContents',
  UpdateTaskEduContent = '[TaskEduContents] Update TaskEduContent',
  StartUpdateTaskEduContents = '[TaskEduContents] Update StartUpdateTaskEduContents',
  UpdateTaskEduContents = '[TaskEduContents] Update TaskEduContents',
  DeleteTaskEduContent = '[TaskEduContents] Delete TaskEduContent',
  DeleteTaskEduContents = '[TaskEduContents] Delete TaskEduContents',
  ClearTaskEduContents = '[TaskEduContents] Clear TaskEduContents',
  LinkTaskEduContent = '[TaskEduContents] Link TaskEduContent'
}

export class LoadTaskEduContents implements Action {
  readonly type = TaskEduContentsActionTypes.LoadTaskEduContents;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class TaskEduContentsLoaded implements Action {
  readonly type = TaskEduContentsActionTypes.TaskEduContentsLoaded;

  constructor(public payload: { taskEduContents: TaskEduContentInterface[] }) {}
}

export class TaskEduContentsLoadError implements Action {
  readonly type = TaskEduContentsActionTypes.TaskEduContentsLoadError;
  constructor(public payload: any) {}
}

export class AddTaskEduContent implements Action {
  readonly type = TaskEduContentsActionTypes.AddTaskEduContent;

  constructor(public payload: { taskEduContent: TaskEduContentInterface }) {}
}

export class UpsertTaskEduContent implements Action {
  readonly type = TaskEduContentsActionTypes.UpsertTaskEduContent;

  constructor(public payload: { taskEduContent: TaskEduContentInterface }) {}
}

export class AddTaskEduContents implements Action {
  readonly type = TaskEduContentsActionTypes.AddTaskEduContents;

  constructor(public payload: { taskEduContents: TaskEduContentInterface[] }) {}
}

export class UpsertTaskEduContents implements Action {
  readonly type = TaskEduContentsActionTypes.UpsertTaskEduContents;

  constructor(public payload: { taskEduContents: TaskEduContentInterface[] }) {}
}

export class UpdateTaskEduContent implements Action {
  readonly type = TaskEduContentsActionTypes.UpdateTaskEduContent;

  constructor(
    public payload: { taskEduContent: Update<TaskEduContentInterface> }
  ) {}
}

export class UpdateTaskEduContents implements Action {
  readonly type = TaskEduContentsActionTypes.UpdateTaskEduContents;

  constructor(
    public payload: { taskEduContents: Update<TaskEduContentInterface>[] }
  ) {}
}

export class StartUpdateTaskEduContents implements FeedbackTriggeringAction {
  readonly type = TaskEduContentsActionTypes.StartUpdateTaskEduContents;

  constructor(
    public payload: {
      userId: number;
      taskEduContents: Update<TaskEduContentInterface>[];
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class DeleteTaskEduContent implements FeedbackTriggeringAction {
  readonly type = TaskEduContentsActionTypes.DeleteTaskEduContent;

  constructor(
    public payload: {
      id: number;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class DeleteTaskEduContents implements Action {
  readonly type = TaskEduContentsActionTypes.DeleteTaskEduContents;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearTaskEduContents implements Action {
  readonly type = TaskEduContentsActionTypes.ClearTaskEduContents;
}

export class LinkTaskEduContent implements FeedbackTriggeringAction {
  readonly type = TaskEduContentsActionTypes.LinkTaskEduContent;
  constructor(
    public payload: {
      taskId: number;
      eduContentId: number;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export type TaskEduContentsActions =
  | LoadTaskEduContents
  | TaskEduContentsLoaded
  | TaskEduContentsLoadError
  | AddTaskEduContent
  | UpsertTaskEduContent
  | AddTaskEduContents
  | UpsertTaskEduContents
  | UpdateTaskEduContent
  | UpdateTaskEduContents
  | DeleteTaskEduContent
  | DeleteTaskEduContents
  | ClearTaskEduContents
  | LinkTaskEduContent;
