import { PersonInterface, UserActions } from '@campus/dal';
import { UserReducer } from '.';
import { PersonFixture } from '../../+fixtures';
import {
  UpdateUser,
  UserLoaded,
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
      lastUpdateMessage: null,
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
   * creates a null User.
   * @returns {PersonInterface}
   */
  function createNullUser(): PersonInterface {
    return null;
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
    error?: any
  ): UserReducer.State {
    const state: UserReducer.State = {
      currentUser: user,
      loaded: loaded,
      lastUpdateMessage: null,
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
            { error }
          )
        );
      });

      describe('update action', () => {
        const mockUser = new PersonFixture();
        const changedProps: Partial<PersonInterface> = {
          firstName: 'new value',
          name: 'new value'
        };
        const updateAction = new UpdateUser({
          userId: mockUser.id,
          changedProps
        });
        let usedState: UserReducer.State;

        beforeEach(() => {
          usedState = UserReducer.reducer(
            UserReducer.initialState,
            new UserLoaded(mockUser)
          );
        });

        it('should update the currentUser', () => {
          const result = UserReducer.reducer(usedState, updateAction);
          expect(result.currentUser).toEqual(
            jasmine.objectContaining(changedProps)
          );
        });

        it('should not store the user password in the state', () => {
          updateAction.payload.changedProps.password = 'sUp3r_s3cUr3_P@ssW0rd!';
          const result = UserReducer.reducer(usedState, updateAction);
          expect(result.currentUser.password).toBeFalsy();
        });
      });
    });
  });
});
