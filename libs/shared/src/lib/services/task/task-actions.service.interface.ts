import { InjectionToken } from '@angular/core';
import { TaskInstanceInterface } from '@campus/dal';
import { TaskActionInterface } from './task-action.interface';

export interface TaskActionsServiceInterface {
  taskActionDictionary: { [key: string]: TaskActionInterface };
  getActions(taskInstance: TaskInstanceInterface);
}
export interface TaskOpenerInterface {
  openTask(taskId: number);
}

export const TASK_OPENER_TOKEN = new InjectionToken<TaskOpenerInterface>(
  'TaskOpener'
);
