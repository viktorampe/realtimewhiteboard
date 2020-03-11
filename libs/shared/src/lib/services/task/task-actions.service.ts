import { forwardRef, Inject } from '@angular/core';
import { TaskInstanceInterface } from '@campus/dal';
import { TaskActionInterface } from './task-action.interface';
import {
  TaskActionsServiceInterface,
  TaskOpenerInterface,
  TASK_OPENER_TOKEN
} from './task-actions.service.interface';

export class TaskActionsService implements TaskActionsServiceInterface {
  constructor(
    @Inject(forwardRef(() => TASK_OPENER_TOKEN))
    private taskOpener: TaskOpenerInterface
  ) {}

  public TaskActionDictionary: {
    [key: string]: TaskActionInterface;
  } = {
    openTask: {
      label: 'Open taak',
      icon: 'exercise:open',
      tooltip: 'Open de taak',
      handler: this.taskOpener.openTask.bind(this.taskOpener)
    }
  };

  getActions(taskInstance: TaskInstanceInterface) {
    return this.getTaskActions(taskInstance);
  }

  private getTaskActions(
    taskInstance: TaskInstanceInterface
  ): TaskActionInterface[] {
    return [this.TaskActionDictionary.openTask];
  }
}
