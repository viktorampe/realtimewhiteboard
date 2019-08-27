import { Injectable } from '@angular/core';
import {
  ClassGroupInterface,
  LearningPlanGoalInterface,
  UserLessonInterface
} from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { LearningPlanGoalProgressManagementViewModel } from './learning-plan-goal-progress-management.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockLearningPlanGoalProgressManagementViewModel
  implements ViewModelInterface<LearningPlanGoalProgressManagementViewModel> {
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
