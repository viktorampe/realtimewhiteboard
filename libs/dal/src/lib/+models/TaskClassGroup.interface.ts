import { ClassGroupInterface } from './ClassGroup.interface';
import { TaskInterface } from './Task.interface';

export interface TaskClassGroupInterface {
  start: Date;
  end: Date;
  instantiated?: boolean;
  id?: number;
  taskId?: number;
  task?: TaskInterface;
  classGroupId?: number;
  classGroup?: ClassGroupInterface;
}
