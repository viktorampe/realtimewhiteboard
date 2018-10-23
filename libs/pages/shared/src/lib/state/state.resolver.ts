import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DalState } from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StateResolver {
  constructor(private store: Store<DalState>) {}

  resolve(
    actions: Action[],
    resolvedQueries: Selector<object, boolean>[]
  ): Observable<boolean> {
    this.loadActions(actions);
    return this.actionsLoaded(resolvedQueries.map(q => this.store.select(q)));
  }

  private loadActions(actions: Action[]): void {
    actions.forEach(action => {
      this.store.dispatch(action);
    });
  }

  private actionsLoaded(loaded$: Observable<boolean>[]): Observable<boolean> {
    return combineLatest(loaded$).pipe(
      map(loadedArray => loadedArray.every(loaded => loaded)),
      filter(loaded => loaded),
      take(1)
    );
  }
}

export interface StateResolverInterface extends Resolve<boolean> {
  getLoadableActions(data: any): Action[];
  getResolvedQueries(): Selector<object, boolean>[];
}
