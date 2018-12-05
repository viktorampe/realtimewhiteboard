import { EduContentInterface } from './EduContent.interface';
import { PersonInterface } from './Person.interface';
import { StudentContentStatusInterface } from './StudentContentStatus.interface';
import { TaskInterface } from './Task.interface';

export interface TaskEduContentInterface {
  index: number;
  id?: number;
  teacherId?: number;
  eduContentId?: number;
  taskId?: number;
  teacher?: PersonInterface;
  eduContent?: EduContentInterface;
  task?: TaskInterface;
  studentContentStatuses?: StudentContentStatusInterface[];
  submitted?: boolean;
}
