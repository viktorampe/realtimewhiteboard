import {
  ClassGroupInterface,
  PersonInterface,
  RoleInterface,
  SchoolInterface
} from '.';

export interface SchoolRoleMappingInterface {
  id?: number;
  personId?: number;
  roleId?: number;
  schoolId?: number;
  person?: PersonInterface;
  role?: RoleInterface;
  school?: SchoolInterface;
  classGroups?: ClassGroupInterface[];
}
