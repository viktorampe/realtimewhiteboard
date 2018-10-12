import { UserContentQueries } from '.';
import { UserContentInterface } from '../../+models';
import { State } from './user-content.reducer';

describe('UserContent Selectors', () => {
  function createUserContent(id: number): UserContentInterface | any {
    return {
      id: id
    };
  }

  function createState(
    userContents: UserContentInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: userContents ? userContents.map(userContent => userContent.id) : [],
      entities: userContents
        ? userContents.reduce(
            (entityMap, userContent) => ({
              ...entityMap,
              [userContent.id]: userContent
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let userContentState: State;
  let storeState: any;

  describe('UserContent Selectors', () => {
    beforeEach(() => {
      userContentState = createState(
        [
          createUserContent(4),
          createUserContent(1),
          createUserContent(2),
          createUserContent(3)
        ],
        true,
        'no error'
      );
      storeState = { userContents: userContentState };
    });
    it('getError() should return the error', () => {
      const results = UserContentQueries.getError(storeState);
      expect(results).toBe(userContentState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = UserContentQueries.getLoaded(storeState);
      expect(results).toBe(userContentState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = UserContentQueries.getAll(storeState);
      expect(results).toEqual([
        createUserContent(4),
        createUserContent(1),
        createUserContent(2),
        createUserContent(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = UserContentQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = UserContentQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = UserContentQueries.getAllEntities(storeState);
      expect(results).toEqual(userContentState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = UserContentQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createUserContent(3),
        createUserContent(1),
        undefined,
        createUserContent(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = UserContentQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createUserContent(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = UserContentQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
