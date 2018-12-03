import { TaskInstanceInterface } from '../+models';

export class TaskInstanceFixture implements TaskInstanceInterface {
  // defaults
  start: Date = new Date(new Date().getTime() - 1000); // defaults
  end: Date = new Date(new Date().getTime() + 3600 * 24 * 7 * 1000);
  alerted = true;
  id = 1;

  constructor(props: Partial<TaskInstanceInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
