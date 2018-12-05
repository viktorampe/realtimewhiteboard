import { TaskInstance } from '../+models';

export class TaskInstanceFixture extends TaskInstance {
  start: Date;
  end: Date;
  alerted = true;
  id = 1;

  constructor(props: Partial<TaskInstance> = {}) {
    super();
    this.start = new Date(new Date().getTime() - 1000);
    this.start.setMilliseconds(0);
    this.start.setSeconds(0);
    this.start.setMinutes(0);
    this.start.setHours(0);

    this.end = new Date(new Date().getTime() + 3600 * 24 * 7 * 1000);
    this.end.setMilliseconds(0);
    this.end.setSeconds(0);
    this.end.setMinutes(0);
    this.end.setHours(0);

    Object.assign(this, props);
  }
}
