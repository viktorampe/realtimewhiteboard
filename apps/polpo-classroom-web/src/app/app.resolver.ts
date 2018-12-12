import { Injectable } from '@angular/core';
import { DalState, StateResolver, UserActions, UserQueries } from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AppResolver extends StateResolver {
  constructor(private store: Store<DalState>) {
    super(store);
  }

  protected getLoadableActions(): Action[] {
    console.log('%cloading actions for app', 'color: red; font-weight: bold;');
    return [
      new UserActions.LoadUser({ force: false })
      // credentials
    ];
  }
  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      UserQueries.getLoaded
      // credentials
    ];
  }
}
