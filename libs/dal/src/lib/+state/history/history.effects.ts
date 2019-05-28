import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { undo } from 'ngrx-undo';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  HistoryServiceInterface,
  HISTORY_SERVICE_TOKEN
} from '../../history/history.service.interface';
import { UndoServiceInterface, UNDO_SERVICE_TOKEN } from '../../undo';
import { EffectFeedback, EffectFeedbackActions } from '../effect-feedback';
import {
  DeleteHistory,
  HistoryActionTypes,
  HistoryLoaded,
  HistoryLoadError,
  LoadHistory,
  StartUpsertHistory,
  UpsertHistory
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

  @Effect()
  startUpsertHistory$ = this.dataPersistence.pessimisticUpdate(
    HistoryActionTypes.StartUpsertHistory,
    {
      run: (action: StartUpsertHistory, state: DalState) => {
        return this.historyService
          .upsertHistory(action.payload.history)
          .pipe(map(history => new UpsertHistory({ history })));
      },
      onError: (action: StartUpsertHistory, error) => {
        // Feedback for failed add to history ?
      }
    }
  );

  @Effect()
  deleteHistory$ = this.dataPersistence.optimisticUpdate(
    HistoryActionTypes.DeleteHistory,
    {
      run: (action: DeleteHistory, state: DalState) => {
        return this.undoService.dispatchActionAsUndoable({
          action: action,
          dataPersistence: this.dataPersistence,
          intendedSideEffect: this.historyService.deleteHistory(
            action.payload.userId,
            action.payload.id
          ),
          undoLabel: 'Geschiedenis wordt verwijderd',
          doneLabel: 'Geschiedenis is verwijderd',
          undoneLabel: 'Geschiedenis is niet verwijderd'
        });
      },
      undoAction: (action: DeleteHistory, error) => {
        const undoAction = undo(action);
        const effectFeedback = EffectFeedback.generateErrorFeedback(
          this.uuid(),
          action,
          'Het is niet gelukt om het item uit jouw geschiedenis te verwijderen.'
        );

        const effectFeedbackAction = new EffectFeedbackActions.AddEffectFeedback(
          { effectFeedback }
        );
        return from([undoAction, effectFeedbackAction]);
      }
    }
  );

  constructor(
    @Inject('uuid') private uuid: Function,
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(HISTORY_SERVICE_TOKEN)
    private historyService: HistoryServiceInterface,
    @Inject(UNDO_SERVICE_TOKEN) private undoService: UndoServiceInterface
  ) {}
}
