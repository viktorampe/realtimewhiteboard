import { InjectionToken } from '@angular/core';
import { Action } from '@ngrx/store';

export const UNDO_SERVICE_TOKEN = new InjectionToken('UndoService');

export interface UndoServiceInterface {
  undo(
    action: Action
  ): {
    type: string;
    payload: Action;
  };
}
