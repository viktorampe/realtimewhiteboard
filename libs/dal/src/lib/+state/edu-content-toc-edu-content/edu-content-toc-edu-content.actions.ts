import { Action } from '@ngrx/store';
import { EduContentTOCEduContentInterface } from '../../+models';

export enum EduContentTocEduContentsActionTypes {
  EduContentTocEduContentsLoadError = '[EduContentTocEduContents] Load Error',
  LoadEduContentTocEduContentsForBook = '[EduContentTocEduContents] Load EduContentTocEduContents',
  AddEduContentTocEduContentsForBook = '[EduContentTocs] Add EduContentTocEduContents for Book',
  AddLoadedBook = '[EduContentTocEduContents] Add loaded Book'
}

export class EduContentTocEduContentsLoadError implements Action {
  readonly type =
    EduContentTocEduContentsActionTypes.EduContentTocEduContentsLoadError;
  constructor(public payload: any) {}
}

export class LoadEduContentTocEduContentsForBook implements Action {
  readonly type =
    EduContentTocEduContentsActionTypes.LoadEduContentTocEduContentsForBook;

  constructor(public payload: { bookId: number }) {}
}

export class AddEduContentTocEduContentsForBook implements Action {
  readonly type =
    EduContentTocEduContentsActionTypes.AddEduContentTocEduContentsForBook;

  constructor(
    public payload: {
      bookId: number;
      eduContentTocEduContents: EduContentTOCEduContentInterface[];
    }
  ) {}
}
export class AddLoadedBook implements Action {
  readonly type = EduContentTocEduContentsActionTypes.AddLoadedBook;

  constructor(public payload: { bookId: number }) {}
}

export type EduContentTocEduContentsActions =
  | LoadEduContentTocEduContentsForBook
  | EduContentTocEduContentsLoadError
  | AddEduContentTocEduContentsForBook
  | AddLoadedBook;
