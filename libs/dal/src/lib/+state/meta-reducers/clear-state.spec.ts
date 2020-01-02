import { ActionReducer } from '@ngrx/store';
import { UserActions } from '../user';
import { clearState } from './clear-state';

const hydratedState = {
  foo: {
    bar: [1, 2, 3, 4]
  }
};

const userRemovedAction = new UserActions.UserRemoved();

const mockRootReducer: ActionReducer<any> = (state, action) => {
  return state;
};

describe('clear state meta reducer', () => {
  it('should clear the app state when the dispatched action = user removed', () => {
    const result = clearState(mockRootReducer);

    expect(result(hydratedState, userRemovedAction)).toBe(undefined);
  });

  it('should return the app state when the dispatched action != user removed', () => {
    const result = clearState(mockRootReducer);

    expect(result(hydratedState, { type: 'not user removed action' })).toBe(
      hydratedState
    );
  });
});
