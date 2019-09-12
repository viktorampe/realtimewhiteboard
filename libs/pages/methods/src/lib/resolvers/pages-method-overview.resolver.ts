import { Injectable } from '@angular/core';
import {
  DalState,
  EduContentBookActions,
  EduContentBookQueries,
  MethodQueries,
  StateResolver
} from '@campus/dal';
import { Action, select, Selector, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MethodOverviewResolver extends StateResolver {
  constructor(private store: Store<DalState>) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    let methodIds: number[];
    this.store
      .pipe(
        select(MethodQueries.getAllowedMethodIds),
        take(1)
      )
      .subscribe(ids => (methodIds = ids)); // methodsIds resolved in app resolver
    return [new EduContentBookActions.LoadEduContentBooks({ methodIds })];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [EduContentBookQueries.getLoaded];
  }
}
