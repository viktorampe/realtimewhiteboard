import {
  LearningAreaInterface,
  TaskEduContentInterface,
  TaskInstanceInterface
} from '@campus/dal';

export interface LearningAreasWithTaskInstanceInfoInterface {
  learningAreasWithInfo: LearningAreaWithTaskInfo[];
  totalTasks: number;
}

export interface LearningAreaWithTaskInfo {
  learningArea: LearningAreaInterface;
  openTasks: number;
  closedTasks: number;
}

export interface TaskInstanceWithEduContentInfoInterface {
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
