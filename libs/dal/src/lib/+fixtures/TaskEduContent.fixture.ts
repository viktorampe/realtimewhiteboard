import {
  EduContentInterface,
  PersonInterface,
  StudentContentStatusInterface,
  TaskEduContentInterface,
  TaskInterface
} from '../+models';
import { PersonFixture } from './Person.fixture';

export class TaskEduContentFixture implements TaskEduContentInterface {
  index: number;
  id?: number;
  teacherId?: number;
  eduContentId?: number;
  taskId?: number;
  teacher?: PersonInterface = new PersonFixture();
  eduContent?: EduContentInterface;
  task?: TaskInterface;
  studentContentStatuses?: StudentContentStatusInterface[];

  constructor(props: Partial<TaskEduContentFixture> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
