import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HistoryInterface } from '@campus/dal';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  HistoryActionTypes,
  HistoryLoaded,
  HistoryLoadError,
  LoadHistory
} from './history.actions';

//TODO remove when actual token is available
export const HISTORY_SERVICE_TOKEN = new InjectionToken('HistoryService');
interface HistoryServiceInterface {
  getAllForUser(id: number): Observable<HistoryInterface[]>;
}

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
