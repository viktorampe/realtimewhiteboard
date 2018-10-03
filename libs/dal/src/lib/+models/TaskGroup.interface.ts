import { GroupInterface } from './Group.interface';
import { PersonInterface } from './Person.interface';
import { TaskInterface } from './Task.interface';

export interface TaskGroupInterface {
  start: Date;
  end: Date;
  instantiated?: boolean;
  id?: number;
  taskId?: number;
  groupId?: number;
  task?: TaskInterface;
  group?: GroupInterface;
  students?: PersonInterface[];
}
