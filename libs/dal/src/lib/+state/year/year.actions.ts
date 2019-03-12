import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { YearInterface } from '../../+models';

export enum YearsActionTypes {
  YearsLoaded = '[Years] Years Loaded',
  YearsLoadError = '[Years] Load Error',
  LoadYears = '[Years] Load Years',
  AddYear = '[Years] Add Year',
  UpsertYear = '[Years] Upsert Year',
  AddYears = '[Years] Add Years',
  UpsertYears = '[Years] Upsert Years',
  UpdateYear = '[Years] Update Year',
  UpdateYears = '[Years] Update Years',
  DeleteYear = '[Years] Delete Year',
  DeleteYears = '[Years] Delete Years',
  ClearYears = '[Years] Clear Years'
}

export class LoadYears implements Action {
  readonly type = YearsActionTypes.LoadYears;

  constructor(
    public payload: { force?: boolean, userId: number } = { userId: null }
  ) {}
}

export class YearsLoaded implements Action {
  readonly type = YearsActionTypes.YearsLoaded;

  constructor(public payload: { years: YearInterface[] }) {}
}

export class YearsLoadError implements Action {
  readonly type = YearsActionTypes.YearsLoadError;
  constructor(public payload: any) {}
}

export class AddYear implements Action {
  readonly type = YearsActionTypes.AddYear;

  constructor(public payload: { year: YearInterface }) {}
}

export class UpsertYear implements Action {
  readonly type = YearsActionTypes.UpsertYear;

  constructor(public payload: { year: YearInterface }) {}
}

export class AddYears implements Action {
  readonly type = YearsActionTypes.AddYears;

  constructor(public payload: { years: YearInterface[] }) {}
}

export class UpsertYears implements Action {
  readonly type = YearsActionTypes.UpsertYears;

  constructor(public payload: { years: YearInterface[] }) {}
}

export class UpdateYear implements Action {
  readonly type = YearsActionTypes.UpdateYear;

  constructor(public payload: { year: Update<YearInterface> }) {}
}

export class UpdateYears implements Action {
  readonly type = YearsActionTypes.UpdateYears;

  constructor(public payload: { years: Update<YearInterface>[] }) {}
}

export class DeleteYear implements Action {
  readonly type = YearsActionTypes.DeleteYear;

  constructor(public payload: { id: number }) {}
}

export class DeleteYears implements Action {
  readonly type = YearsActionTypes.DeleteYears;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearYears implements Action {
  readonly type = YearsActionTypes.ClearYears;
}

export type YearsActions =
  | LoadYears
  | YearsLoaded
  | YearsLoadError
  | AddYear
  | UpsertYear
  | AddYears
  | UpsertYears
  | UpdateYear
  | UpdateYears
  | DeleteYear
  | DeleteYears
  | ClearYears;
