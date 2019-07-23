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

export class ClearEduContentBooks implements Action {
  readonly type = EduContentBooksActionTypes.ClearEduContentBooks;
}

export type EduContentBooksActions =
  | LoadEduContentBooks
  | EduContentBooksLoaded
  | EduContentBooksLoadError
  | ClearEduContentBooks;
