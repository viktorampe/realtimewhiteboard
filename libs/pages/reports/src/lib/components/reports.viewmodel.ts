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
import { MemoizedSelectorWithProps, select, Store } from '@ngrx/store';
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
      this.select(ResultQueries.getLearningAreaIds),
      this.select(ResultQueries.getResultsForTasks),
      this.select(ResultQueries.getResultsForBundles)
    ).pipe(
      map(([areaEntities, areaIds, resultsForTasks, resultsForBundles]) => {
        const learningAreasWithResult = {
          learningAreas: areaIds.map(learningAreaId => {
            const tasks = resultsForTasks.filter(
              result => result.learningAreaId === learningAreaId
            );
            const bundles = resultsForBundles.filter(
              result => result.learningAreaId === learningAreaId
            );

            return {
              learningArea: areaEntities[learningAreaId],
              tasksWithResultsCount: tasks.length,
              bundlesWithResultsCount: bundles.length
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
