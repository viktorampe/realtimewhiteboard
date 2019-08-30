import { Inject, Injectable } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { undo } from 'ngrx-undo';
import { from, Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../+state/effect-feedback';
import { EffectFeedbackActionTypes } from '../+state/effect-feedback/effect-feedback.actions';
import {
  UndoableActionInterface,
  UndoServiceInterface
} from './undo.service.interface';
@Injectable()
export class UndoService implements UndoServiceInterface {
  constructor(@Inject('uuid') private uuid: Function) {}

  public undo(
    action: Action
  ): {
    type: string;
    payload: Action;
  } {
    return undo(action);
  }
  public dispatchActionAsUndoable({
    action,
    dataPersistence,
    undoLabel,
    undoneLabel,
    doneLabel,
    intendedSideEffect,
    undoButtonLabel = 'Annuleren'
  }: UndoableActionInterface): Observable<Action> {
    const undoAction = this.undo(action);
    const uuid = this.uuid();
    const warningFeedback = new EffectFeedback({
      id: uuid,
      triggerAction: action,
      message: undoLabel,
      userActions: [{ title: undoButtonLabel, userAction: undoAction }],
      type: 'success',
      priority: Priority.NORM
    });
    dataPersistence.store.dispatch(
      new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback: warningFeedback
      })
    );
    return dataPersistence.actions.pipe(
      ofType(EffectFeedbackActionTypes.DeleteEffectFeedback),
      filter(
        (deleteFeedbackAction: EffectFeedbackActions.DeleteEffectFeedback) =>
          deleteFeedbackAction.payload.id === uuid
      ),
      take(1),
      switchMap(
        (deleteFeedbackAction: EffectFeedbackActions.DeleteEffectFeedback) => {
          if (deleteFeedbackAction.payload.userAction !== undoAction) {
            return intendedSideEffect.pipe(
              tap(res => {
                if (res) dataPersistence.store.dispatch(res);
              }), //TODO: do this cleanly AB#1915
              map(res => {
                const effectFeedback = new EffectFeedback({
                  id: this.uuid(),
                  triggerAction: action,
                  message: doneLabel,
                  userActions: null,
                  type: 'success',
                  priority: Priority.NORM
                });

                return new EffectFeedbackActions.AddEffectFeedback({
                  effectFeedback
                });
              })
            );
          } else {
            const effectFeedback = new EffectFeedback({
              id: this.uuid(),
              triggerAction: action,
              message: undoneLabel,
              userActions: null,
              type: 'success',
              priority: Priority.NORM
            });
            return from([
              new EffectFeedbackActions.AddEffectFeedback({
                effectFeedback
              })
            ]);
          }
        }
      )
    );
  }
}
