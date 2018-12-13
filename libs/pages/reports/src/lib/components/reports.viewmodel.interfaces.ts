import {
  EduContent,
  LearningAreaInterface,
  ResultInterface
} from '@campus/dal';

export interface LearningAreasWithResultsInterface {
  learningAreas: {
    learningArea: LearningAreaInterface;
    tasksWithResultsCount: number;
    bundlesWithResultsCount: number;
  }[];
}


export interface AssignmentResultInterface {
  title: string;
  type: string; //(Task/Bundle)
  totalScore: number;
  exerciseResults: {
    eduContent: EduContent;
    results: ResultInterface[]; // if needed
    bestResult: ResultInterface;
    averageScore: number; // if needed
  }[];
}
