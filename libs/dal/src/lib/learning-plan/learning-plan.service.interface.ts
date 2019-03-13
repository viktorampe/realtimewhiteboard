import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { YearInterface } from '../+models';

export const LEARNING_PLAN_SERVICE_TOKEN = new InjectionToken(
  'LearningPlanService'
);

export interface LearningPlanServiceInterface {
  getAvailableYearsForSearch(
    learningAreaId: number,
    eduNetId: number,
    schooltypeId: number
  ): Observable<YearInterface[]>;
  // this can use the same end-point as we do now

  getLearningPlanAssignments(
    eduNet,
    year,
    schoolType,
    learningArea
  ): Observable<any>; //TODO any is evil
  // currently calls api/learning-plan/ with this filter: {"where":{"learningAreaId":9,"eduNetId":1},"include":{"relation":"assignments","scope":{"include":["specialty"],"where":{"schoolTypeId":2,"yearId":5}}}}
  // should return a nested object with specialty -> learningPlanAssignment structure
}
