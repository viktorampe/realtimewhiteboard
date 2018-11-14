import {
  LearningAreaInterface,
  TaskEduContentInterface,
  TaskInstanceInterface
} from '@campus/dal';

export interface LearningAreasWithTaskInstanceInfoInterface {
  learningAreas: {
    learningArea: LearningAreaInterface;
    openTasks: number;
    closedTasks: number;
  }[];
  totalTasks: number;
}

export interface TaskInstancesWithEduContentInfoInterface {
  instances: TaskInstancesWithEduContentInfo[];
}

export interface TaskInstancesWithEduContentInfo {
  taskInstance: TaskInstanceInterface;
  taskEduContentsCount: number;
  finished: boolean;
}

export interface TaskInstanceWithEduContentsInfoInterface {
  taskInstance: TaskInstanceInterface;
  taskEduContents: TaskEduContentInterface[];
  finished: boolean;
}
