import {
  ClassGroupTypeInterface,
  LearningPlanGoalProgressInterface,
  LicenseInterface,
  SchoolInterface,
  SchoolRoleMappingInterface,
  YearInterface
} from '.';

export interface ClassGroupInterface {
  name?: string;
  id?: number;
  schoolId?: number;
  classGroupTypeId?: number;
  typeId?: number;
  licenses?: LicenseInterface[];
  years?: YearInterface[];
  school?: SchoolInterface;
  type?: ClassGroupTypeInterface;
  learningPlanGoalProgress?: LearningPlanGoalProgressInterface[];
  schoolRoleMapping?: SchoolRoleMappingInterface[];
}
