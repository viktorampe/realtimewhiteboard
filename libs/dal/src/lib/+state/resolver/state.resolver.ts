import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DalState } from '@campus/dal';
import { Action, select, Selector, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export abstract class StateResolver implements Resolve<boolean> {
  constructor(private superStore: Store<DalState>) {}

  resolve(): Observable<boolean> {
    this.loadActions(this.getLoadableActions());
    return this.actionsLoaded(
      this.getResolvedQueries().map(query =>
        this.superStore.pipe(select(query))
      )
    );
  }

  protected abstract getLoadableActions(): Action[];
  protected abstract getResolvedQueries(): Selector<object, boolean>[];

  private loadActions(actions: Action[]): void {
    actions.forEach(action => {
      this.superStore.dispatch(action);
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
