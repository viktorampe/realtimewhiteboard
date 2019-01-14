import { CredentialActions } from '.';
import { PassportUserCredentialInterface } from '../../+models';
import { CredentialFixture } from './../../+fixtures/Credential.fixture';
import { initialState, reducer, State } from './credential.reducer';

const providerInitialValue = 'facebook';
const providerUpdatedValue = 'smartschool';

/**
 * Creates a Credential.
 * @param {number} id
 * @returns {PassportUserCredentialInterface}
 */
function createCredential(
  id: number,
  provider: any = providerInitialValue
): PassportUserCredentialInterface | any {
  return new CredentialFixture({
    id: id,
    provider: provider
  });
}

/**
 * Utility to create the credential state.
 *
 * @param {PassportUserCredentialInterface[]} credentials
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  credentials: PassportUserCredentialInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: credentials ? credentials.map(credential => credential.id) : [],
    entities: credentials
      ? credentials.reduce(
          (entityMap, credential) => ({
            ...entityMap,
            [credential.id]: credential
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('Credentials Reducer', () => {
  let credentials: PassportUserCredentialInterface[];
  beforeEach(() => {
    credentials = [
      createCredential(1),
      createCredential(2),
      createCredential(3)
    ];
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should load all credentials', () => {
      const action = new CredentialActions.CredentialsLoaded({ credentials });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(credentials, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new CredentialActions.CredentialsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('unlink actions', () => {
    it('should delete one credential ', () => {
      const credential = credentials[0];
      const startState = createState([credential]);
      const action = new CredentialActions.UnlinkCredential({
        id: credential.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });
  });
});
