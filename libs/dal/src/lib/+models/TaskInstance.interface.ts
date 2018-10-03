import { GroupInterface } from './Group.interface';
import { PersonInterface } from './Person.interface';
import { TaskInterface } from './Task.interface';

export interface TaskInstanceInterface {
  start: Date;
  end: Date;
  alerted: boolean;
  id?: number;
  taskId?: number;
  personId?: number;
  groupId?: number;
  task?: TaskInterface;
  student?: PersonInterface;
  group?: GroupInterface;
}
