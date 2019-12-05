import { TaskClassGroupInterface } from '../+models';

export class TaskClassGroupFixture implements TaskClassGroupInterface {
  // defaults
  start = new Date(2019, 9, 1);
  end = new Date(2020, 8, 31);
  instantiated = false;
  id = 1;
  taskId = 1;
  classGroupId = 1;

  constructor(props: Partial<TaskClassGroupInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
