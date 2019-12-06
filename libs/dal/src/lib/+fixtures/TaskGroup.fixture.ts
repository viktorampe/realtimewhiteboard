import { TaskGroupInterface } from '../+models';

export class TaskGroupFixture implements TaskGroupInterface {
  // defaults
  start = new Date(2019, 9, 1);
  end = new Date(2020, 8, 31);
  instantiated = false;
  id = 1;
  taskId = 1;
  groupId = 1;

  constructor(props: Partial<TaskGroupInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
