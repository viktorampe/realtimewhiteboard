import { TaskInterface } from '@campus/dal';

export interface TaskActionInterface {
  label: string;
  icon: string;
  tooltip: string;
  handler(task: TaskInterface): void;
}
