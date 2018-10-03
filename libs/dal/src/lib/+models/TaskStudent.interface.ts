import { PersonInterface } from './Person.interface';
import { TaskInterface } from './Task.interface';

export interface TaskStudentInterface {
  start: Date;
  end: Date;
  instantiated?: boolean;
  id?: number;
  taskId?: number;
  personId?: number;
  task?: TaskInterface;
  student?: PersonInterface;
}
