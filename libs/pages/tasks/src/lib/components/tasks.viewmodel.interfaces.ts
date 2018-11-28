import { LearningAreaInterface, TaskEduContentInterface, TaskInstanceInterface } from '@campus/dal';

export interface LearningAreasWithTaskInstanceInfoInterface {
  learningAreasWithInfo: LearningAreaWithTaskInfoInterface[];
  totalTasks: number;
}

export interface LearningAreaWithTaskInfoInterface {
  learningArea: LearningAreaInterface;
  openTasks: number;
  closedTasks: number;
}

export interface TaskInstancesWithEduContentInfoInterface {
  instances: TaskInstanceWithEduContentInfoInterface[];
}

export interface TaskInstanceWithEduContentInfoInterface {
  taskInstance: TaskInstanceInterface;
  taskEduContentsCount: number;
  taskEduContents: TaskEduContentInterface[];
  finished: boolean;
}