import { TaskEduContentInterface, TaskInterface } from '../../+models';
import { AssigneeInterface } from './Assignee.interface';

export enum TaskStatusEnum {
  'PENDING' = 'pending',
  'ACTIVE' = 'active',
  'FINISHED' = 'finished'
}

export interface TaskWithAssigneesInterface extends TaskInterface {
  eduContentAmount: number;
  taskEduContents?: TaskEduContentInterface[];
  assignees: AssigneeInterface[];
  startDate?: Date;
  endDate?: Date;
  status?: TaskStatusEnum;
}
