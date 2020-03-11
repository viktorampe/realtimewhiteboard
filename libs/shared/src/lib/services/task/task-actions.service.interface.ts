import { InjectionToken } from '@angular/core';
import { TaskInstanceInterface } from '@campus/dal';

export interface TaskActionsServiceInterface {
  getActions(taskInstance: TaskInstanceInterface);
}
export interface TaskOpenerInterface {
  openTask(taskId: number);
}

export const TASK_OPENER_TOKEN = new InjectionToken<TaskOpenerInterface>(
  'TaskOpener'
);
