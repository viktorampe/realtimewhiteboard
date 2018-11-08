import { LearningAreaInterface, TaskEduContentInterface, TaskInstanceInterface } from '@campus/dal';

export interface LearningAreasWithTaskInstanceInfoInterface {
  learningAreasWithInfo: {
    learningArea: LearningAreaInterface;
    openTasks: number;
    closedTasks: number;
  }[];
  totalTasks: number;
}

export interface TaskInstancesWithEduContentInfoInterface {
  instances: {
    taskInstance: TaskInstanceInterface;
    taskEduContentsCount: number;
    finished: boolean;
  }[];
}

export interface TaskInstanceWithEduContentsInfoInterface {
  taskInstance: TaskInstanceInterface;
  taskEduContents: TaskEduContentInterface[];
  finished: boolean;
}
