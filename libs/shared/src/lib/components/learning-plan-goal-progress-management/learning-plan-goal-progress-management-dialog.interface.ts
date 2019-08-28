import {
  ClassGroupInterface,
  EduContentBookInterface,
  LearningPlanGoalInterface
} from '@campus/dal';

export interface LearningPlanGoalProgressManagementInterface {
  learningPlanGoal: LearningPlanGoalInterface;
  classGroup: ClassGroupInterface;
  book: EduContentBookInterface;
}
