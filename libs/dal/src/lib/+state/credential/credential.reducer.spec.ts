import { Update } from '@ngrx/entity';
import { CredentialActions } from '.';
import { PassportUserCredentialInterface } from '../../+models';
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
  return {
    id: id,
    provider: provider
  };
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

  describe('add actions', () => {
    it('should add one credential', () => {
      const credential = credentials[0];
      const action = new CredentialActions.AddCredential({
        credential
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([credential], false));
    });

    it('should add multiple credentials', () => {
      const action = new CredentialActions.AddCredentials({ credentials });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(credentials, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one credential', () => {
      const originalCredential = credentials[0];

      const startState = reducer(
        initialState,
        new CredentialActions.AddCredential({
          credential: originalCredential
        })
      );

      const updatedCredential = createCredential(credentials[0].id, 'test');

      const action = new CredentialActions.UpsertCredential({
        credential: updatedCredential
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedCredential.id]).toEqual(updatedCredential);
    });

    it('should upsert many credentials', () => {
      const startState = createState(credentials);

      const credentialsToInsert = [
        createCredential(1),
        createCredential(2),
        createCredential(3),
        createCredential(4)
      ];
      const action = new CredentialActions.UpsertCredentials({
        credentials: credentialsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(credentialsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an credential', () => {
      const credential = credentials[0];
      const startState = createState([credential]);
      const update: Update<PassportUserCredentialInterface> = {
        id: 1,
        changes: {
          provider: providerUpdatedValue
        }
      };
      const action = new CredentialActions.UpdateCredential({
        credential: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createCredential(1, providerUpdatedValue)])
      );
    });

    it('should update multiple credentials', () => {
      const startState = createState(credentials);
      const updates: Update<PassportUserCredentialInterface>[] = [
        {
          id: 1,
          changes: {
            provider: providerUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            provider: providerUpdatedValue
          }
        }
      ];
      const action = new CredentialActions.UpdateCredentials({
        credentials: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createCredential(1, providerUpdatedValue),
          createCredential(2, providerUpdatedValue),
          credentials[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one credential ', () => {
      const credential = credentials[0];
      const startState = createState([credential]);
      const action = new CredentialActions.DeleteCredential({
        id: credential.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple credentials', () => {
      const startState = createState(credentials);
      const action = new CredentialActions.DeleteCredentials({
        ids: [credentials[0].id, credentials[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([credentials[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the credentials collection', () => {
      const startState = createState(credentials, true, 'something went wrong');
      const action = new CredentialActions.ClearCredentials();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
