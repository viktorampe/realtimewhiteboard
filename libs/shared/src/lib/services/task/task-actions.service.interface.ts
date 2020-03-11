import { InjectionToken } from '@angular/core';
import { TaskInstanceInterface, TaskInterface } from '@campus/dal';
import { TaskActionInterface } from './task-action.interface';

export interface TaskActionsServiceInterface {
  taskActionDictionary: { [key: string]: TaskActionInterface };
  getActions(taskInstance: TaskInstanceInterface);
}
export interface TaskOpenerInterface {
  openTask(task: TaskInterface);
}

export const TASK_OPENER_TOKEN = new InjectionToken<TaskOpenerInterface>(
  'TaskOpener'
);
