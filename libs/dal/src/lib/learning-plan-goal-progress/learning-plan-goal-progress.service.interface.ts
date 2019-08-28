import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { LearningPlanGoalProgressInterface } from '../+models';
import {
  MinimalLearningPlanGoalProgressEduContentTocInterface,
  MinimalLearningPlanGoalProgressUserLessonInterface
} from '../+state/learning-plan-goal-progress/learning-plan-goal-progress.actions';

export const LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN = new InjectionToken(
  'LearningPlanGoalProgressService'
);

export interface LearningPlanGoalProgressServiceInterface {
  getAllForUser(
    userId: number
  ): Observable<LearningPlanGoalProgressInterface[]>;

  deleteLearningPlanGoalProgress(
    userId: number,
    learningPlanGoalProgressId: number
  ): Observable<boolean>;

  deleteLearningPlanGoalProgresses(
    userId: number,
    learningPlanGoalProgressIds: number[]
  ): Observable<boolean>;

  createLearningPlanGoalProgress(
    userId: number,
    classGroupId: number,
    learningPlanGoalIds: number[],
    eduContentBookId: number,
    userLessonId?: number,
    eduContentTOCId?: number
  ): Observable<LearningPlanGoalProgressInterface[]>;

  createLearningPlanGoalProgresses(
    userId: number,
    learninGoalProgresses: (
      | MinimalLearningPlanGoalProgressEduContentTocInterface
      | MinimalLearningPlanGoalProgressUserLessonInterface)[]
  ): Observable<LearningPlanGoalProgressInterface[]>;
}
