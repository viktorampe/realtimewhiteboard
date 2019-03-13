import { Injectable } from '@angular/core';
import {
  EduContentMetadataApi,
  LearningPlanApi
} from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { YearInterface } from '../+models';
import { LearningPlanServiceInterface } from './learning-plan.service.interface';

@Injectable({
  providedIn: 'root'
})
export class LearningPlanService implements LearningPlanServiceInterface {
  constructor(
    private learningPlanApi: LearningPlanApi,
    private eduContentMetadataApi: EduContentMetadataApi
  ) {}

  getAvailableYearsForSearch(
    learningAreaId: number,
    eduNetId: number,
    schooltypeId: number
  ): Observable<YearInterface[]> {
    return this.eduContentMetadataApi.searchYearsForPlans(
      learningAreaId,
      eduNetId,
      schooltypeId
    );
  }
  // this can use the same end-point as we do now

  getLearningPlanAssignments(
    eduNetId,
    yearId,
    schoolTypeId,
    learningAreaId
  ): Observable<any> {
    return this.learningPlanApi.find({
      where: { learningAreaId, eduNetId },
      include: {
        relation: 'assignments',
        scope: { include: ['specialty'], where: { schoolTypeId, yearId } }
      }
    });
  }
  // currently calls api/learning-plan/ with this filter: {"where":{"learningAreaId":9,"eduNetId":1},"include":{"relation":"assignments","scope":{"include":["specialty"],"where":{"schoolTypeId":2,"yearId":5}}}}
  // should return a nested object with specialty -> learningPlanAssignment structure
}
