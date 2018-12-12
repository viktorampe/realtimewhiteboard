import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { TeacherStudentInterface } from '../../+models';

export enum LinkedPersonsActionTypes {
  LinkedPersonsLoaded = '[LinkedPersons] LinkedPersons Loaded',
  LinkedPersonsLoadError = '[LinkedPersons] Load Error',
  LoadLinkedPersons = '[LinkedPersons] Load LinkedPersons',
  AddLinkedPerson = '[LinkedPersons] Add LinkedPerson',
  UpsertLinkedPerson = '[LinkedPersons] Upsert LinkedPerson',
  AddLinkedPersons = '[LinkedPersons] Add LinkedPersons',
  UpsertLinkedPersons = '[LinkedPersons] Upsert LinkedPersons',
  UpdateLinkedPerson = '[LinkedPersons] Update LinkedPerson',
  UpdateLinkedPersons = '[LinkedPersons] Update LinkedPersons',
  DeleteLinkedPerson = '[LinkedPersons] Delete LinkedPerson',
  DeleteLinkedPersons = '[LinkedPersons] Delete LinkedPersons',
  ClearLinkedPersons = '[LinkedPersons] Clear LinkedPersons'
}

export class LoadLinkedPersons implements Action {
  readonly type = LinkedPersonsActionTypes.LoadLinkedPersons;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class LinkedPersonsLoaded implements Action {
  readonly type = LinkedPersonsActionTypes.LinkedPersonsLoaded;

  constructor(public payload: { linkedPersons: TeacherStudentInterface[] }) {}
}

export class LinkedPersonsLoadError implements Action {
  readonly type = LinkedPersonsActionTypes.LinkedPersonsLoadError;
  constructor(public payload: any) {}
}

export class AddLinkedPerson implements Action {
  readonly type = LinkedPersonsActionTypes.AddLinkedPerson;

  constructor(public payload: { linkedPerson: TeacherStudentInterface }) {}
}

export class UpsertLinkedPerson implements Action {
  readonly type = LinkedPersonsActionTypes.UpsertLinkedPerson;

  constructor(public payload: { linkedPerson: TeacherStudentInterface }) {}
}

export class AddLinkedPersons implements Action {
  readonly type = LinkedPersonsActionTypes.AddLinkedPersons;

  constructor(public payload: { linkedPersons: TeacherStudentInterface[] }) {}
}

export class UpsertLinkedPersons implements Action {
  readonly type = LinkedPersonsActionTypes.UpsertLinkedPersons;

  constructor(public payload: { linkedPersons: TeacherStudentInterface[] }) {}
}

export class UpdateLinkedPerson implements Action {
  readonly type = LinkedPersonsActionTypes.UpdateLinkedPerson;

  constructor(
    public payload: { linkedPerson: Update<TeacherStudentInterface> }
  ) {}
}

export class UpdateLinkedPersons implements Action {
  readonly type = LinkedPersonsActionTypes.UpdateLinkedPersons;

  constructor(
    public payload: { linkedPersons: Update<TeacherStudentInterface>[] }
  ) {}
}

export class DeleteLinkedPerson implements Action {
  readonly type = LinkedPersonsActionTypes.DeleteLinkedPerson;

  constructor(public payload: { id: number }) {}
}

export class DeleteLinkedPersons implements Action {
  readonly type = LinkedPersonsActionTypes.DeleteLinkedPersons;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearLinkedPersons implements Action {
  readonly type = LinkedPersonsActionTypes.ClearLinkedPersons;
}

export type LinkedPersonsActions =
  | LoadLinkedPersons
  | LinkedPersonsLoaded
  | LinkedPersonsLoadError
  | AddLinkedPerson
  | UpsertLinkedPerson
  | AddLinkedPersons
  | UpsertLinkedPersons
  | UpdateLinkedPerson
  | UpdateLinkedPersons
  | DeleteLinkedPerson
  | DeleteLinkedPersons
  | ClearLinkedPersons;
