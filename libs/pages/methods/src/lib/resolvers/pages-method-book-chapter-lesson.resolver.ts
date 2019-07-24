import { Injectable } from '@angular/core';
import { DalState, StateResolver } from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class MethodBookChapterLessonResolver extends StateResolver {
  constructor(private store: Store<DalState>) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    return [];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [];
  }
}
