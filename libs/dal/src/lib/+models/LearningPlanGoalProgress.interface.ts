import {
  ClassGroupInterface,
  EduContentBookInterface,
  EduContentTOCInterface,
  LearningPlanGoalInterface,
  PersonInterface,
  UserLessonInterface
} from '.';

export interface LearningPlanGoalProgressInterface {
  originalClassGroup?: string;
  schoolYear?: number;
  id?: number;
  personId?: number;
  classGroupId: number;
  eduContentTOCId?: number;
  learningPlanGoalId: number;
  userLessonId?: number;
  person?: PersonInterface;
  classGroup?: ClassGroupInterface;
  eduContentTOC?: EduContentTOCInterface;
  learningPlanGoal?: LearningPlanGoalInterface;
  userLesson?: UserLessonInterface;
  eduContentBook?: EduContentBookInterface;
  eduContentBookId: number;
}
