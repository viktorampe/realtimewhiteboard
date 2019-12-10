import { TaskInterface } from '@campus/dal';
import { AssigneeInterface } from './Assignee.interface';

export enum TaskStatusEnum {
  'PENDING' = 'pending',
  'ACTIVE' = 'active',
  'FINISHED' = 'finished'
}

export interface TaskDatesInterface {
  startDate: Date;
  endDate: Date;
  status: TaskStatusEnum;
}

export interface TaskWithAssigneesInterface extends TaskInterface {
  eduContentAmount: number;
  assignees: AssigneeInterface[];
  taskDates?: TaskDatesInterface;
}
