import { forwardRef, Inject, Injectable } from '@angular/core';
import { TaskInterface } from '@campus/dal';
import { TaskActionInterface } from '../task-action.interface';
import {
  StudentTaskOpenerInterface,
  STUDENT_TASK_OPENER_TOKEN,
  TaskActionsStudentServiceInterface
} from './task-actions-student.service.interface';

@Injectable({ providedIn: 'root' })
export class TaskActionsStudentService
  implements TaskActionsStudentServiceInterface {
  constructor(
    @Inject(forwardRef(() => STUDENT_TASK_OPENER_TOKEN))
    private taskOpener: StudentTaskOpenerInterface
  ) {}

  public taskActionDictionary: {
    [key: string]: TaskActionInterface;
  } = {
    openTask: {
      label: 'Bekijken',
      icon: 'exercise:open',
      tooltip: 'Open de taak',
      handler: this.taskOpener.openTask.bind(this.taskOpener)
    }
  };

  getActions(task: TaskInterface) {
    return this.getTaskActions(task);
  }

  private getTaskActions(task: TaskInterface): TaskActionInterface[] {
    return [this.taskActionDictionary.openTask];
  }
}
