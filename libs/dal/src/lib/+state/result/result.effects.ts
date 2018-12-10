import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { ResultServiceInterface, RESULT_SERVICE_TOKEN } from '../../result/result.service.interface';
import {
  ResultsActionTypes,
  ResultsLoadError,
  LoadResults,
  ResultsLoaded
} from './result.actions';
import { DalState } from '..';

@Injectable()
export class ResultEffects {
  @Effect()
  loadResults$ = this.dataPersistence.fetch(
    ResultsActionTypes.LoadResults,
    {
      run: (action: LoadResults, state: DalState) => {
        if (!action.payload.force && state.results.loaded) return;
        return this.resultService
          .getAllForUser(action.payload.userId)
          .pipe(map(results => new ResultsLoaded({ results })));
      },
      onError: (action: LoadResults, error) => {
        return new ResultsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(RESULT_SERVICE_TOKEN)
    private resultService: ResultServiceInterface
  ) {}
}
