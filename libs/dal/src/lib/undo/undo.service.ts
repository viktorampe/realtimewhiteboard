import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { undo } from 'ngrx-undo';
import { UndoServiceInterface } from './undo.service.interface';
@Injectable()
export class UndoService implements UndoServiceInterface {
  public undo(
    action: Action
  ): {
    type: string;
    payload: Action;
  } {
    return undo(action);
  }
}
