import { Injectable } from '@angular/core';
import { UserLessonInterface } from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LearningPlanGoalProgressManagementViewModel } from './learning-plan-goal-progress-management.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockLearningPlanGoalProgressManagementViewModel
  implements ViewModelInterface<LearningPlanGoalProgressManagementViewModel> {
  public userLessons$ = new BehaviorSubject<UserLessonInterface[]>([]);

  public getMethodLessonsForBook(): Observable<
    { eduContentTocId: number; values: string[] }[]
  > {
    return of([]);
  }
  public createLearningPlanGoalProgressForUserLesson(
    learningPlanGoalId: number,
    classGroupId: number,
    description: string
  ): void {}

  public createLearningPlanGoalProgressForEduContentTOCs(
    learningPlanGoalId: number,
    classGroupId: number,
    eduContentTOCids: number[]
  ): void {}
}
