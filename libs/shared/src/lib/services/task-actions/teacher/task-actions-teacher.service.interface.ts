import { InjectionToken } from '@angular/core';
import { TaskInterface, TaskWithAssigneesInterface } from '@campus/dal';
import { TaskActionInterface } from '../task-action.interface';

export interface TaskActionsTeacherServiceInterface {
  taskActionDictionary: { [key: string]: TaskActionInterface };
  getActions(task: TaskInterface): TaskActionInterface[];
}

export interface TeacherTaskOpenerInterface {
  openTask(task: TaskInterface);
  archiveTask(task: TaskWithAssigneesInterface);
  unarchiveTask(task: TaskWithAssigneesInterface);
  openResultsForTask(task: TaskInterface);
  openLearningPlanGoalMatrixForTask(task: TaskInterface);
}

export const TEACHER_TASK_OPENER_TOKEN = new InjectionToken<
  TeacherTaskOpenerInterface
>('TeacherTaskOpener');

export const TASK_ACTIONS_TEACHER_SERVICE_TOKEN = new InjectionToken<
  TaskActionsTeacherServiceInterface
>('TaskActionsTeacherService');
