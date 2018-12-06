import {
  LearningAreaInterface,
  TaskEduContentInterface,
  TaskInstanceInterface,
  TaskInterface
} from '@campus/dal';

export interface LearningAreasWithTaskInfoInterface {
  learningAreasWithInfo: LearningAreaWithTaskInfoInterface[];
  totalTasks: number;
}

export interface LearningAreaWithTaskInfoInterface {
  learningArea: LearningAreaInterface;
  openTasks: number;
  closedTasks: number;
}

export interface TasksWithInfoInterface {
  taskInfos: TaskWithInfoInterface[];
}

export interface TaskWithInfoInterface {
  task: TaskInterface;
  taskInstance: TaskInstanceInterface;
  taskEduContentsCount: number;
  taskEduContents: TaskEduContentInterface[];
  finished: boolean;
}
