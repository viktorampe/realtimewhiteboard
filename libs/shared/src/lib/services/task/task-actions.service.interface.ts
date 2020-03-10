import { TaskInstanceInterface } from '@campus/dal';

export interface TaskActionsServiceInterface {
  getActions(taskInstance: TaskInstanceInterface);
}
export interface TaskOpenerInterface {
  opentask(taskId: number);
}
