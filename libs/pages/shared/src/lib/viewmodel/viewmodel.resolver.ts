import { DalState } from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

export class ViewModelResolver {
  constructor(private store: Store<DalState>) {}

  resolve(
    actions: Action[],
    resolvedQueries: Selector<object, boolean>[]
  ): Observable<boolean> {
    this.loadActions(actions);
    return this.actionsLoaded(resolvedQueries.map(q => this.store.select(q)));
  }

  private loadActions(actions: Action[]) {
    actions.forEach(action => {
      this.store.dispatch(action);
    });
  }

  private actionsLoaded(loaded$: Observable<boolean>[]) {
    return combineLatest(loaded$).pipe(
      map(loadedArray => loadedArray.every(loaded => loaded)),
      filter(loaded => loaded),
      take(1)
    );
  }
}

export abstract class AbstractViewModelResolver {
  protected abstract getLoadableActions(): Action[];
  protected abstract getResolvedQueries(): Selector<object, boolean>[];
}
