import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { UnlockedContentInterface } from '../../+models';
import {
  CustomFeedbackHandlersInterface,
  FeedbackTriggeringAction
} from '../effect-feedback';

export enum UnlockedContentsActionTypes {
  UnlockedContentsLoaded = '[UnlockedContents] UnlockedContents Loaded',
  UnlockedContentsLoadError = '[UnlockedContents] Load Error',
  LoadUnlockedContents = '[UnlockedContents] Load UnlockedContents',
  AddUnlockedContent = '[UnlockedContents] Add UnlockedContent',
  UpsertUnlockedContent = '[UnlockedContents] Upsert UnlockedContent',
  AddUnlockedContents = '[UnlockedContents] Add UnlockedContents',
  UpsertUnlockedContents = '[UnlockedContents] Upsert UnlockedContents',
  UpdateUnlockedContent = '[UnlockedContents] Update UnlockedContent',
  UpdateUnlockedContents = '[UnlockedContents] Update UnlockedContents',
  DeleteUnlockedContent = '[UnlockedContents] Delete UnlockedContent',
  DeleteUnlockedContents = '[UnlockedContents] Delete UnlockedContents',
  ClearUnlockedContents = '[UnlockedContents] Clear UnlockedContents'
}

export class LoadUnlockedContents implements Action {
  readonly type = UnlockedContentsActionTypes.LoadUnlockedContents;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class UnlockedContentsLoaded implements Action {
  readonly type = UnlockedContentsActionTypes.UnlockedContentsLoaded;

  constructor(
    public payload: { unlockedContents: UnlockedContentInterface[] }
  ) {}
}

export class UnlockedContentsLoadError implements Action {
  readonly type = UnlockedContentsActionTypes.UnlockedContentsLoadError;
  constructor(public payload: any) {}
}

export class AddUnlockedContent implements Action {
  readonly type = UnlockedContentsActionTypes.AddUnlockedContent;

  constructor(public payload: { unlockedContent: UnlockedContentInterface }) {}
}

export class UpsertUnlockedContent implements Action {
  readonly type = UnlockedContentsActionTypes.UpsertUnlockedContent;

  constructor(public payload: { unlockedContent: UnlockedContentInterface }) {}
}

export class AddUnlockedContents implements Action {
  readonly type = UnlockedContentsActionTypes.AddUnlockedContents;

  constructor(
    public payload: { unlockedContents: UnlockedContentInterface[] }
  ) {}
}

export class UpsertUnlockedContents implements Action {
  readonly type = UnlockedContentsActionTypes.UpsertUnlockedContents;

  constructor(
    public payload: { unlockedContents: UnlockedContentInterface[] }
  ) {}
}

export class UpdateUnlockedContent implements Action {
  readonly type = UnlockedContentsActionTypes.UpdateUnlockedContent;

  constructor(
    public payload: { unlockedContent: Update<UnlockedContentInterface> }
  ) {}
}

export class UpdateUnlockedContents implements Action {
  readonly type = UnlockedContentsActionTypes.UpdateUnlockedContents;

  constructor(
    public payload: { unlockedContents: Update<UnlockedContentInterface>[] }
  ) {}
}

export class DeleteUnlockedContent implements FeedbackTriggeringAction {
  readonly type = UnlockedContentsActionTypes.DeleteUnlockedContent;

  constructor(
    public payload: {
      id: number;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class DeleteUnlockedContents implements FeedbackTriggeringAction {
  readonly type = UnlockedContentsActionTypes.DeleteUnlockedContents;

  constructor(
    public payload: {
      ids: number[];
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class ClearUnlockedContents implements Action {
  readonly type = UnlockedContentsActionTypes.ClearUnlockedContents;
}

export type UnlockedContentsActions =
  | LoadUnlockedContents
  | UnlockedContentsLoaded
  | UnlockedContentsLoadError
  | AddUnlockedContent
  | UpsertUnlockedContent
  | AddUnlockedContents
  | UpsertUnlockedContents
  | UpdateUnlockedContent
  | UpdateUnlockedContents
  | DeleteUnlockedContent
  | DeleteUnlockedContents
  | ClearUnlockedContents;
