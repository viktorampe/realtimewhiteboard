import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable, of } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { LearningPlanGoalProgressInterface } from '../+models';
import { LearningPlanGoalProgressServiceInterface } from './learning-plan-goal-progress.service.interface';

@Injectable({
  providedIn: 'root'
})
export class LearningPlanGoalProgressService
  implements LearningPlanGoalProgressServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(
    userId: number
  ): Observable<LearningPlanGoalProgressInterface[]> {
    return this.personApi
      .getData(userId, 'learningPlanGoalProgress')
      .pipe(
        map(
          (res: {
            learningPlanGoalProgress: LearningPlanGoalProgressInterface[];
          }) => res.learningPlanGoalProgress
        )
      );
  }

  deleteLearningPlanGoalProgress(
    userId: number,
    learningPlanGoalProgressId: number
  ): Observable<boolean> {
    return this.personApi
      .destroyByIdLearningPlanProgress(userId, learningPlanGoalProgressId)
      .pipe(mapTo(true));
  }

  deleteLearningPlanGoalProgresses(
    userId: number,
    learningPlanGoalProgressIds: number[]
  ): Observable<boolean> {
    //TODO -- implement call to new remote method
    return of(true);
  }

  createLearningPlanGoalProgress(
    userId: number,
    classGroupId: number,
    learningPlanGoalIds: number[],
    userLessonId?: number,
    eduContentTOCId?: number
  ): Observable<LearningPlanGoalProgressInterface[]> {
    if (userLessonId && eduContentTOCId)
      throw new Error('provide either a userLessonId or a eduContentTOCid.');

    return this.personApi.createLearningPlanGoalProgress(
      userId,
      classGroupId,
      learningPlanGoalIds,
      userLessonId || null,
      eduContentTOCId || null
    );
  }
}
