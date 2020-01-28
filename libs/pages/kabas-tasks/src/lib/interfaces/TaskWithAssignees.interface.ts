import { TaskInterface } from '@campus/dal';
import { AssigneeInterface } from './Assignee.interface';
import { TaskEduContentWithEduContentInterface } from './TaskEduContentWithEduContent.interface';

export enum TaskStatusEnum {
  'PENDING' = 'pending',
  'ACTIVE' = 'active',
  'FINISHED' = 'finished'
}

export interface TaskWithAssigneesInterface extends TaskInterface {
  eduContentAmount: number;
  taskEduContents?: TaskEduContentWithEduContentInterface[];
  assignees: AssigneeInterface[];
  startDate?: Date;
  endDate?: Date;
  status?: TaskStatusEnum;
  actions?: { label: string; handler: Function }[];
}
