import {
  GradeInterface,
  LearningAreaInterface,
  LearningDomainInterface,
  MethodGoalInterface,
  SchoolTypeInterface
} from '.';

export interface FinalTermInterface {
  goal: string;
  uniqueIdentifier: string;
  prefix: string;
  id?: number;
  learningAreaId?: number;
  learningDomainId?: number;
  gradeId?: number;
  schoolTypeId?: number;
  learningArea?: LearningAreaInterface;
  learningDomain?: LearningDomainInterface;
  grade?: GradeInterface;
  schoolType?: SchoolTypeInterface;
  methodGoals?: MethodGoalInterface[];
}
