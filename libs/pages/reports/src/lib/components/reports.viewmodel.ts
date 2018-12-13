import { Injectable } from '@angular/core';
import {
  AuthService,
  DalState,
  EduContent,
  EduContentQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  ResultQueries
} from '@campus/dal';
import { Dictionary } from '@ngrx/entity';
import { MemoizedSelectorWithProps, select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AssignmentResult,
  LearningAreasWithResultsInterface
} from './reports.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReportsViewModel {
  // source streams
  learningAreas$: Observable<LearningAreaInterface[]>;

  // presentation streams
  learningAreasWithResults$: Observable<LearningAreasWithResultsInterface>;

  constructor(
    private store: Store<DalState>,
    private authService: AuthService
  ) {
    this.setSourceStreams();
    this.setPresentationStreams();
  }

  public getLearningAreaById(
    areaId: number
  ): Observable<LearningAreaInterface> {
    return this.select(LearningAreaQueries.getById, { id: areaId });
  }

  public getAssignmentResultsByLearningArea(
    learningAreaId: number
  ): Observable<AssignmentResult[]> {
    return combineLatest(
      this.select(EduContentQueries.getAllEntities) as Observable<
        Dictionary<EduContent>
      >,
      this.select(ResultQueries.getAssignmentsForLearningAreaId, {
        learningAreaId,
        groupProp: { taskId: 0 },
        groupType: 'task'
      }) as Observable<AssignmentResult[]>,
      this.select(ResultQueries.getAssignmentsForLearningAreaId, {
        learningAreaId,
        groupProp: { bundleId: 0 },
        groupType: 'bundle'
      }) as Observable<AssignmentResult[]>
    ).pipe(
      map(([eduContents, assignmentsByTaskId, assignmentsBybundleId]) => {
        const assignments = [...assignmentsByTaskId, ...assignmentsBybundleId];

        // eduContents vasthaken
        assignments.forEach(assignment =>
          assignment.exerciseResults.forEach(exResult => {
            exResult.eduContent = eduContents[exResult.eduContentId];
          })
        );

        return assignments;
      })
    );
  }

  private setSourceStreams() {
    this.learningAreas$ = this.select(LearningAreaQueries.getAll);
  }

  private setPresentationStreams() {}

  private select<T, Props>(
    selector: MemoizedSelectorWithProps<DalState, Props, T>,
    payload?: Props
  ): Observable<T> {
    return this.store.pipe(select(selector, payload));
  }
}
