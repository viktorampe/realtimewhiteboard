import { CredentialQueries } from '.';
import { PassportUserCredentialInterface } from '../../+models';
import { State } from './credential.reducer';

describe('Credential Selectors', () => {
  function createCredential(id: number): PassportUserCredentialInterface | any {
    return {
      id: id
    };
  }

  function createState(
    credentials: PassportUserCredentialInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
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
      loaded: loaded,
      error: error
    };
  }

  let credentialState: State;
  let storeState: any;

  describe('Credential Selectors', () => {
    beforeEach(() => {
      credentialState = createState(
        [
          createCredential(4),
          createCredential(1),
          createCredential(2),
          createCredential(3)
        ],
        true,
        'no error'
      );
      storeState = { credentials: credentialState };
    });
    it('getError() should return the error', () => {
      const results = CredentialQueries.getError(storeState);
      expect(results).toBe(credentialState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = CredentialQueries.getLoaded(storeState);
      expect(results).toBe(credentialState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = CredentialQueries.getAll(storeState);
      expect(results).toEqual([
        createCredential(4),
        createCredential(1),
        createCredential(2),
        createCredential(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = CredentialQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = CredentialQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = CredentialQueries.getAllEntities(storeState);
      expect(results).toEqual(credentialState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = CredentialQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createCredential(3),
        createCredential(1),
        undefined,
        createCredential(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = CredentialQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createCredential(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = CredentialQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
