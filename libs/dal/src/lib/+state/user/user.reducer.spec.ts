import { PersonInterface, UserLoaded, userReducer } from '@campus/dal';
import { UserLoadError, UserRemoved, UserRemoveError } from './user.actions';
import { initialUserstate, UserState } from './user.reducer';

describe('User Reducer', () => {
  beforeEach(() => {});

  function createFilledUserState(): UserState {
    return {
      currentUser: {
        email: 'test'
      },
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
  ): UserState {
    const state: UserState = {
      currentUser: user,
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
        const action = new UserLoaded(user);
        const result = userReducer(initialUserstate, action);
        expect(result).toEqual(createState(user, true, null));
      });

      it('should error', () => {
        const error = 'Something went wrong';
        const action = new UserLoadError({ error });
        const result = userReducer(initialUserstate, action);
        expect(result).toEqual(createState(null, false, { error }));
      });
    });

    describe('removed action', () => {
      it('should remove user', () => {
        const action = new UserRemoved();
        const result = userReducer(createFilledUserState(), action);
        expect(result).toEqual(initialUserstate);
      });

      it('should error', () => {
        const error = 'Something went wrong';
        const action = new UserRemoveError({ error });
        const result = userReducer(createFilledUserState(), action);
        expect(result).toEqual(
          createState(
            createFilledUserState().currentUser,
            createFilledUserState().loaded,
            { error }
          )
        );
      });
    });
  });
});
