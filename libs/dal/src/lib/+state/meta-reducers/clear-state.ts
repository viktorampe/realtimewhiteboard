import { Action, ActionReducer } from '@ngrx/store';
import { DalState } from '../dal.state.interface';
import { UserActions } from '../user';

export function clearState(
  rootReducer: ActionReducer<any>
): ActionReducer<any> {
  return function(state: DalState, action: Action) {
    if (action.type === UserActions.UserActionTypes.UserRemoved) {
      // return an undefined state
      // therefore all of the reducers will return the initial value as they are supposed to
      state = undefined;
    }

    return rootReducer(state, action);
  };
}
