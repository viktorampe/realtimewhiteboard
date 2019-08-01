import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { LearningPlanGoalProgressInterface } from '../+models';

export const LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN = new InjectionToken(
  'LearningPlanGoalProgressService'
);

export interface LearningPlanGoalProgressServiceInterface {
  getAllForUser(userId): Observable<LearningPlanGoalProgressInterface[]>;
}
