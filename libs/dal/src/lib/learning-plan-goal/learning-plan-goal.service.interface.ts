import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { LearningPlanGoalInterface } from '../+models';

export const LEARNING_PLAN_GOAL_SERVICE_TOKEN = new InjectionToken(
  'LearningPlanGoalService'
);

export interface LearningPlanGoalServiceInterface {
  getLearningPlanGoalsForBook(
    userId: number,
    bookId: number
  ): Observable<LearningPlanGoalInterface[]>;
}
