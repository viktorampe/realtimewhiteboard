import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import { HistoryServiceInterface, HISTORY_SERVICE_TOKEN } from '../../history';
import {
  HistoryActionTypes,
  HistoryLoaded,
  HistoryLoadError,
  LoadHistory
} from './history.actions';

@Injectable()
export class HistoryEffects {
  @Effect()
  loadHistory$ = this.dataPersistence.fetch(HistoryActionTypes.LoadHistory, {
    run: (action: LoadHistory, state: DalState) => {
      if (!action.payload.force && state.history.loaded) return;
      return this.historyService
        .getAllForUser(action.payload.userId)
        .pipe(map(history => new HistoryLoaded({ history })));
    },
    onError: (action: LoadHistory, error) => {
      return new HistoryLoadError(error);
    }
  });

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(HISTORY_SERVICE_TOKEN)
    private historyService: HistoryServiceInterface
  ) {}
}
