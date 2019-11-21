import { Injectable } from '@angular/core';
import {
  DalState,
  EduContentBookActions,
  StateResolver,
  UnlockedFreePracticeQueries
} from '@campus/dal';
import { Action, select, Selector, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PracticeOverviewResolver extends StateResolver {
  constructor(private store: Store<DalState>) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    let bookIds: number[];
    this.store
      .pipe(
        select(UnlockedFreePracticeQueries.getAll),
        take(1)
      )
      .subscribe(ufps => (bookIds = ufps.map(ufp => ufp.eduContentBookId)));

    return [new EduContentBookActions.LoadEduContentBooksFromIds({ bookIds })];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
        UnlockedFreePracticeQueries.getLoaded,
        EduContentBookQueries.getLoaded
    ];
  }
}
