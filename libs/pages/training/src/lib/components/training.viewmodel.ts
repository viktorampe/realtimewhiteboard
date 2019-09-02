import { Injectable } from '@angular/core';
import { StateResolver, StateResolverInterface } from '@campus/pages/shared';
import { Action, Selector } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingViewModel implements StateResolverInterface {

  resolve(): Observable<boolean> {
    return this.stateResolver.resolve(
      this.getLoadableActions(),
      this.getResolvedQueries()
    );
  }

  getLoadableActions(): Action[] {
    return [
      // TODO add load actions, eg. new LearningAreaActions.LoadLearningAreas()
    ];
  }

  getResolvedQueries(): Selector<object, boolean>[] {
    return [
      // TODO add loaded queries, eg. LearningAreaQueries.getLoaded
    ];
  }

  constructor(
    // eg. store: Store<DalState>,
    private stateResolver: StateResolver
  ) {}
}
