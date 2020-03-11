import { forwardRef, Inject } from '@angular/core';
import { TaskInstanceInterface } from '@campus/dal';
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
    [key: string]: TaskOpenerInterface;
  } = {
    openTask: this.taskOpener.openTask.bind(this.taskOpener)
  };

  getActions(taskInstance: TaskInstanceInterface) {
    return this.getTaskActions(taskInstance);
  }

  private getTaskActions(
    taskInstance: TaskInstanceInterface
  ): TaskOpenerInterface[] {
    return [this.TaskActionDictionary.openTask];
  }
}
