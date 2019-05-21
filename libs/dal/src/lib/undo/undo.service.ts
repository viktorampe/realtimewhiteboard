import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { undo } from 'ngrx-undo';

@Injectable()
export class UndoService {
  public undo(
    action: Action
  ): {
    type: string;
    payload: Action;
  } {
    return undo(action);
  }
}
