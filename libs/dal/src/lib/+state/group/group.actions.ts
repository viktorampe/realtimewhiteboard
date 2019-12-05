import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { GroupInterface } from '../../+models';

export enum GroupsActionTypes {
  GroupsLoaded = '[Groups] Groups Loaded',
  GroupsLoadError = '[Groups] Load Error',
  LoadGroups = '[Groups] Load Groups',
  AddGroup = '[Groups] Add Group',
  UpsertGroup = '[Groups] Upsert Group',
  AddGroups = '[Groups] Add Groups',
  UpsertGroups = '[Groups] Upsert Groups',
  UpdateGroup = '[Groups] Update Group',
  UpdateGroups = '[Groups] Update Groups',
  DeleteGroup = '[Groups] Delete Group',
  DeleteGroups = '[Groups] Delete Groups',
  ClearGroups = '[Groups] Clear Groups'
}

export class LoadGroups implements Action {
  readonly type = GroupsActionTypes.LoadGroups;

  constructor(
    public payload: { force?: boolean, userId: number } = { userId: null }
  ) {}
}

export class GroupsLoaded implements Action {
  readonly type = GroupsActionTypes.GroupsLoaded;

  constructor(public payload: { groups: GroupInterface[] }) {}
}

export class GroupsLoadError implements Action {
  readonly type = GroupsActionTypes.GroupsLoadError;
  constructor(public payload: any) {}
}

export class AddGroup implements Action {
  readonly type = GroupsActionTypes.AddGroup;

  constructor(public payload: { group: GroupInterface }) {}
}

export class UpsertGroup implements Action {
  readonly type = GroupsActionTypes.UpsertGroup;

  constructor(public payload: { group: GroupInterface }) {}
}

export class AddGroups implements Action {
  readonly type = GroupsActionTypes.AddGroups;

  constructor(public payload: { groups: GroupInterface[] }) {}
}

export class UpsertGroups implements Action {
  readonly type = GroupsActionTypes.UpsertGroups;

  constructor(public payload: { groups: GroupInterface[] }) {}
}

export class UpdateGroup implements Action {
  readonly type = GroupsActionTypes.UpdateGroup;

  constructor(public payload: { group: Update<GroupInterface> }) {}
}

export class UpdateGroups implements Action {
  readonly type = GroupsActionTypes.UpdateGroups;

  constructor(public payload: { groups: Update<GroupInterface>[] }) {}
}

export class DeleteGroup implements Action {
  readonly type = GroupsActionTypes.DeleteGroup;

  constructor(public payload: { id: number }) {}
}

export class DeleteGroups implements Action {
  readonly type = GroupsActionTypes.DeleteGroups;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearGroups implements Action {
  readonly type = GroupsActionTypes.ClearGroups;
}

export type GroupsActions =
  | LoadGroups
  | GroupsLoaded
  | GroupsLoadError
  | AddGroup
  | UpsertGroup
  | AddGroups
  | UpsertGroups
  | UpdateGroup
  | UpdateGroups
  | DeleteGroup
  | DeleteGroups
  | ClearGroups;
