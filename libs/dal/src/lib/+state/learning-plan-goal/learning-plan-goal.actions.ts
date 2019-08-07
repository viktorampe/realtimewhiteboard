import { Action } from '@ngrx/store';
import { LearningPlanGoalInterface } from '../../+models';

export enum LearningPlanGoalsActionTypes {
  LearningPlanGoalsLoadError = '[LearningPlanGoals] Load Error',
  LoadLearningPlanGoalsForBook = '[LearningPlanGoals] Load LearningPlanGoals for Book',
  AddLearningPlanGoalsForBook = '[LearningPlanGoals] Add LearningPlanGoals for Book',
  ClearLearningPlanGoals = '[LearningPlanGoals] Clear LearningPlanGoals'
}

export class LearningPlanGoalsLoadError implements Action {
  readonly type = LearningPlanGoalsActionTypes.LearningPlanGoalsLoadError;
  constructor(public payload: any) {}
}

export class LoadLearningPlanGoalsForBook implements Action {
  readonly type = LearningPlanGoalsActionTypes.LoadLearningPlanGoalsForBook;

  constructor(
    public payload: { bookId: number; userId: number } = {
      bookId: null,
      userId: null
    }
  ) {}
}

export class AddLearningPlanGoalsForBook implements Action {
  readonly type = LearningPlanGoalsActionTypes.AddLearningPlanGoalsForBook;

  constructor(
    public payload: {
      bookId: number;
      learningPlanGoals: LearningPlanGoalInterface[];
    }
  ) {}
}

export class ClearLearningPlanGoals implements Action {
  readonly type = LearningPlanGoalsActionTypes.ClearLearningPlanGoals;
}

export type LearningPlanGoalsActions =
  | LoadLearningPlanGoalsForBook
  | LearningPlanGoalsLoadError
  | AddLearningPlanGoalsForBook
  | ClearLearningPlanGoals;
