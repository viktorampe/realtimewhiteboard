import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { TaskClassGroupInterface } from '../../+models';

export enum TaskClassGroupsActionTypes {
  TaskClassGroupsLoaded = '[TaskClassGroups] TaskClassGroups Loaded',
  TaskClassGroupsLoadError = '[TaskClassGroups] Load Error',
  LoadTaskClassGroups = '[TaskClassGroups] Load TaskClassGroups',
  AddTaskClassGroup = '[TaskClassGroups] Add TaskClassGroup',
  UpsertTaskClassGroup = '[TaskClassGroups] Upsert TaskClassGroup',
  AddTaskClassGroups = '[TaskClassGroups] Add TaskClassGroups',
  UpsertTaskClassGroups = '[TaskClassGroups] Upsert TaskClassGroups',
  UpdateTaskClassGroup = '[TaskClassGroups] Update TaskClassGroup',
  UpdateTaskClassGroups = '[TaskClassGroups] Update TaskClassGroups',
  DeleteTaskClassGroup = '[TaskClassGroups] Delete TaskClassGroup',
  DeleteTaskClassGroups = '[TaskClassGroups] Delete TaskClassGroups',
  ClearTaskClassGroups = '[TaskClassGroups] Clear TaskClassGroups'
}

export class LoadTaskClassGroups implements Action {
  readonly type = TaskClassGroupsActionTypes.LoadTaskClassGroups;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class TaskClassGroupsLoaded implements Action {
  readonly type = TaskClassGroupsActionTypes.TaskClassGroupsLoaded;

  constructor(public payload: { taskClassGroups: TaskClassGroupInterface[] }) {}
}

export class TaskClassGroupsLoadError implements Action {
  readonly type = TaskClassGroupsActionTypes.TaskClassGroupsLoadError;
  constructor(public payload: any) {}
}

export class AddTaskClassGroup implements Action {
  readonly type = TaskClassGroupsActionTypes.AddTaskClassGroup;

  constructor(public payload: { taskClassGroup: TaskClassGroupInterface }) {}
}

export class UpsertTaskClassGroup implements Action {
  readonly type = TaskClassGroupsActionTypes.UpsertTaskClassGroup;

  constructor(public payload: { taskClassGroup: TaskClassGroupInterface }) {}
}

export class AddTaskClassGroups implements Action {
  readonly type = TaskClassGroupsActionTypes.AddTaskClassGroups;

  constructor(public payload: { taskClassGroups: TaskClassGroupInterface[] }) {}
}

export class UpsertTaskClassGroups implements Action {
  readonly type = TaskClassGroupsActionTypes.UpsertTaskClassGroups;

  constructor(public payload: { taskClassGroups: TaskClassGroupInterface[] }) {}
}

export class UpdateTaskClassGroup implements Action {
  readonly type = TaskClassGroupsActionTypes.UpdateTaskClassGroup;

  constructor(
    public payload: { taskClassGroup: Update<TaskClassGroupInterface> }
  ) {}
}

export class UpdateTaskClassGroups implements Action {
  readonly type = TaskClassGroupsActionTypes.UpdateTaskClassGroups;

  constructor(
    public payload: { taskClassGroups: Update<TaskClassGroupInterface>[] }
  ) {}
}

export class DeleteTaskClassGroup implements Action {
  readonly type = TaskClassGroupsActionTypes.DeleteTaskClassGroup;

  constructor(public payload: { id: number }) {}
}

export class DeleteTaskClassGroups implements Action {
  readonly type = TaskClassGroupsActionTypes.DeleteTaskClassGroups;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearTaskClassGroups implements Action {
  readonly type = TaskClassGroupsActionTypes.ClearTaskClassGroups;
}

export type TaskClassGroupsActions =
  | LoadTaskClassGroups
  | TaskClassGroupsLoaded
  | TaskClassGroupsLoadError
  | AddTaskClassGroup
  | UpsertTaskClassGroup
  | AddTaskClassGroups
  | UpsertTaskClassGroups
  | UpdateTaskClassGroup
  | UpdateTaskClassGroups
  | DeleteTaskClassGroup
  | DeleteTaskClassGroups
  | ClearTaskClassGroups;
