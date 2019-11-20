import { Action } from '@ngrx/store';
import { EduContentBookInterface } from '../../+models';

export enum EduContentBooksActionTypes {
  LoadEduContentBooks = '[EduContentBooks] Load EduContentBooks',
  EduContentBooksLoaded = '[EduContentBooks] EduContentBooks Loaded',
  EduContentBooksLoadError = '[EduContentBooks] Load Error',
  ClearEduContentBooks = '[EduContentBooks] Clear EduContentBooks'
}

export class LoadEduContentBooks implements Action {
  readonly type = EduContentBooksActionTypes.LoadEduContentBooks;

  constructor(
    public payload: { force?: boolean; methodIds: number[] } = { methodIds: [] }
  ) {}
}

export class LoadEduContentBooksFromIds implements Action {
  readonly type = EduContentBooksActionTypes.LoadEduContentBooks;

  constructor(
    public payload: { force?: boolean; bookIds: number[] } = { bookIds: [] }
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
  | LoadEduContentBooksFromIds
  | ClearEduContentBooks;
