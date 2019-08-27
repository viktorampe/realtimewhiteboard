import { Injectable } from '@angular/core';
import {
  ClassGroupInterface,
  LearningPlanGoalInterface,
  UserLessonInterface
} from '@campus/dal';

@Injectable()
export class LearningPlanGoalProgressManagementViewModel {
  constructor() {}

  public createLearningPlanGoalProgressForUserLesson(
    learningPlanGoal: LearningPlanGoalInterface,
    classGroup: ClassGroupInterface,
    userLesson: UserLessonInterface // could just be description -> create new
  ): void {
    console.log(
      'createLearningPlanGoalProgressForUserLesson',
      learningPlanGoal,
      classGroup,
      userLesson
    );
  }

  public createLearningPlanGoalProgressForEduContentTOCs(
    learningPlanGoal: LearningPlanGoalInterface,
    classGroup: ClassGroupInterface,
    eduContentTOCids: number[]
  ): void {
    console.log(
      'createLearningPlanGoalProgressForEduContentTOCs',
      learningPlanGoal,
      classGroup,
      eduContentTOCids
    );
  }
}
