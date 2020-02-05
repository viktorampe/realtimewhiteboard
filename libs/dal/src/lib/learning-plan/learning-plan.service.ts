import { Injectable } from '@angular/core';
import {
  EduContentMetadataApi,
  LearningPlanApi
} from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LearningPlanInterface, YearInterface } from '../+models';
import { LearningPlanAssignmentInterface } from './../+models/LearningPlanAssignment.interface';
import { SpecialtyInterface } from './../+models/Specialty.interface';
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

  getLearningPlanAssignments(
    eduNetId,
    yearId,
    schoolTypeId,
    learningAreaId
  ): Observable<Map<SpecialtyInterface, LearningPlanAssignmentInterface[]>> {
    return this.learningPlanApi
      .find({
        where: { learningAreaId, eduNetId },
        include: {
          relation: 'assignments',
          scope: { include: ['specialty'], where: { schoolTypeId, yearId } }
        }
      })
      .pipe(map(this.toSpecialitiesMap));
  }

  // TODO: move to own service?
  getSpecialities(
    eduNetId,
    yearId,
    schoolTypeId,
    learningAreaId
  ): Observable<SpecialtyInterface[]> {
    return this.learningPlanApi
      .find({
        where: { learningAreaId, eduNetId },
        include: {
          relation: 'assignments',
          scope: { include: ['specialty'], where: { schoolTypeId, yearId } }
        }
      })
      .pipe(map(this.toSpecialitiesArray));
  }

  private toSpecialitiesMap(
    learningPlans: LearningPlanInterface[]
  ): Map<SpecialtyInterface, LearningPlanAssignmentInterface[]> {
    const learningPlanAssignments = learningPlans.reduce((acc, plan) => {
      plan.assignments.forEach(assignment => {
        assignment.learningPlan = plan;
        assignment.learningPlan.assignments = null;
        assignment.learningPlanId = plan.id;
        acc.push(assignment);
      });
      return acc;
    }, [] as LearningPlanAssignmentInterface[]);

    const specialitiesMap = learningPlanAssignments.reduce(
      (sMap, assignment) => {
        const prevValues = sMap.get(assignment.specialty) || [];
        return sMap.set(assignment.specialty, [...prevValues, assignment]);
      },
      new Map()
    );

    return specialitiesMap;
  }

  private toSpecialitiesArray(
    learningPlans: LearningPlanInterface[]
  ): SpecialtyInterface[] {
    const specialities = {};

    learningPlans.forEach(plan =>
      plan.assignments.forEach(assignment => {
        if (!specialities[assignment.specialty.id]) {
          specialities[assignment.specialty.id] = assignment.specialty;
        }
      })
    );

    return Object.values(specialities);
  }
}
