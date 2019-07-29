import {
  GroupInterface,
  PersonInterface,
  TaskInstanceInterface,
  TaskInterface
} from '.';

export class TaskInstance implements TaskInstanceInterface {
  start: Date;
  end: Date;
  alerted: boolean;
  id?: number;
  taskId?: number;
  personId?: number;
  groupId?: number;
  task?: TaskInterface;
  student?: PersonInterface;
  group?: GroupInterface;
  get progress() {
    if (this.start && this.end) {
      const full: number = this.end.getTime() - this.start.getTime();
      if (full < 0) {
        throw new Error('start date is greater than enddate');
      }
      const current: number = new Date().getTime() - this.start.getTime();
      if (full === 0) {
        return 100;
      }
      if (current < 0) {
        return 0;
      } else if (current > full) {
        return 100;
      } else {
        return Math.round((current / full) * 100);
      }
    }
    return 0;
  }
}
