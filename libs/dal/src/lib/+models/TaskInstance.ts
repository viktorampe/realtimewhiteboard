import {
  GroupInterface,
  PersonInterface,
  TaskInstanceInterface,
  TaskInterface
} from '@campus/dal';

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

  getProgress(): number {
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
      } else {
        const percent = Math.round((current / full) * 100);
        if (percent > 100) {
          return 100;
        }
      }
    }
    return 0;
  }
}
