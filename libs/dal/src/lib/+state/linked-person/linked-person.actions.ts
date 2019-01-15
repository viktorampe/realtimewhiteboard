import { Action } from '@ngrx/store';
import { PersonInterface } from '../../+models';

export enum LinkedPersonsActionTypes {
  LinkedPersonsLoaded = '[LinkedPersons] LinkedPersons Loaded',
  LinkedPersonsLoadError = '[LinkedPersons] Load Error',
  LoadLinkedPersons = '[LinkedPersons] Load LinkedPersons',
  AddLinkedPerson = '[LinkedPersons] Add LinkedPerson',
  AddLinkedPersons = '[LinkedPersons] Add LinkedPersons',
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

  constructor(public payload: { persons: PersonInterface[] }) {}
}

export class LinkedPersonsLoadError implements Action {
  readonly type = LinkedPersonsActionTypes.LinkedPersonsLoadError;
  constructor(public payload: any) {}
}

export class AddLinkedPerson implements Action {
  readonly type = LinkedPersonsActionTypes.AddLinkedPerson;

  constructor(public payload: { person: PersonInterface }) {}
}

export class AddLinkedPersons implements Action {
  readonly type = LinkedPersonsActionTypes.AddLinkedPersons;

  constructor(public payload: { persons: PersonInterface[] }) {}
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
  | AddLinkedPersons
  | DeleteLinkedPerson
  | DeleteLinkedPersons
  | ClearLinkedPersons;
