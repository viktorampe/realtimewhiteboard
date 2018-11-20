import { TaskInstanceInterface } from '../+models';

export class TaskInstanceFixture implements TaskInstanceInterface {
  // defaults
  start: Date = new Date(2018, 11 - 1, 20, 7);
  end: Date = new Date(2018, 11 - 1, 21, 7);
  alerted: boolean = true;
  id: number = 1;

  constructor(props: Partial<TaskInstanceInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}
