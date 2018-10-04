import { LearningPlanInterface } from './LearningPlan.interface';
import { SchoolTypeInterface } from './SchoolType.interface';
import { SpecialtyInterface } from './Specialty.interface';
import { YearInterface } from './Year.interface';

export interface LearningPlanAssignmentInterface {
  hours?: number;
  subPlan?: string;
  id?: number;
  learningPlanId?: number;
  schoolTypeId?: number;
  specialtyId?: number;
  yearId?: number;
  learningPlan?: LearningPlanInterface;
  schoolType?: SchoolTypeInterface;
  specialty?: SpecialtyInterface;
  year?: YearInterface;
}
