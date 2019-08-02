import { PersonInterface } from '.';

export interface UserLessonInterface {
  id?: number;
  description: string;
  personId?: number;
  person?: PersonInterface;
  learningPlanGoalProgress?: LearningPlanGoalProgressInterface[];
}

// TODO remove when actual interface in available
interface LearningPlanGoalProgressInterface {
  id?: number;
}
