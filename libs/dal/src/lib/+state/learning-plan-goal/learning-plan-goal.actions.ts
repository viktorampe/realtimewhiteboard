import { Action } from '@ngrx/store';
import { LearningPlanGoalInterface } from '../../+models';

export enum LearningPlanGoalsActionTypes {
  LearningPlanGoalsLoadError = '[LearningPlanGoals] Load Error',
  LoadLearningPlanGoalsForBook = '[LearningPlanGoals] Load LearningPlanGoals for Book',
  AddLearningPlanGoalsForBook = '[LearningPlanGoals] Add LearningPlanGoals for Book',
  AddLoadedBook = '[LearningPlanGoals] Add loaded Book',
  ClearLearningPlanGoals = '[LearningPlanGoals] Clear LearningPlanGoals',
  ClearLoadedBooks = '[EduContentTocs] Clear loaded Books'
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

export class AddLoadedBook implements Action {
  readonly type = LearningPlanGoalsActionTypes.AddLoadedBook;

  constructor(public payload: { bookId: number }) {}
}

export class ClearLearningPlanGoals implements Action {
  readonly type = LearningPlanGoalsActionTypes.ClearLearningPlanGoals;
}

export class ClearLoadedBooks implements Action {
  readonly type = LearningPlanGoalsActionTypes.ClearLoadedBooks;
}

export type LearningPlanGoalsActions =
  | LoadLearningPlanGoalsForBook
  | LearningPlanGoalsLoadError
  | AddLearningPlanGoalsForBook
  | AddLoadedBook
  | ClearLearningPlanGoals
  | ClearLoadedBooks;
