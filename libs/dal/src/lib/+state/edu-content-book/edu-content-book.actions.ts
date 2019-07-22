import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { EduContentBookInterface } from '../../+models';

export enum EduContentBooksActionTypes {
  EduContentBooksLoaded = '[EduContentBooks] EduContentBooks Loaded',
  EduContentBooksLoadError = '[EduContentBooks] Load Error',
  LoadEduContentBooks = '[EduContentBooks] Load EduContentBooks',
  AddEduContentBook = '[EduContentBooks] Add EduContentBook',
  UpsertEduContentBook = '[EduContentBooks] Upsert EduContentBook',
  AddEduContentBooks = '[EduContentBooks] Add EduContentBooks',
  UpsertEduContentBooks = '[EduContentBooks] Upsert EduContentBooks',
  UpdateEduContentBook = '[EduContentBooks] Update EduContentBook',
  UpdateEduContentBooks = '[EduContentBooks] Update EduContentBooks',
  DeleteEduContentBook = '[EduContentBooks] Delete EduContentBook',
  DeleteEduContentBooks = '[EduContentBooks] Delete EduContentBooks',
  ClearEduContentBooks = '[EduContentBooks] Clear EduContentBooks'
}

export class LoadEduContentBooks implements Action {
  readonly type = EduContentBooksActionTypes.LoadEduContentBooks;

  constructor(
    public payload: { force?: boolean; methodIds: number[] } = { methodIds: [] }
  ) {}
}

export class EduContentBooksLoaded implements Action {
  readonly type = EduContentBooksActionTypes.EduContentBooksLoaded;

  constructor(public payload: { eduContentBooks: EduContentBookInterface[] }) {}
}

export class EduContentBooksLoadError implements Action {
  readonly type = EduContentBooksActionTypes.EduContentBooksLoadError;
  constructor(public payload: any) {}
}

export class AddEduContentBook implements Action {
  readonly type = EduContentBooksActionTypes.AddEduContentBook;

  constructor(public payload: { eduContentBook: EduContentBookInterface }) {}
}

export class UpsertEduContentBook implements Action {
  readonly type = EduContentBooksActionTypes.UpsertEduContentBook;

  constructor(public payload: { eduContentBook: EduContentBookInterface }) {}
}

export class AddEduContentBooks implements Action {
  readonly type = EduContentBooksActionTypes.AddEduContentBooks;

  constructor(public payload: { eduContentBooks: EduContentBookInterface[] }) {}
}

export class UpsertEduContentBooks implements Action {
  readonly type = EduContentBooksActionTypes.UpsertEduContentBooks;

  constructor(public payload: { eduContentBooks: EduContentBookInterface[] }) {}
}

export class UpdateEduContentBook implements Action {
  readonly type = EduContentBooksActionTypes.UpdateEduContentBook;

  constructor(
    public payload: { eduContentBook: Update<EduContentBookInterface> }
  ) {}
}

export class UpdateEduContentBooks implements Action {
  readonly type = EduContentBooksActionTypes.UpdateEduContentBooks;

  constructor(
    public payload: { eduContentBooks: Update<EduContentBookInterface>[] }
  ) {}
}

export class DeleteEduContentBook implements Action {
  readonly type = EduContentBooksActionTypes.DeleteEduContentBook;

  constructor(public payload: { id: number }) {}
}

export class DeleteEduContentBooks implements Action {
  readonly type = EduContentBooksActionTypes.DeleteEduContentBooks;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearEduContentBooks implements Action {
  readonly type = EduContentBooksActionTypes.ClearEduContentBooks;
}

export type EduContentBooksActions =
  | LoadEduContentBooks
  | EduContentBooksLoaded
  | EduContentBooksLoadError
  | AddEduContentBook
  | UpsertEduContentBook
  | AddEduContentBooks
  | UpsertEduContentBooks
  | UpdateEduContentBook
  | UpdateEduContentBooks
  | DeleteEduContentBook
  | DeleteEduContentBooks
  | ClearEduContentBooks;
