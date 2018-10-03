import { RoleMappingInterface } from './RoleMapping.interface';

export interface RoleInterface {
  id?: number;
  name: string;
  description?: string;
  created?: Date;
  modified?: Date;
  ink?: boolean;
  principals?: RoleMappingInterface[];
}
