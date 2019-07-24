import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentQueries,
  LearningAreaInterface,
  LearningAreaQueries,
  ResultInterface,
  ResultQueries,
  UiActions,
  UiQuery
} from '@campus/dal';
import {
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
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
  // presentation streams
  learningAreasWithResults$: Observable<LearningAreasWithResultsInterface>;

  constructor(
    private store: Store<DalState>,
    private reportService: ReportService,
    @Inject(SCORM_EXERCISE_SERVICE_TOKEN)
    private scormExerciseService: ScormExerciseServiceInterface,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    this.setSourceStreams();
    this.setPresentationStreams();
  }

  public changeListFormat(listFormat: ListFormat): void {
    this.store.dispatch(new UiActions.SetListFormat({ listFormat }));
  }

  public getLearningAreaById(
    areaId: number
  ): Observable<LearningAreaInterface> {
    return this.select(LearningAreaQueries.getById, { id: areaId });
  }

  public getAssignmentResultsByLearningArea(
    learningAreaId: number
  ): Observable<AssignmentResultInterface[]> {
    return combineLatest([
      this.select(EduContentQueries.getAllEntities),
      this.select(ResultQueries.getResultsForLearningAreaIdGrouped, {
        learningAreaId,
        groupProp: { taskId: 0 }
      }),
      this.select(ResultQueries.getResultsForLearningAreaIdGrouped, {
        learningAreaId,
        groupProp: { bundleId: 0 }
      })
    ]).pipe(
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
  }

  private setPresentationStreams() {
    this.learningAreasWithResults$ = this.getLearningAreasWithResult();
  }

  private getLearningAreasWithResult(): Observable<
    LearningAreasWithResultsInterface
  > {
    return combineLatest([
      this.select(LearningAreaQueries.getAllEntities),
      this.select(ResultQueries.getResultsGroupedByArea)
    ]).pipe(
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

  openContentForReview(result: ResultInterface): void {
    this.scormExerciseService.reviewExerciseFromResult(result);
  }

  private select<T, Props>(
    selector: MemoizedSelectorWithProps<DalState, Props, T>,
    payload?: Props
  ): Observable<T> {
    return this.store.pipe(select(selector, payload));
  }
}
