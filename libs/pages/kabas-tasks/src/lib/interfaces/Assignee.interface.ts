import { TaskStatusEnum } from './TaskWithAssignees.interface';

export enum AssigneeTypesEnum {
  CLASSGROUP = 'classgroup',
  GROUP = 'group',
  STUDENT = 'student'
}

// This interface is only to be used for UI purposes
export interface AssigneeInterface {
  type: AssigneeTypesEnum;
  id?: number; // this is the Task...(ClassGroup | Group | Student) id
  label: string;
  start?: Date;
  end?: Date;
  status?: TaskStatusEnum;
  relationId?: number; // this is the (ClassGroup | Group | Student) id
}
