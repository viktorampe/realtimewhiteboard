import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select } from '@ngrx/store';
import { DataPersistence } from '@nrwl/nx';
import { from, interval, Observable, Subject } from 'rxjs';
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { AlertActions } from '.';
import { DalActions } from '..';
import {
  AlertServiceInterface,
  ALERT_SERVICE_TOKEN
} from '../../alert/alert.service.interface';
import {
  UndoServiceInterface,
  UNDO_SERVICE_TOKEN
} from '../../undo/undo.service.interface';
import { EffectFeedbackActions } from '../effect-feedback';
import {
  EffectFeedback,
  Priority
} from '../effect-feedback/effect-feedback.model';
import { DalState } from './../dal.state.interface';
import {
  AlertsActionTypes,
  AlertsLoaded,
  AlertsLoadError,
  LoadAlerts,
  LoadNewAlerts,
  NewAlertsLoaded,
  SetAlertReadByFilter,
  SetReadAlert,
  StartPollAlerts
} from './alert.actions';
import { getAlertIdsByFilter } from './alert.selectors';

const MINIMUM_POLLING_INTERVAL = 3000;

@Injectable()
export class AlertsEffects {
  // Timer singleton
  private pollingTimer$: Observable<LoadNewAlerts>;
  // finishes the Timer
  private timerStopper$: Subject<void> = new Subject();

  @Effect()
  startpollAlerts$ = this.actions.pipe(
    ofType(AlertsActionTypes.StartPollAlerts),
    switchMap(action => this.getNewTimer(<StartPollAlerts>action))
  );

  @Effect()
  stopPollAlerts$ = this.actions.pipe(
    ofType(AlertsActionTypes.StopPollAlerts),
    tap(_ => this.stopTimer()),
    map(
      _ =>
        new DalActions.ActionSuccessful({
          successfulAction: 'polling stopped'
        })
    )
  );

  @Effect()
  setAlertsReadByFilter$ = this.dataPersistence.actions.pipe(
    ofType(AlertsActionTypes.SetAlertReadByFilter),
    switchMap(
      (action: SetAlertReadByFilter): Observable<SetReadAlert> => {
        return this.dataPersistence.store.pipe(
          select(getAlertIdsByFilter, {
            filter: action.payload.filter
          }),
          map(ids => {
            return new SetReadAlert({
              personId: action.payload.personId,
              alertIds: ids,
              intended: action.payload.intended,
              read: action.payload.read
            });
          }),
          take(1)
        );
      }
    )
  );

  @Effect()
  loadAlerts$ = this.dataPersistence.fetch(AlertsActionTypes.LoadAlerts, {
    run: (action: LoadAlerts, state: DalState) => {
      if (!action.payload.force && state.alerts.loaded) return;

      const userId = action.payload.userId;

      // If not provided, set update time to now
      const timeStamp = action.payload.timeStamp || Date.now();

      return this.alertService.getAllForUser(userId).pipe(
        map(alerts => {
          return new AlertsLoaded({ alerts, timeStamp });
        })
      );
    },
    onError: (action: LoadAlerts, error) => {
      return new AlertsLoadError(error);
    }
  });

  @Effect()
  loadNewAlerts$ = this.dataPersistence.fetch(AlertsActionTypes.LoadNewAlerts, {
    run: (action: LoadNewAlerts, state: DalState) => {
      if (!state.alerts.loaded)
        return new LoadAlerts({ userId: action.payload.userId });

      // If not provided, set update time to now
      const timeStamp = action.payload.timeStamp || Date.now();

      return this.alertService
        .getAllForUser(action.payload.userId, timeStamp)
        .pipe(
          map(alerts => {
            return new NewAlertsLoaded({ alerts, timeStamp });
          })
        );
    },
    onError: (action: LoadNewAlerts, error) => {
      return new AlertsLoadError(error);
    }
  });

  @Effect()
  setReadAlert$ = this.dataPersistence.optimisticUpdate(
    AlertsActionTypes.SetReadAlert,
    {
      run: (action: SetReadAlert, state: DalState) => {
        if (!state.alerts.loaded)
          return new LoadAlerts({ userId: action.payload.personId });

        return this.alertService
          .setAlertAsRead(
            action.payload.personId,
            action.payload.alertIds,
            action.payload.read,
            action.payload.intended
          )
          .pipe(
            map(affectedRows => {
              const effectFeedback = new EffectFeedback({
                id: this.uuid(),
                triggerAction: action,
                message: action.payload.read
                  ? 'Melding als gelezen gemarkeerd.'
                  : 'Melding als ongelezen gemarkeerd.',
                userActions: null,
                type: 'success'
              });

              return new EffectFeedbackActions.AddEffectFeedback({
                effectFeedback
              });
            })
          );
      },
      undoAction: (action: SetReadAlert, state: any) => {
        const undoAction = this.undoService.undo(action);

        const effectFeedback = new EffectFeedback({
          id: this.uuid(),
          triggerAction: action,
          message: action.payload.read
            ? 'Het is niet gelukt om de melding als gelezen te markeren.'
            : 'Het is niet gelukt om de melding als ongelezen te markeren.',
          userActions: [{ title: 'Opnieuw', userAction: action }],
          type: 'error',
          priority: Priority.HIGH
        });

        const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback
        });

        // undo the failed action and trigger feedback for user
        return from<Action>([undoAction, feedbackAction]);
      }
    }
  );

  @Effect()
  deleteAlert$ = this.dataPersistence.optimisticUpdate(
    AlertsActionTypes.DeleteAlert,
    {
      run: (action: AlertActions.DeleteAlert, state: DalState) => {
        return this.undoService.dispatchActionAsUndoable({
          action: action,
          dataPersistence: this.dataPersistence,
          intendedSideEffect: this.alertService.deleteAlert(
            action.payload.personId,
            action.payload.id
          ),
          undoLabel: 'Melding wordt verwijderd.',
          undoneLabel: 'Melding is niet verwijderd.',
          doneLabel: 'Melding is verwijderd.'
        });
      },
      undoAction: (action: AlertActions.DeleteAlert, error: any) => {
        // Something went wrong: could be a 401 or 404 ...
        const undoAction = this.undoService.undo(action);

        const effectFeedback = new EffectFeedback({
          id: this.uuid(),
          triggerAction: action,
          message: 'Het is niet gelukt om de melding te verwijderen.',
          userActions: [{ title: 'Opnieuw', userAction: action }],
          type: 'error',
          priority: Priority.HIGH
        });

        const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback
        });

        // undo the failed action and trigger feedback for user
        return from<Action>([undoAction, feedbackAction]);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(UNDO_SERVICE_TOKEN) private undoService: UndoServiceInterface,
    @Inject(ALERT_SERVICE_TOKEN) private alertService: AlertServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}

  private getNewTimer(startPollAction: StartPollAlerts) {
    this.stopTimer();

    const timerInterval = Math.max(
      startPollAction.payload.pollingInterval,
      MINIMUM_POLLING_INTERVAL
    );

    this.pollingTimer$ = interval(timerInterval).pipe(
      takeUntil(this.timerStopper$.pipe(take(1))),
      map(
        values => new LoadNewAlerts({ userId: startPollAction.payload.userId })
      )
    );

    return this.pollingTimer$;
  }

  private stopTimer() {
    this.timerStopper$.next(); // Complete current timer
  }
}
