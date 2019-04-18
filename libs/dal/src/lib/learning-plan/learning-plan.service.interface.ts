import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import {
  LearningPlanAssignmentInterface,
  SpecialtyInterface,
  YearInterface
} from '../+models';

export const LEARNING_PLAN_SERVICE_TOKEN = new InjectionToken(
  'LearningPlanService'
);

export interface LearningPlanServiceInterface {
  getAvailableYearsForSearch(
    learningAreaId: number,
    eduNetId: number,
    schooltypeId: number
  ): Observable<YearInterface[]>;

  getLearningPlanAssignments(
    eduNetId: number,
    yearId: number,
    schoolTypeId: number,
    learningAreaId: number
  ): Observable<Map<SpecialtyInterface, LearningPlanAssignmentInterface[]>>;

  getSpecialities(
    eduNetId: number,
    yearId: number,
    schoolTypeId: number,
    learningAreaId: number
  ): Observable<SpecialtyInterface[]>;
}
