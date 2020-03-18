import { InjectionToken } from '@angular/core';
import { TaskInterface } from '@campus/dal';
import { TaskActionInterface } from '../task-action.interface';

export interface TaskActionsStudentServiceInterface {
  taskActionDictionary: { [key: string]: TaskActionInterface };
  getActions(task: TaskInterface): TaskActionInterface[];
}

export interface StudentTaskOpenerInterface {
  openTask(task: TaskInterface | number);
}

export const STUDENT_TASK_OPENER_TOKEN = new InjectionToken<
  StudentTaskOpenerInterface
>('TeacherTaskOpener');

export const TASK_ACTIONS_STUDENT_SERVICE_TOKEN = new InjectionToken<
  TaskActionsStudentServiceInterface
>('TaskActionsStudentService');
