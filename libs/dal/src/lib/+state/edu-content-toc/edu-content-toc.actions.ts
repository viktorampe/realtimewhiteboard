import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { EduContentTOCInterface } from '../../+models';

export enum EduContentTocsActionTypes {
  EduContentTocsLoadError = '[EduContentTocs] Load Error',
  LoadEduContentTocsForBook = '[EduContentTocs] Load EduContentTocs for Book',
  AddEduContentTocsForBook = '[EduContentTocs] Add EduContentTocs for Book',
  AddLoadedBook = '[EduContentTocs] Add loaded Book',
  AddEduContentToc = '[EduContentTocs] Add EduContentToc',
  UpsertEduContentToc = '[EduContentTocs] Upsert EduContentToc',
  UpsertEduContentTocs = '[EduContentTocs] Upsert EduContentTocs',
  UpdateEduContentToc = '[EduContentTocs] Update EduContentToc',
  UpdateEduContentTocs = '[EduContentTocs] Update EduContentTocs',
  DeleteEduContentToc = '[EduContentTocs] Delete EduContentToc',
  DeleteEduContentTocs = '[EduContentTocs] Delete EduContentTocs',
  ClearEduContentTocs = '[EduContentTocs] Clear EduContentTocs',
  ClearLoadedBooks = '[EduContentTocs] Clear loaded Books'
}

export class EduContentTocsLoadError implements Action {
  readonly type = EduContentTocsActionTypes.EduContentTocsLoadError;
  constructor(public payload: any) {}
}

export class LoadEduContentTocsForBook implements Action {
  readonly type = EduContentTocsActionTypes.LoadEduContentTocsForBook;

  constructor(public payload: { bookId: number }) {}
}

export class AddEduContentTocsForBook implements Action {
  readonly type = EduContentTocsActionTypes.AddEduContentTocsForBook;

  constructor(
    public payload: { bookId: number; eduContentTocs: EduContentTOCInterface[] }
  ) {}
}

export class AddLoadedBook implements Action {
  readonly type = EduContentTocsActionTypes.AddLoadedBook;

  constructor(public payload: { bookId: number }) {}
}

export class AddEduContentToc implements Action {
  readonly type = EduContentTocsActionTypes.AddEduContentToc;

  constructor(public payload: { eduContentToc: EduContentTOCInterface }) {}
}

export class UpsertEduContentToc implements Action {
  readonly type = EduContentTocsActionTypes.UpsertEduContentToc;

  constructor(public payload: { eduContentToc: EduContentTOCInterface }) {}
}

export class UpsertEduContentTocs implements Action {
  readonly type = EduContentTocsActionTypes.UpsertEduContentTocs;

  constructor(public payload: { eduContentTocs: EduContentTOCInterface[] }) {}
}

export class UpdateEduContentToc implements Action {
  readonly type = EduContentTocsActionTypes.UpdateEduContentToc;

  constructor(
    public payload: { eduContentToc: Update<EduContentTOCInterface> }
  ) {}
}

export class UpdateEduContentTocs implements Action {
  readonly type = EduContentTocsActionTypes.UpdateEduContentTocs;

  constructor(
    public payload: { eduContentTocs: Update<EduContentTOCInterface>[] }
  ) {}
}

export class DeleteEduContentToc implements Action {
  readonly type = EduContentTocsActionTypes.DeleteEduContentToc;

  constructor(public payload: { id: number }) {}
}

export class DeleteEduContentTocs implements Action {
  readonly type = EduContentTocsActionTypes.DeleteEduContentTocs;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearEduContentTocs implements Action {
  readonly type = EduContentTocsActionTypes.ClearEduContentTocs;
}

export class ClearLoadedBooks implements Action {
  readonly type = EduContentTocsActionTypes.ClearLoadedBooks;
}

export type EduContentTocsActions =
  | EduContentTocsLoadError
  | LoadEduContentTocsForBook
  | AddEduContentTocsForBook
  | AddLoadedBook
  | AddEduContentToc
  | UpsertEduContentToc
  | UpsertEduContentTocs
  | UpdateEduContentToc
  | UpdateEduContentTocs
  | DeleteEduContentToc
  | DeleteEduContentTocs
  | ClearEduContentTocs
  | ClearLoadedBooks;
