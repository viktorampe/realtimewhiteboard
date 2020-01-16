import { TaskStatusEnum } from './TaskWithAssignees.interface';

export enum AssigneeTypesEnum {
  CLASSGROUP = 'classgroup',
  GROUP = 'group',
  STUDENT = 'student'
}

export interface AssigneeInterface {
  type: AssigneeTypesEnum;
  id?: number;
  label: string;
  start?: Date;
  end?: Date;
  status?: TaskStatusEnum;
  relationId?: number;
}
