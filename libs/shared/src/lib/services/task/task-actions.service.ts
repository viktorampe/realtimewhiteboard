import { TaskInstanceInterface } from '@campus/dal';
import { TaskActionsServiceInterface } from './task-actions.service.interface';

export class TaskActionsService implements TaskActionsServiceInterface {
  getActions(taskInstance: TaskInstanceInterface) {
    throw new Error('Method not implemented.');
  }
  openTask(taskId: number) {
    throw new Error('Method not implemented.');
  }
}
