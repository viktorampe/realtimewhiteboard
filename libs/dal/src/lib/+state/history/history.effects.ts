import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { HistoryServiceInterface, HISTORY_SERVICE_TOKEN } from '../../history/history.service.interface';
import {
  HistoryActionTypes,
  HistoryLoadError,
  LoadHistory,
  HistoryLoaded
} from './history.actions';
import { DalState } from '..';

@Injectable()
export class HistoryEffects {
  @Effect()
  loadHistory$ = this.dataPersistence.fetch(
    HistoryActionTypes.LoadHistory,
    {
      run: (action: LoadHistory, state: DalState) => {
        if (!action.payload.force && state.history.loaded) return;
        return this.historyService
          .getAllForUser(action.payload.userId)
          .pipe(map(history => new HistoryLoaded({ history })));
      },
      onError: (action: LoadHistory, error) => {
        return new HistoryLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(HISTORY_SERVICE_TOKEN)
    private historyService: HistoryServiceInterface
  ) {}
}
