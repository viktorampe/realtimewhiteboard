import { InjectionToken } from '@angular/core';
import { EduContent, ResultInterface } from '@campus/dal';
import { ScormCmiInterface } from '@campus/scorm';
import { Observable } from 'rxjs';

export const RESULTS_SERVICE_TOKEN = new InjectionToken(
  'ResultsServiceInterface'
);

// TODO to be imported form +models once interface is build by sdk
export interface AssignmentResultInterface {
  title: string;
  type: string; //(Task/Bundle)
  totalScore: number;
  exerciseResults: {
    eduContent: EduContent;
    // results: Result[] // if needed
    // bestResult: Result
    averageScore: number; // if needed
  }[];
}

export interface ResultsServiceInterface {
  getAllForUser(userId: number): Observable<AssignmentResultInterface[]>;

  getResultForTask(
    userId: number,
    taskId: number,
    eduContentId: number
  ): Observable<ResultInterface>;

  getResultForUnlockedContent(
    userId: number,
    unlockedContentId: number,
    eduContentId: number
  ): Observable<ResultInterface>;

  saveResult(
    userId: number,
    resultId: number,
    cmi: ScormCmiInterface
  ): Observable<ResultInterface>;
}
