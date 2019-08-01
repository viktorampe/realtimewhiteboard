import {
  EduNetInterface,
  GradeInterface,
  LearningAreaInterface,
  LearningDomainInterface,
  LearningPlanGoalProgressInterface,
  MethodGoalInterface,
  SchoolTypeInterface
} from '.';

export interface LearningPlanGoalInterface {
  goal: string;
  uniqueIdentifier: string;
  prefix: string;
  type: string;
  id?: number;
  learningAreaId?: number;
  learningDomainId?: number;
  eduNetId?: number;
  schoolTypeId?: number;
  gradeId?: number;
  learningArea?: LearningAreaInterface;
  learningDomain?: LearningDomainInterface;
  eduNet?: EduNetInterface;
  schoolType?: SchoolTypeInterface;
  grade?: GradeInterface;
  methodGoals?: MethodGoalInterface[];
  learningPlanGoalProgress?: LearningPlanGoalProgressInterface[];
}
