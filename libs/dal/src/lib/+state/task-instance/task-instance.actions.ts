import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { TaskInstanceInterface } from '../../+models';

export enum TaskInstancesActionTypes {
  TaskInstancesLoaded = '[TaskInstances] TaskInstances Loaded',
  TaskInstancesLoadError = '[TaskInstances] Load Error',
  LoadTaskInstances = '[TaskInstances] Load TaskInstances',
  AddTaskInstance = '[TaskInstances] Add TaskInstance',
  UpsertTaskInstance = '[TaskInstances] Upsert TaskInstance',
  AddTaskInstances = '[TaskInstances] Add TaskInstances',
  UpsertTaskInstances = '[TaskInstances] Upsert TaskInstances',
  UpdateTaskInstance = '[TaskInstances] Update TaskInstance',
  UpdateTaskInstances = '[TaskInstances] Update TaskInstances',
  DeleteTaskInstance = '[TaskInstances] Delete TaskInstance',
  DeleteTaskInstances = '[TaskInstances] Delete TaskInstances',
  ClearTaskInstances = '[TaskInstances] Clear TaskInstances'
}

export class LoadTaskInstances implements Action {
  readonly type = TaskInstancesActionTypes.LoadTaskInstances;

  constructor(
    public payload: { force?: boolean, userId: number } = { userId: null }
  ) {}
}

export class TaskInstancesLoaded implements Action {
  readonly type = TaskInstancesActionTypes.TaskInstancesLoaded;

  constructor(public payload: { taskInstances: TaskInstanceInterface[] }) {}
}

export class TaskInstancesLoadError implements Action {
  readonly type = TaskInstancesActionTypes.TaskInstancesLoadError;
  constructor(public payload: any) {}
}

export class AddTaskInstance implements Action {
  readonly type = TaskInstancesActionTypes.AddTaskInstance;

  constructor(public payload: { taskInstance: TaskInstanceInterface }) {}
}

export class UpsertTaskInstance implements Action {
  readonly type = TaskInstancesActionTypes.UpsertTaskInstance;

  constructor(public payload: { taskInstance: TaskInstanceInterface }) {}
}

export class AddTaskInstances implements Action {
  readonly type = TaskInstancesActionTypes.AddTaskInstances;

  constructor(public payload: { taskInstances: TaskInstanceInterface[] }) {}
}

export class UpsertTaskInstances implements Action {
  readonly type = TaskInstancesActionTypes.UpsertTaskInstances;

  constructor(public payload: { taskInstances: TaskInstanceInterface[] }) {}
}

export class UpdateTaskInstance implements Action {
  readonly type = TaskInstancesActionTypes.UpdateTaskInstance;

  constructor(public payload: { taskInstance: Update<TaskInstanceInterface> }) {}
}

export class UpdateTaskInstances implements Action {
  readonly type = TaskInstancesActionTypes.UpdateTaskInstances;

  constructor(public payload: { taskInstances: Update<TaskInstanceInterface>[] }) {}
}

export class DeleteTaskInstance implements Action {
  readonly type = TaskInstancesActionTypes.DeleteTaskInstance;

  constructor(public payload: { id: number }) {}
}

export class DeleteTaskInstances implements Action {
  readonly type = TaskInstancesActionTypes.DeleteTaskInstances;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearTaskInstances implements Action {
  readonly type = TaskInstancesActionTypes.ClearTaskInstances;
}

export type TaskInstancesActions =
  | LoadTaskInstances
  | TaskInstancesLoaded
  | TaskInstancesLoadError
  | AddTaskInstance
  | UpsertTaskInstance
  | AddTaskInstances
  | UpsertTaskInstances
  | UpdateTaskInstance
  | UpdateTaskInstances
  | DeleteTaskInstance
  | DeleteTaskInstances
  | ClearTaskInstances;
