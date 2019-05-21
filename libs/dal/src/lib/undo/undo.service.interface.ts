import { InjectionToken } from '@angular/core';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/nx';
import { Observable } from 'rxjs';
import { DalState } from '../+state';
import { FeedbackTriggeringAction } from '../+state/effect-feedback';

export const UNDO_SERVICE_TOKEN = new InjectionToken('UndoService');

export interface UndoServiceInterface {
  undo(
    action: Action
  ): {
    type: string;
    payload: Action;
  };
  dispatchActionAsUndoable<T extends DalState>(
    payload: UndoableActionInterface<T>
  ): Observable<Action>;
}

export interface UndoableActionInterface<T extends DalState> {
  action: FeedbackTriggeringAction;
  dataPersistence: DataPersistence<T>;
  undoLabel: string;
  undoneLabel: string;
  doneLabel: string;
  intendedAction: Observable<any>;
  undoButtonLabel?: string;
}
