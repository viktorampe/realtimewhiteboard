import { Action } from '@ngrx/store';

export enum DalActionTypes {
  ActionSuccessful = '[DalActions] Action Successfull'
}

export class ActionSuccessful implements Action {
  readonly type = DalActionTypes.ActionSuccessful;

  constructor(public payload: { successfulAction: string }) {}
}

export type DalActions = ActionSuccessful;
