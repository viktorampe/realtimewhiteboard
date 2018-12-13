import { Injectable } from '@angular/core';
import {
  AuthService,
  DalState,
  EduContentQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  PersonInterface,
  ResultQueries,
  UiQuery,
  UserQueries
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { MemoizedSelectorWithProps, select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportService } from '../services/report.service';
import {
  AssignmentResultInterface,
  LearningAreasWithResultsInterface
} from './reports.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReportsViewModel {
  // source streams
  listFormat$: Observable<ListFormat>;
  user$: Observable<PersonInterface>;

  // intermediate streams

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
  ): Observable<AssignmentResultInterface[]> {
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
    this.listFormat$ = this.select(UiQuery.getListFormat);
    this.user$ = this.select(UserQueries.getCurrentUser);
  }

  private setPresentationStreams() {
    this.learningAreasWithResults$ = this.getLearningAreasWithResult();
  }

  private getLearningAreasWithResult(): Observable<
    LearningAreasWithResultsInterface
  > {
    return combineLatest(
      this.select(LearningAreaQueries.getAllEntities),
      this.select(ResultQueries.getResultsGroupedByArea)
    ).pipe(
      map(([areaEntities, resultsByArea]) => {
        const learningAreasWithResult = {
          learningAreas: Object.keys(resultsByArea).map(learningAreaId => {
            const results = resultsByArea[learningAreaId];
            return {
              learningArea: areaEntities[learningAreaId],
              tasksWithResultsCount: new Set(
                results.filter(result => result.taskId).map(result => result.id)
              ).size,
              bundlesWithResultsCount: new Set(
                results
                  .filter(result => result.bundleId)
                  .map(result => result.id)
              ).size
            };
          })
        };

        return learningAreasWithResult;
      })
    );
  }

  private select<T, Props>(
    selector: MemoizedSelectorWithProps<DalState, Props, T>,
    payload?: Props
  ): Observable<T> {
    return this.store.pipe(select(selector, payload));
  }
}
