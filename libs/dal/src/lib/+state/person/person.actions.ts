import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { PersonInterface } from '../../+models';

export enum PersonsActionTypes {
  PersonsLoaded = '[Persons] Persons Loaded',
  PersonsLoadError = '[Persons] Load Error',
  LoadPersons = '[Persons] Load Persons',
  AddPerson = '[Persons] Add Person',
  UpsertPerson = '[Persons] Upsert Person',
  AddPersons = '[Persons] Add Persons',
  UpsertPersons = '[Persons] Upsert Persons',
  UpdatePerson = '[Persons] Update Person',
  UpdatePersons = '[Persons] Update Persons',
  DeletePerson = '[Persons] Delete Person',
  DeletePersons = '[Persons] Delete Persons',
  ClearPersons = '[Persons] Clear Persons'
}

export class LoadPersons implements Action {
  readonly type = PersonsActionTypes.LoadPersons;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class PersonsLoaded implements Action {
  readonly type = PersonsActionTypes.PersonsLoaded;

  constructor(public payload: { persons: PersonInterface[] }) {}
}

export class PersonsLoadError implements Action {
  readonly type = PersonsActionTypes.PersonsLoadError;
  constructor(public payload: any) {}
}

export class AddPerson implements Action {
  readonly type = PersonsActionTypes.AddPerson;

  constructor(public payload: { person: PersonInterface }) {}
}

export class UpsertPerson implements Action {
  readonly type = PersonsActionTypes.UpsertPerson;

  constructor(public payload: { person: PersonInterface }) {}
}

export class AddPersons implements Action {
  readonly type = PersonsActionTypes.AddPersons;

  constructor(public payload: { persons: PersonInterface[] }) {}
}

export class UpsertPersons implements Action {
  readonly type = PersonsActionTypes.UpsertPersons;

  constructor(public payload: { persons: PersonInterface[] }) {}
}

export class UpdatePerson implements Action {
  readonly type = PersonsActionTypes.UpdatePerson;

  constructor(public payload: { person: Update<PersonInterface> }) {}
}

export class UpdatePersons implements Action {
  readonly type = PersonsActionTypes.UpdatePersons;

  constructor(public payload: { persons: Update<PersonInterface>[] }) {}
}

export class DeletePerson implements Action {
  readonly type = PersonsActionTypes.DeletePerson;

  constructor(public payload: { id: number }) {}
}

export class DeletePersons implements Action {
  readonly type = PersonsActionTypes.DeletePersons;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearPersons implements Action {
  readonly type = PersonsActionTypes.ClearPersons;
}

export type PersonsActions =
  | LoadPersons
  | PersonsLoaded
  | PersonsLoadError
  | AddPerson
  | UpsertPerson
  | AddPersons
  | UpsertPersons
  | UpdatePerson
  | UpdatePersons
  | DeletePerson
  | DeletePersons
  | ClearPersons;
