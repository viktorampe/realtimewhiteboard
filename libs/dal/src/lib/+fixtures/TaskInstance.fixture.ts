import {
  GroupInterface,
  PersonInterface,
  TaskInstanceInterface,
  TaskInterface
} from '../+models';
import { PersonFixture } from './Person.fixture';

export class TaskInstanceFixture implements TaskInstanceInterface {
  start: Date = new Date();
  end: Date = new Date();
  alerted = true;
  id? = 1;
  taskId?: number;
  personId? = new PersonFixture().id;
  groupId?: number;
  task?: TaskInterface;
  student?: PersonInterface = new PersonFixture();
  group?: GroupInterface;

  constructor(props: Partial<TaskInstanceInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
