import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { LearningPlanGoalInterface } from '../../+models';

export enum LearningPlanGoalsActionTypes {
  LearningPlanGoalsLoaded = '[LearningPlanGoals] LearningPlanGoals Loaded',
  LearningPlanGoalsLoadError = '[LearningPlanGoals] Load Error',
  LoadLearningPlanGoals = '[LearningPlanGoals] Load LearningPlanGoals',
  AddLearningPlanGoal = '[LearningPlanGoals] Add LearningPlanGoal',
  UpsertLearningPlanGoal = '[LearningPlanGoals] Upsert LearningPlanGoal',
  AddLearningPlanGoals = '[LearningPlanGoals] Add LearningPlanGoals',
  UpsertLearningPlanGoals = '[LearningPlanGoals] Upsert LearningPlanGoals',
  UpdateLearningPlanGoal = '[LearningPlanGoals] Update LearningPlanGoal',
  UpdateLearningPlanGoals = '[LearningPlanGoals] Update LearningPlanGoals',
  DeleteLearningPlanGoal = '[LearningPlanGoals] Delete LearningPlanGoal',
  DeleteLearningPlanGoals = '[LearningPlanGoals] Delete LearningPlanGoals',
  ClearLearningPlanGoals = '[LearningPlanGoals] Clear LearningPlanGoals'
}

export class LoadLearningPlanGoals implements Action {
  readonly type = LearningPlanGoalsActionTypes.LoadLearningPlanGoals;

  constructor(
    public payload: { force?: boolean, userId: number } = { userId: null }
  ) {}
}

export class LearningPlanGoalsLoaded implements Action {
  readonly type = LearningPlanGoalsActionTypes.LearningPlanGoalsLoaded;

  constructor(public payload: { learningPlanGoals: LearningPlanGoalInterface[] }) {}
}

export class LearningPlanGoalsLoadError implements Action {
  readonly type = LearningPlanGoalsActionTypes.LearningPlanGoalsLoadError;
  constructor(public payload: any) {}
}

export class AddLearningPlanGoal implements Action {
  readonly type = LearningPlanGoalsActionTypes.AddLearningPlanGoal;

  constructor(public payload: { learningPlanGoal: LearningPlanGoalInterface }) {}
}

export class UpsertLearningPlanGoal implements Action {
  readonly type = LearningPlanGoalsActionTypes.UpsertLearningPlanGoal;

  constructor(public payload: { learningPlanGoal: LearningPlanGoalInterface }) {}
}

export class AddLearningPlanGoals implements Action {
  readonly type = LearningPlanGoalsActionTypes.AddLearningPlanGoals;

  constructor(public payload: { learningPlanGoals: LearningPlanGoalInterface[] }) {}
}

export class UpsertLearningPlanGoals implements Action {
  readonly type = LearningPlanGoalsActionTypes.UpsertLearningPlanGoals;

  constructor(public payload: { learningPlanGoals: LearningPlanGoalInterface[] }) {}
}

export class UpdateLearningPlanGoal implements Action {
  readonly type = LearningPlanGoalsActionTypes.UpdateLearningPlanGoal;

  constructor(public payload: { learningPlanGoal: Update<LearningPlanGoalInterface> }) {}
}

export class UpdateLearningPlanGoals implements Action {
  readonly type = LearningPlanGoalsActionTypes.UpdateLearningPlanGoals;

  constructor(public payload: { learningPlanGoals: Update<LearningPlanGoalInterface>[] }) {}
}

export class DeleteLearningPlanGoal implements Action {
  readonly type = LearningPlanGoalsActionTypes.DeleteLearningPlanGoal;

  constructor(public payload: { id: number }) {}
}

export class DeleteLearningPlanGoals implements Action {
  readonly type = LearningPlanGoalsActionTypes.DeleteLearningPlanGoals;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearLearningPlanGoals implements Action {
  readonly type = LearningPlanGoalsActionTypes.ClearLearningPlanGoals;
}

export type LearningPlanGoalsActions =
  | LoadLearningPlanGoals
  | LearningPlanGoalsLoaded
  | LearningPlanGoalsLoadError
  | AddLearningPlanGoal
  | UpsertLearningPlanGoal
  | AddLearningPlanGoals
  | UpsertLearningPlanGoals
  | UpdateLearningPlanGoal
  | UpdateLearningPlanGoals
  | DeleteLearningPlanGoal
  | DeleteLearningPlanGoals
  | ClearLearningPlanGoals;
