import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { UnlockedBoekeStudentInterface } from '../../+models';

export enum UnlockedBoekeStudentsActionTypes {
  UnlockedBoekeStudentsLoaded = '[UnlockedBoekeStudents] UnlockedBoekeStudents Loaded',
  UnlockedBoekeStudentsLoadError = '[UnlockedBoekeStudents] Load Error',
  LoadUnlockedBoekeStudents = '[UnlockedBoekeStudents] Load UnlockedBoekeStudents',
  AddUnlockedBoekeStudent = '[UnlockedBoekeStudents] Add UnlockedBoekeStudent',
  UpsertUnlockedBoekeStudent = '[UnlockedBoekeStudents] Upsert UnlockedBoekeStudent',
  AddUnlockedBoekeStudents = '[UnlockedBoekeStudents] Add UnlockedBoekeStudents',
  UpsertUnlockedBoekeStudents = '[UnlockedBoekeStudents] Upsert UnlockedBoekeStudents',
  UpdateUnlockedBoekeStudent = '[UnlockedBoekeStudents] Update UnlockedBoekeStudent',
  UpdateUnlockedBoekeStudents = '[UnlockedBoekeStudents] Update UnlockedBoekeStudents',
  DeleteUnlockedBoekeStudent = '[UnlockedBoekeStudents] Delete UnlockedBoekeStudent',
  DeleteUnlockedBoekeStudents = '[UnlockedBoekeStudents] Delete UnlockedBoekeStudents',
  ClearUnlockedBoekeStudents = '[UnlockedBoekeStudents] Clear UnlockedBoekeStudents'
}

export class LoadUnlockedBoekeStudents implements Action {
  readonly type = UnlockedBoekeStudentsActionTypes.LoadUnlockedBoekeStudents;

  constructor(public payload: { force?: boolean }) {}
}

export class UnlockedBoekeStudentsLoaded implements Action {
  readonly type = UnlockedBoekeStudentsActionTypes.UnlockedBoekeStudentsLoaded;

  constructor(public payload: { unlockedBoekeStudents: UnlockedBoekeStudentInterface[] }) {}
}

export class UnlockedBoekeStudentsLoadError implements Action {
  readonly type = UnlockedBoekeStudentsActionTypes.UnlockedBoekeStudentsLoadError;
  constructor(public payload: any) {}
}

export class AddUnlockedBoekeStudent implements Action {
  readonly type = UnlockedBoekeStudentsActionTypes.AddUnlockedBoekeStudent;

  constructor(public payload: { unlockedBoekeStudent: UnlockedBoekeStudentInterface }) {}
}

export class UpsertUnlockedBoekeStudent implements Action {
  readonly type = UnlockedBoekeStudentsActionTypes.UpsertUnlockedBoekeStudent;

  constructor(public payload: { unlockedBoekeStudent: UnlockedBoekeStudentInterface }) {}
}

export class AddUnlockedBoekeStudents implements Action {
  readonly type = UnlockedBoekeStudentsActionTypes.AddUnlockedBoekeStudents;

  constructor(public payload: { unlockedBoekeStudents: UnlockedBoekeStudentInterface[] }) {}
}

export class UpsertUnlockedBoekeStudents implements Action {
  readonly type = UnlockedBoekeStudentsActionTypes.UpsertUnlockedBoekeStudents;

  constructor(public payload: { unlockedBoekeStudents: UnlockedBoekeStudentInterface[] }) {}
}

export class UpdateUnlockedBoekeStudent implements Action {
  readonly type = UnlockedBoekeStudentsActionTypes.UpdateUnlockedBoekeStudent;

  constructor(public payload: { unlockedBoekeStudent: Update<UnlockedBoekeStudentInterface> }) {}
}

export class UpdateUnlockedBoekeStudents implements Action {
  readonly type = UnlockedBoekeStudentsActionTypes.UpdateUnlockedBoekeStudents;

  constructor(public payload: { unlockedBoekeStudents: Update<UnlockedBoekeStudentInterface>[] }) {}
}

export class DeleteUnlockedBoekeStudent implements Action {
  readonly type = UnlockedBoekeStudentsActionTypes.DeleteUnlockedBoekeStudent;

  constructor(public payload: { id: number }) {}
}

export class DeleteUnlockedBoekeStudents implements Action {
  readonly type = UnlockedBoekeStudentsActionTypes.DeleteUnlockedBoekeStudents;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearUnlockedBoekeStudents implements Action {
  readonly type = UnlockedBoekeStudentsActionTypes.ClearUnlockedBoekeStudents;
}

export type UnlockedBoekeStudentsActions =
  | LoadUnlockedBoekeStudents
  | UnlockedBoekeStudentsLoaded
  | UnlockedBoekeStudentsLoadError
  | AddUnlockedBoekeStudent
  | UpsertUnlockedBoekeStudent
  | AddUnlockedBoekeStudents
  | UpsertUnlockedBoekeStudents
  | UpdateUnlockedBoekeStudent
  | UpdateUnlockedBoekeStudents
  | DeleteUnlockedBoekeStudent
  | DeleteUnlockedBoekeStudents
  | ClearUnlockedBoekeStudents;
