import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
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

  bulkCreateLearningPlanGoalProgress(
    userId: number,
    classGroupId: number,
    eduContentTOCId: number,
    learningPlanGoalIds: number[]
  ): Observable<LearningPlanGoalProgressInterface[]> {
    return this.personApi['bulkCreateLearningPlanGoalProgressForTOC'](
      userId,
      classGroupId,
      eduContentTOCId,
      learningPlanGoalIds
    ); //TODO don't avoid type checking -> after publish
  }

  createLearningPlanGoalProgressForUserLesson(
    userId: number,
    classGroupId: number,
    userLessonId: number,
    learningPlanGoalId: number
  ): Observable<LearningPlanGoalProgressInterface> {
    return this.personApi['createLearningPlanGoalProgressForUserLesson'](
      userId,
      classGroupId,
      userLessonId,
      learningPlanGoalId
    ); //TODO don't avoid type checking -> after publish
  }
}
