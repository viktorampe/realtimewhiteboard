import {
  BundleInterface,
  LearningAreaInterface,
  TaskInterface
} from '@campus/dal';

export interface ResultAreasInterface {
  taskAreas: LearningAreasWithTaskInfoInterface[];
  bundleAreas: LearningAreasWithTaskInfoInterface[];
}

export interface LearningAreasWithTaskInfoInterface
  extends LearningAreaInterface {
  tasks?: TaskWithInfoInterface[];
  bundles?: BundlekWithInfoInterface[];
  totalScore: number;
  averageScore: number;
  totalTime: number;
  tasksTotalScore: number;
  tasksAverageScore: number;
  tasksTotalTime: number;
  tasksTotal: number;
  tasksMade: number;
  tasksSkipped: number;
}

export interface TaskWithInfoInterface extends TaskInterface {
  made: boolean;
  totalScore: number;
  averageScore: number;
}

export interface BundlekWithInfoInterface extends BundleInterface {
  totalExercises: number;
  totalScore: number;
  averageScore: number;
}
