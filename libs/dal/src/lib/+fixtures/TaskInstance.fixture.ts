import { TaskInstance } from '../+models';

export class TaskInstanceFixture extends TaskInstance {
  // defaults
  start: Date = new Date(new Date().getTime() - 1000); // defaults
  end: Date = new Date(new Date().getTime() + 3600 * 24 * 7 * 1000);
  alerted = true;
  id = 1;

  constructor(props: Partial<TaskInstance> = {}) {
    super();
    Object.assign(this, props);
  }
}
