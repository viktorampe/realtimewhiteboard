import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { LearningPlanGoalProgressInterface } from '../+models';

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

  bulkCreateLearningPlanGoalProgress(
    userId: number,
    classGroupId: number,
    eduContentTOCId: number,
    learningPlanGoalIds: number[]
  ): Observable<LearningPlanGoalProgressInterface[]>;

  createLearningPlanGoalProgressForUserLesson(
    userId: number,
    classGroupId: number,
    userLessonId: number,
    learningPlanGoalId: number
  ): Observable<LearningPlanGoalProgressInterface>;
}
