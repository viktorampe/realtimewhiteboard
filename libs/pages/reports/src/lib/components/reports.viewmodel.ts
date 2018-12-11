import { Injectable } from '@angular/core';
import {
  DalState,
  LearningAreaInterface,
  LearningAreaQueries
} from '@campus/dal';
import { MemoizedSelectorWithProps, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LearningAreasWithResultsInterface } from './reports.viewmodel.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReportsViewModel {
  // source streams
  learningAreas$: Observable<LearningAreaInterface[]>;

  // presentation streams
  learningAreasWithResults$: Observable<LearningAreasWithResultsInterface>;
  constructor(private store: Store<DalState>) {
    this.setSourceStreams();
    this.setPresentationStreams();
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
