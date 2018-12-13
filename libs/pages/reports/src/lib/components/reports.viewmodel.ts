import { Injectable } from '@angular/core';
import {
  DalState,
  LearningAreaQueries,
  PersonInterface,
  ResultQueries,
  UiQuery,
  UserQueries
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { MemoizedSelectorWithProps } from '@ngrx/store/src/selector';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LearningAreasWithResultsInterface } from './reports.viewmodel.interfaces';

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

  constructor(private store: Store<DalState>) {
    this.setSourceStreams();
    this.setPresentationStreams();
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
              tasksWithResultsCount: new Set<number>(
                results
                  .filter(result => result.taskId)
                  .map(result => result.taskId)
              ).size,
              bundlesWithResultsCount: new Set<number>(
                results
                  .filter(result => result.bundleId)
                  .map(result => result.bundleId)
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
