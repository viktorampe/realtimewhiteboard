import { Pipe, PipeTransform } from '@angular/core';
import { TaskByLearningAreaInfoInterface } from '../student-task-overview/student-task-overview.component';

@Pipe({ name: 'taskInfoByLearningArea' })
export class TaskInfoByLearningAreaPipe implements PipeTransform {
  transform(taskInfo: TaskByLearningAreaInfoInterface): string {
    let result = `${taskInfo.learningAreaName} (${taskInfo.taskCount} ${
      taskInfo.taskCount === 1 ? 'taak' : 'taken'
    }`;

    if (taskInfo.urgentCount) {
      result += `, ${taskInfo.urgentCount} dringend)`;
    } else {
      result += ')';
    }
    return result;
  }
}
