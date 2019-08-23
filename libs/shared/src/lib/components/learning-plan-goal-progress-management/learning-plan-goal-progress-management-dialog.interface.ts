import { ClassGroupInterface, LearningPlanGoalInterface } from '@campus/dal';

export interface LearningPlanGoalProgressManagementInterface {
  learningPlanGoal: LearningPlanGoalInterface;
  classGroup: ClassGroupInterface;
}
