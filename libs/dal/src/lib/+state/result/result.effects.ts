import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  ResultsServiceInterface,
  RESULTS_SERVICE_TOKEN
} from '../../results/results.service.interface';
import {
  LoadResults,
  ResultsActionTypes,
  ResultsLoaded,
  ResultsLoadError
} from './result.actions';

@Injectable()
export class ResultEffects {
  @Effect()
  loadResults$ = this.dataPersistence.fetch(ResultsActionTypes.LoadResults, {
    run: (action: LoadResults, state: DalState) => {
      if (!action.payload.force && state.results.loaded) return;
      return this.resultService
        .getAllForUser(action.payload.userId)
        .pipe(map(results => new ResultsLoaded({ results })));
    },
    onError: (action: LoadResults, error) => {
      return new ResultsLoadError(error);
    }
  });

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(RESULTS_SERVICE_TOKEN)
    private resultService: ResultsServiceInterface
  ) {}
}
