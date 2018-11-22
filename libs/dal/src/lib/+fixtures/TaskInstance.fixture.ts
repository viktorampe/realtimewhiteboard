import { TaskInstanceInterface } from '../+models';

export class TaskInstanceFixture implements TaskInstanceInterface {
  // defaults
  start = new Date(2018, 11 - 1, 20, 7);
  end = new Date(2018, 11 - 1, 21, 7);
  alerted = true;
  id = 1;

  constructor(props: Partial<TaskInstanceInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
