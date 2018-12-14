import { Inject, Injectable } from '@angular/core';
import {
  ContentInterface,
  DalState,
  EduContentQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  PersonInterface,
  ResultQueries,
  UiQuery,
  UserQueries
} from '@campus/dal';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '@campus/shared';
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
    private reportService: ReportService,
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface
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
            const taskIds = new Set(),
              bundleIds = new Set();
            resultsByArea[learningAreaId].forEach(result => {
              if (result.taskId) taskIds.add(result.taskId);
              if (result.bundleId) bundleIds.add(result.bundleId);
            });
            return {
              learningArea: areaEntities[learningAreaId],
              tasksWithResultsCount: taskIds.size,
              bundlesWithResultsCount: bundleIds.size
            };
          })
        };
        return learningAreasWithResult;
      })
    );
  }

  openBook(content: ContentInterface): void {
    this.openStaticContentService.open(content);
  }

  private select<T, Props>(
    selector: MemoizedSelectorWithProps<DalState, Props, T>,
    payload?: Props
  ): Observable<T> {
    return this.store.pipe(select(selector, payload));
  }
}
