import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { ContentStatusInterface } from '../../+models';

export enum ContentStatusesActionTypes {
  ContentStatusesLoaded = '[ContentStatuses] ContentStatuses Loaded',
  ContentStatusesLoadError = '[ContentStatuses] Load Error',
  LoadContentStatuses = '[ContentStatuses] Load ContentStatuses',
  AddContentStatus = '[ContentStatuses] Add ContentStatus',
  UpsertContentStatus = '[ContentStatuses] Upsert ContentStatus',
  AddContentStatuses = '[ContentStatuses] Add ContentStatuses',
  UpsertContentStatuses = '[ContentStatuses] Upsert ContentStatuses',
  UpdateContentStatus = '[ContentStatuses] Update ContentStatus',
  UpdateContentStatuses = '[ContentStatuses] Update ContentStatuses',
  DeleteContentStatus = '[ContentStatuses] Delete ContentStatus',
  DeleteContentStatuses = '[ContentStatuses] Delete ContentStatuses',
  ClearContentStatuses = '[ContentStatuses] Clear ContentStatuses'
}

export class LoadContentStatuses implements Action {
  readonly type = ContentStatusesActionTypes.LoadContentStatuses;

  constructor(public payload: { force?: boolean }) {}
}

export class ContentStatusesLoaded implements Action {
  readonly type = ContentStatusesActionTypes.ContentStatusesLoaded;

  constructor(public payload: { contentStatuses: ContentStatusInterface[] }) {}
}

export class ContentStatusesLoadError implements Action {
  readonly type = ContentStatusesActionTypes.ContentStatusesLoadError;
  constructor(public payload: any) {}
}

export class AddContentStatus implements Action {
  readonly type = ContentStatusesActionTypes.AddContentStatus;

  constructor(public payload: { contentStatus: ContentStatusInterface }) {}
}

export class UpsertContentStatus implements Action {
  readonly type = ContentStatusesActionTypes.UpsertContentStatus;

  constructor(public payload: { contentStatus: ContentStatusInterface }) {}
}

export class AddContentStatuses implements Action {
  readonly type = ContentStatusesActionTypes.AddContentStatuses;

  constructor(public payload: { contentStatuses: ContentStatusInterface[] }) {}
}

export class UpsertContentStatuses implements Action {
  readonly type = ContentStatusesActionTypes.UpsertContentStatuses;

  constructor(public payload: { contentStatuses: ContentStatusInterface[] }) {}
}

export class UpdateContentStatus implements Action {
  readonly type = ContentStatusesActionTypes.UpdateContentStatus;

  constructor(
    public payload: { contentStatus: Update<ContentStatusInterface> }
  ) {}
}

export class UpdateContentStatuses implements Action {
  readonly type = ContentStatusesActionTypes.UpdateContentStatuses;

  constructor(
    public payload: { contentStatuses: Update<ContentStatusInterface>[] }
  ) {}
}

export class DeleteContentStatus implements Action {
  readonly type = ContentStatusesActionTypes.DeleteContentStatus;

  constructor(public payload: { id: number }) {}
}

export class DeleteContentStatuses implements Action {
  readonly type = ContentStatusesActionTypes.DeleteContentStatuses;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearContentStatuses implements Action {
  readonly type = ContentStatusesActionTypes.ClearContentStatuses;
}

export type ContentStatusesActions =
  | LoadContentStatuses
  | ContentStatusesLoaded
  | ContentStatusesLoadError
  | AddContentStatus
  | UpsertContentStatus
  | AddContentStatuses
  | UpsertContentStatuses
  | UpdateContentStatus
  | UpdateContentStatuses
  | DeleteContentStatus
  | DeleteContentStatuses
  | ClearContentStatuses;
