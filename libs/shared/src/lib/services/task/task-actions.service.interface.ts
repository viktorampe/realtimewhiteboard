import { TaskInstanceInterface } from '@campus/dal';

export interface TaskActionsServiceInterface {
  getActions(taskInstance: TaskInstanceInterface);
}
