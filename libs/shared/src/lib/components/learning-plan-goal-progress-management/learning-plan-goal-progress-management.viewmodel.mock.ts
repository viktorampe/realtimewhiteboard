import { Injectable } from '@angular/core';
import {
  ClassGroupInterface,
  LearningPlanGoalInterface,
  UserLessonInterface
} from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LearningPlanGoalProgressManagementViewModel } from './learning-plan-goal-progress-management.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockLearningPlanGoalProgressManagementViewModel
  implements ViewModelInterface<LearningPlanGoalProgressManagementViewModel> {
  userLessons$: BehaviorSubject<UserLessonInterface[]>;
  getMethodLessonsForBook(): Observable<
    { eduContentTocId: number; values: string[] }[]
  > {
    return of([]);
  }
  public createLearningPlanGoalProgressForUserLesson(
    learningPlanGoal: LearningPlanGoalInterface,
    classGroup: ClassGroupInterface,
    userLesson: UserLessonInterface
  ): void {}

  public createLearningPlanGoalProgressForEduContentTOCs(
    learningPlanGoal: LearningPlanGoalInterface,
    classGroup: ClassGroupInterface,
    eduContentTOCids: number[]
  ): void {}
}
