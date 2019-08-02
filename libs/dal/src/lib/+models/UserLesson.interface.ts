import { LearningPlanGoalProgressInterface, PersonInterface } from '.';

export interface UserLessonInterface {
  id?: number;
  description: string;
  personId?: number;
  person?: PersonInterface;
  learningPlanGoalProgress?: LearningPlanGoalProgressInterface[];
}
