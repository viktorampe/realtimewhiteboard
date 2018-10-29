import { Injectable } from '@angular/core';
import { DalState, StateResolver } from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class HeaderResolver extends StateResolver {
  constructor(private store: Store<DalState>) {
    super(store);
    // Object.setPrototypeOf(this, new.target.prototype);
  }

  getLoadableActions(): Action[] {
    return [];
  }
  getResolvedQueries(): Selector<object, boolean>[] {
    return [];
  }
}
