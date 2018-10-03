import { RoleInterface } from './Role.interface';

export interface RoleMappingInterface {
  id?: number;
  principalType?: string;
  principalId?: number;
  roleId?: number;
  role?: RoleInterface;
}
