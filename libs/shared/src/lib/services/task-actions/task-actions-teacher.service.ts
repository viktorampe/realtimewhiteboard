import { forwardRef, Inject, Injectable } from '@angular/core';
import { TaskInterface } from '@campus/dal';
import { TaskActionInterface } from './task-action.interface';
import {
  TaskActionsTeacherServiceInterface,
  TeacherTaskOpenerInterface,
  TEACHER_TASK_OPENER_TOKEN
} from './task-actions-teacher.service.interface';

@Injectable({ providedIn: 'root' })
export class TaskActionsTeacherService
  implements TaskActionsTeacherServiceInterface {
  constructor(
    @Inject(forwardRef(() => TEACHER_TASK_OPENER_TOKEN))
    private taskOpener: TeacherTaskOpenerInterface
  ) {}

  public taskActionDictionary: {
    [key: string]: TaskActionInterface;
  } = {
    openTask: {
      label: 'Bekijken',
      icon: 'exercise:open',
      tooltip: 'Open de taak',
      handler: this.taskOpener.openTask.bind(this.taskOpener)
    },
    archiveTask: {
      label: 'Archiveren',
      icon: '',
      tooltip: 'Archiveer de taak',
      handler: this.taskOpener.archiveTask.bind(this.taskOpener)
    },
    unarchiveTask: {
      label: 'Dearchiveren',
      icon: '',
      tooltip: 'Dearchiveer de taak',
      handler: this.taskOpener.unarchiveTask.bind(this.taskOpener)
    },
    openResultsForTask: {
      label: 'Resulaten',
      icon: '',
      tooltip: 'Toon de resultaten voor de taak',
      handler: this.taskOpener.openResultsForTask.bind(this.taskOpener)
    },
    openLearningPlanGoalMatrixForTask: {
      label: 'Doelenmatrix',
      icon: '',
      tooltip: 'Toon de doelenmatrix voor de taak',
      handler: this.taskOpener.openLearningPlanGoalMatrixForTask.bind(
        this.taskOpener
      )
    }
  };

  getActions(task: TaskInterface) {
    return this.getTaskActions(task);
  }

  private getTaskActions(task: TaskInterface): TaskActionInterface[] {
    let actions = [];
    if (!task.isPaperTask) {
      actions = [
        this.taskActionDictionary.openTask,
        task.archivedYear
          ? this.taskActionDictionary.unarchiveTask
          : this.taskActionDictionary.archiveTask,
        this.taskActionDictionary.openResultsForTask,
        this.taskActionDictionary.openLearningPlanGoalMatrixForTask
      ];
    } else if (task.isPaperTask) {
      actions = [
        this.taskActionDictionary.openTask,
        task.archivedYear
          ? this.taskActionDictionary.unarchiveTask
          : this.taskActionDictionary.archiveTask
      ];
    }
    return actions;
  }
}
