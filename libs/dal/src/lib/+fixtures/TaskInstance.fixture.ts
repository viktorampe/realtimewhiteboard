import {
  GroupInterface,
  PersonInterface,
  TaskInstance,
  TaskInstanceInterface,
  TaskInterface
} from '../+models';
import { PersonFixture } from './Person.fixture';

export class TaskInstanceFixture extends TaskInstance {
  start: Date = new Date();
  end: Date = new Date(new Date().getTime() + 3600 * 24 * 7 * 1000);
  alerted = true;
  id? = 1;
  taskId?: number;
  personId? = new PersonFixture().id;
  groupId?: number;
  task?: TaskInterface;
  student?: PersonInterface = new PersonFixture();
  group?: GroupInterface;

  constructor(props: Partial<TaskInstanceInterface> = {}) {
    super();
    Object.assign(this, props);
  }
}
