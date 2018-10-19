import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { LearningAreaInterface } from '../../+models';

export enum LearningAreasActionTypes {
  LearningAreasLoaded = '[LearningAreas] LearningAreas Loaded',
  LearningAreasLoadError = '[LearningAreas] Load Error',
  LoadLearningAreas = '[LearningAreas] Load LearningAreas',
  AddLearningArea = '[LearningAreas] Add LearningArea',
  UpsertLearningArea = '[LearningAreas] Upsert LearningArea',
  AddLearningAreas = '[LearningAreas] Add LearningAreas',
  UpsertLearningAreas = '[LearningAreas] Upsert LearningAreas',
  UpdateLearningArea = '[LearningAreas] Update LearningArea',
  UpdateLearningAreas = '[LearningAreas] Update LearningAreas',
  DeleteLearningArea = '[LearningAreas] Delete LearningArea',
  DeleteLearningAreas = '[LearningAreas] Delete LearningAreas',
  ClearLearningAreas = '[LearningAreas] Clear LearningAreas'
}

export class LoadLearningAreas implements Action {
  readonly type = LearningAreasActionTypes.LoadLearningAreas;

  constructor(public payload: { force?: boolean } = {}) {}
}

export class LearningAreasLoaded implements Action {
  readonly type = LearningAreasActionTypes.LearningAreasLoaded;

  constructor(public payload: { learningAreas: LearningAreaInterface[] }) {}
}

export class LearningAreasLoadError implements Action {
  readonly type = LearningAreasActionTypes.LearningAreasLoadError;
  constructor(public payload: any) {}
}

export class AddLearningArea implements Action {
  readonly type = LearningAreasActionTypes.AddLearningArea;

  constructor(public payload: { learningArea: LearningAreaInterface }) {}
}

export class UpsertLearningArea implements Action {
  readonly type = LearningAreasActionTypes.UpsertLearningArea;

  constructor(public payload: { learningArea: LearningAreaInterface }) {}
}

export class AddLearningAreas implements Action {
  readonly type = LearningAreasActionTypes.AddLearningAreas;

  constructor(public payload: { learningAreas: LearningAreaInterface[] }) {}
}

export class UpsertLearningAreas implements Action {
  readonly type = LearningAreasActionTypes.UpsertLearningAreas;

  constructor(public payload: { learningAreas: LearningAreaInterface[] }) {}
}

export class UpdateLearningArea implements Action {
  readonly type = LearningAreasActionTypes.UpdateLearningArea;

  constructor(
    public payload: { learningArea: Update<LearningAreaInterface> }
  ) {}
}

export class UpdateLearningAreas implements Action {
  readonly type = LearningAreasActionTypes.UpdateLearningAreas;

  constructor(
    public payload: { learningAreas: Update<LearningAreaInterface>[] }
  ) {}
}

export class DeleteLearningArea implements Action {
  readonly type = LearningAreasActionTypes.DeleteLearningArea;

  constructor(public payload: { id: number }) {}
}

export class DeleteLearningAreas implements Action {
  readonly type = LearningAreasActionTypes.DeleteLearningAreas;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearLearningAreas implements Action {
  readonly type = LearningAreasActionTypes.ClearLearningAreas;
}

export type LearningAreasActions =
  | LoadLearningAreas
  | LearningAreasLoaded
  | LearningAreasLoadError
  | AddLearningArea
  | UpsertLearningArea
  | AddLearningAreas
  | UpsertLearningAreas
  | UpdateLearningArea
  | UpdateLearningAreas
  | DeleteLearningArea
  | DeleteLearningAreas
  | ClearLearningAreas;
