import { Injectable } from '@angular/core';
import {
  AuthService,
  DalState,
  EduContentQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  ResultQueries
} from '@campus/dal';
import { MemoizedSelectorWithProps, select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportService } from '../services/report.service';
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
    private authService: AuthService,
    private reportService: ReportService
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
      this.select(EduContentQueries.getAllEntities),
      this.select(ResultQueries.getResultsForLearningAreaIdGrouped, {
        learningAreaId,
        groupProp: { taskId: 0 }
      }),
      this.select(ResultQueries.getResultsForLearningAreaIdGrouped, {
        learningAreaId,
        groupProp: { bundleId: 0 }
      })
    ).pipe(
      map(([eduContents, resultsByTaskId, resultsByBundleId]) => {
        return [
          ...this.reportService.getAssignmentResults(
            resultsByTaskId,
            'task',
            eduContents
          ),
          ...this.reportService.getAssignmentResults(
            resultsByBundleId,
            'bundle',
            eduContents
          )
        ];
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
