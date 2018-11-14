import { Injectable } from '@angular/core';
import { DalState, StateResolver } from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class TasksResolver extends StateResolver {
  constructor(private store: Store<DalState>) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    return [
      // TODO add actions
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      //TODO add loaded queries
    ];
  }
}
