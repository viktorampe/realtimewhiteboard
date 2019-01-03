import { PersonInterface, UserActions } from '@campus/dal';
import { UserReducer } from '.';
import {
  PermissionsLoadError,
  UserLoadError,
  UserRemoved,
  UserRemoveError
} from './user.actions';

describe('User Reducer', () => {
  beforeEach(() => {});

  function createFilledUserState(): UserReducer.State {
    return {
      currentUser: {
        email: 'test'
      },
      permissions: ['permission-a', 'permission-b', 'permission-c'],
      error: null,
      loaded: true
    };
  }

  /**
   * creates a User.
   * @returns {PersonInterface}
   */
  function createUser(): PersonInterface {
    return {
      email: 'lol@lol.lol'
    };
  }

  /**
   * Utility to create the bundle state.
   *
   * @param {PersonInterface} [user]
   * @param {boolean} [loaded]
   * @param {*} [error]
   * @returns {State}
   */
  function createState(
    user: PersonInterface,
    loaded: boolean = false,
    error?: any,
    permissions?: string[]
  ): UserReducer.State {
    const state: UserReducer.State = {
      currentUser: user,
      permissions: permissions || [],
      loaded: loaded,
      error: error
    };
    if (error !== undefined) state.error = error;
    return state;
  }

  describe('User Reducer', () => {
    let user: PersonInterface = null;

    beforeEach(() => {
      user = createUser();
    });

    describe('loaded action', () => {
      it('should load user', () => {
        const action = new UserActions.UserLoaded(user);
        const result = UserReducer.reducer(UserReducer.initialState, action);
        expect(result).toEqual(createState(user, true, null));
      });

      it('should error', () => {
        const error = 'Something went wrong';
        const action = new UserLoadError({ error });
        const result = UserReducer.reducer(UserReducer.initialState, action);
        expect(result).toEqual(createState(null, false, { error }));
      });
    });

    describe('removed action', () => {
      it('should remove user', () => {
        const action = new UserRemoved();
        const result = UserReducer.reducer(createFilledUserState(), action);
        expect(result).toEqual(UserReducer.initialState);
      });

      it('should error', () => {
        const error = 'Something went wrong';
        const action = new UserRemoveError({ error });
        const result = UserReducer.reducer(createFilledUserState(), action);
        expect(result).toEqual(
          createState(
            createFilledUserState().currentUser,
            createFilledUserState().loaded,
            { error },
            createFilledUserState().permissions
          )
        );
      });
    });

    describe('permissions loaded action', () => {
      it('should load permissions', () => {
        const permissions = [
          'permission-a',
          'permission-b',
          'permission-c',
          'permission-d'
        ];
        const action = new UserActions.PermissionsLoaded(permissions);
        const result = UserReducer.reducer(UserReducer.initialState, action);
        expect(result).toEqual(createState(null, false, null, permissions));
      });

      it('should error', () => {
        const error = 'Something went wrong';
        const action = new PermissionsLoadError({ error });
        const result = UserReducer.reducer(UserReducer.initialState, action);
        expect(result).toEqual(createState(null, false, { error }, []));
      });
    });
  });
});
