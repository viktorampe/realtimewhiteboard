import { UnlockedContentQueries } from '.';
import { UnlockedContentInterface } from '../../+models';
import { State } from './unlocked-content.reducer';

describe('UnlockedContent Selectors', () => {
  function createUnlockedContent(id: number): UnlockedContentInterface | any {
    return {
      id: id
    };
  }

  function createState(
    unlockedContents: UnlockedContentInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: unlockedContents ? unlockedContents.map(unlockedContent => unlockedContent.id) : [],
      entities: unlockedContents
        ? unlockedContents.reduce(
            (entityMap, unlockedContent) => ({
              ...entityMap,
              [unlockedContent.id]: unlockedContent
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let unlockedContentState: State;
  let storeState: any;

  describe('UnlockedContent Selectors', () => {
    beforeEach(() => {
      unlockedContentState = createState(
        [
          createUnlockedContent(4),
          createUnlockedContent(1),
          createUnlockedContent(2),
          createUnlockedContent(3)
        ],
        true,
        'no error'
      );
      storeState = { unlockedContents: unlockedContentState };
    });
    it('getError() should return the error', () => {
      const results = UnlockedContentQueries.getError(storeState);
      expect(results).toBe(unlockedContentState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = UnlockedContentQueries.getLoaded(storeState);
      expect(results).toBe(unlockedContentState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = UnlockedContentQueries.getAll(storeState);
      expect(results).toEqual([
        createUnlockedContent(4),
        createUnlockedContent(1),
        createUnlockedContent(2),
        createUnlockedContent(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = UnlockedContentQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = UnlockedContentQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = UnlockedContentQueries.getAllEntities(storeState);
      expect(results).toEqual(unlockedContentState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = UnlockedContentQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createUnlockedContent(3),
        createUnlockedContent(1),
        undefined,
        createUnlockedContent(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = UnlockedContentQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createUnlockedContent(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = UnlockedContentQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
