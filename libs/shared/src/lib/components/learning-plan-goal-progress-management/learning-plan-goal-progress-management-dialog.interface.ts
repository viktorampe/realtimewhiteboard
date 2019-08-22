import { ClassGroupInterface, LearningPlanGoalInterface } from '@campus/dal';

export interface LearningPlanGoalProgressManagementInterface {
  classGroup: ClassGroupInterface;
  learningPlanGoal: LearningPlanGoalInterface;
}
