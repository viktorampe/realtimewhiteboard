import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { TaskGroupInterface } from '../../+models';

export enum TaskGroupsActionTypes {
  TaskGroupsLoaded = '[TaskGroups] TaskGroups Loaded',
  TaskGroupsLoadError = '[TaskGroups] Load Error',
  LoadTaskGroups = '[TaskGroups] Load TaskGroups',
  AddTaskGroup = '[TaskGroups] Add TaskGroup',
  UpsertTaskGroup = '[TaskGroups] Upsert TaskGroup',
  AddTaskGroups = '[TaskGroups] Add TaskGroups',
  UpsertTaskGroups = '[TaskGroups] Upsert TaskGroups',
  UpdateTaskGroup = '[TaskGroups] Update TaskGroup',
  UpdateTaskGroups = '[TaskGroups] Update TaskGroups',
  DeleteTaskGroup = '[TaskGroups] Delete TaskGroup',
  DeleteTaskGroups = '[TaskGroups] Delete TaskGroups',
  ClearTaskGroups = '[TaskGroups] Clear TaskGroups'
}

export class LoadTaskGroups implements Action {
  readonly type = TaskGroupsActionTypes.LoadTaskGroups;

  constructor(
    public payload: { force?: boolean, userId: number } = { userId: null }
  ) {}
}

export class TaskGroupsLoaded implements Action {
  readonly type = TaskGroupsActionTypes.TaskGroupsLoaded;

  constructor(public payload: { taskGroups: TaskGroupInterface[] }) {}
}

export class TaskGroupsLoadError implements Action {
  readonly type = TaskGroupsActionTypes.TaskGroupsLoadError;
  constructor(public payload: any) {}
}

export class AddTaskGroup implements Action {
  readonly type = TaskGroupsActionTypes.AddTaskGroup;

  constructor(public payload: { taskGroup: TaskGroupInterface }) {}
}

export class UpsertTaskGroup implements Action {
  readonly type = TaskGroupsActionTypes.UpsertTaskGroup;

  constructor(public payload: { taskGroup: TaskGroupInterface }) {}
}

export class AddTaskGroups implements Action {
  readonly type = TaskGroupsActionTypes.AddTaskGroups;

  constructor(public payload: { taskGroups: TaskGroupInterface[] }) {}
}

export class UpsertTaskGroups implements Action {
  readonly type = TaskGroupsActionTypes.UpsertTaskGroups;

  constructor(public payload: { taskGroups: TaskGroupInterface[] }) {}
}

export class UpdateTaskGroup implements Action {
  readonly type = TaskGroupsActionTypes.UpdateTaskGroup;

  constructor(public payload: { taskGroup: Update<TaskGroupInterface> }) {}
}

export class UpdateTaskGroups implements Action {
  readonly type = TaskGroupsActionTypes.UpdateTaskGroups;

  constructor(public payload: { taskGroups: Update<TaskGroupInterface>[] }) {}
}

export class DeleteTaskGroup implements Action {
  readonly type = TaskGroupsActionTypes.DeleteTaskGroup;

  constructor(public payload: { id: number }) {}
}

export class DeleteTaskGroups implements Action {
  readonly type = TaskGroupsActionTypes.DeleteTaskGroups;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearTaskGroups implements Action {
  readonly type = TaskGroupsActionTypes.ClearTaskGroups;
}

export type TaskGroupsActions =
  | LoadTaskGroups
  | TaskGroupsLoaded
  | TaskGroupsLoadError
  | AddTaskGroup
  | UpsertTaskGroup
  | AddTaskGroups
  | UpsertTaskGroups
  | UpdateTaskGroup
  | UpdateTaskGroups
  | DeleteTaskGroup
  | DeleteTaskGroups
  | ClearTaskGroups;
