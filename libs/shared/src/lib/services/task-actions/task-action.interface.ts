import { TaskInterface } from '@campus/dal';

export interface TaskActionInterface {
  label: string;
  icon: string;
  tooltip: string;
  handler(props: { task?: TaskInterface; taskInstanceId?: number }): void;
}
