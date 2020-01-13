import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { TaskInterface } from '../../+models';
import {
  CustomFeedbackHandlersInterface,
  FeedbackTriggeringAction
} from '../effect-feedback';

export enum TasksActionTypes {
  TasksLoaded = '[Tasks] Tasks Loaded',
  TasksLoadError = '[Tasks] Load Error',
  LoadTasks = '[Tasks] Load Tasks',
  AddTask = '[Tasks] Add Task',
  UpsertTask = '[Tasks] Upsert Task',
  AddTasks = '[Tasks] Add Tasks',
  UpsertTasks = '[Tasks] Upsert Tasks',
  UpdateTask = '[Tasks] Update Task',
  UpdateTasks = '[Tasks] Update Tasks',
  DeleteTask = '[Tasks] Delete Task',
  DeleteTasks = '[Tasks] Delete Tasks',
  ClearTasks = '[Tasks] Clear Tasks',
  StartAddTask = '[Tasks] Start Add Task',
  NavigateToTaskDetail = '[Tasks] Navigate To Task Detail'
}

export class LoadTasks implements Action {
  readonly type = TasksActionTypes.LoadTasks;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class TasksLoaded implements Action {
  readonly type = TasksActionTypes.TasksLoaded;

  constructor(public payload: { tasks: TaskInterface[] }) {}
}

export class TasksLoadError implements Action {
  readonly type = TasksActionTypes.TasksLoadError;
  constructor(public payload: any) {}
}

export class AddTask implements Action {
  readonly type = TasksActionTypes.AddTask;

  constructor(public payload: { task: TaskInterface }) {}
}

export class UpsertTask implements Action {
  readonly type = TasksActionTypes.UpsertTask;

  constructor(public payload: { task: TaskInterface }) {}
}

export class AddTasks implements Action {
  readonly type = TasksActionTypes.AddTasks;

  constructor(public payload: { tasks: TaskInterface[] }) {}
}

export class UpsertTasks implements Action {
  readonly type = TasksActionTypes.UpsertTasks;

  constructor(public payload: { tasks: TaskInterface[] }) {}
}

export class UpdateTask implements Action {
  readonly type = TasksActionTypes.UpdateTask;

  constructor(public payload: { task: Update<TaskInterface> }) {}
}

export class UpdateTasks implements Action {
  readonly type = TasksActionTypes.UpdateTasks;

  constructor(public payload: { tasks: Update<TaskInterface>[] }) {}
}

export class DeleteTask implements Action {
  readonly type = TasksActionTypes.DeleteTask;

  constructor(public payload: { id: number }) {}
}

export class DeleteTasks implements Action {
  readonly type = TasksActionTypes.DeleteTasks;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearTasks implements Action {
  readonly type = TasksActionTypes.ClearTasks;
}

export class StartAddTask implements FeedbackTriggeringAction {
  readonly type = TasksActionTypes.StartAddTask;

  constructor(
    public payload: {
      task: Partial<TaskInterface>;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class NavigateToTaskDetail implements Action {
  readonly type = TasksActionTypes.NavigateToTaskDetail;

  constructor(
    public payload: {
      task: TaskInterface;
    }
  ) {}
}

export type TasksActions =
  | LoadTasks
  | TasksLoaded
  | TasksLoadError
  | AddTask
  | UpsertTask
  | AddTasks
  | UpsertTasks
  | UpdateTask
  | UpdateTasks
  | DeleteTask
  | DeleteTasks
  | ClearTasks
  | StartAddTask
  | NavigateToTaskDetail;
