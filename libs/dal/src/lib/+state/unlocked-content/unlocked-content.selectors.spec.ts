import { UnlockedContentQueries } from '.';
import { UnlockedContentFixture } from '../../+fixtures';
import { UnlockedContentInterface } from '../../+models';
import { State } from './unlocked-content.reducer';

describe('UnlockedContent Selectors', () => {
  function createUnlockedContent(id: number): UnlockedContentInterface | any {
    return {
      id: id,
      bundleId: Math.round(id / 2)
    };
  }

  function createUnlockedContentWithIds(
    id: number,
    bundleId: number,
    eduContentId: number,
    userContentId: number
  ): UnlockedContentInterface | any {
    return new UnlockedContentFixture({
      id: id,
      bundleId: bundleId,
      eduContentId: eduContentId,
      userContentId: userContentId
    });
  }

  function createState(
    unlockedContents: UnlockedContentInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: unlockedContents
        ? unlockedContents.map(unlockedContent => unlockedContent.id)
        : [],
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

  let unlockedContentStateWithIds: State;
  let storeStateWithIds: any;

  describe('UnlockedContent Selectors', () => {
    beforeEach(() => {
      unlockedContentStateWithIds = createState(
        [
          createUnlockedContent(4),
          createUnlockedContent(1),
          createUnlockedContent(2),
          createUnlockedContent(3)
        ],
        true,
        'no error'
      );
      storeStateWithIds = { unlockedContents: unlockedContentStateWithIds };
    });
    it('getError() should return the error', () => {
      const results = UnlockedContentQueries.getError(storeStateWithIds);
      expect(results).toBe(unlockedContentStateWithIds.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = UnlockedContentQueries.getLoaded(storeStateWithIds);
      expect(results).toBe(unlockedContentStateWithIds.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = UnlockedContentQueries.getAll(storeStateWithIds);
      expect(results).toEqual([
        createUnlockedContent(4),
        createUnlockedContent(1),
        createUnlockedContent(2),
        createUnlockedContent(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = UnlockedContentQueries.getCount(storeStateWithIds);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = UnlockedContentQueries.getIds(storeStateWithIds);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = UnlockedContentQueries.getAllEntities(storeStateWithIds);
      expect(results).toEqual(unlockedContentStateWithIds.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = UnlockedContentQueries.getByIds(storeStateWithIds, {
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
      const results = UnlockedContentQueries.getById(storeStateWithIds, {
        id: 2
      });
      expect(results).toEqual(createUnlockedContent(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = UnlockedContentQueries.getById(storeStateWithIds, {
        id: 9
      });
      expect(results).toBe(undefined);
    });
    it('getByBundleIds() should return undefined if the entity is not present', () => {
      const results = UnlockedContentQueries.getByBundleIds(storeStateWithIds);
      expect(results).toEqual({
        1: [createUnlockedContent(1), createUnlockedContent(2)],
        2: [createUnlockedContent(4), createUnlockedContent(3)]
      });
    });
    it('getByBundleAndEduContentId() should return only the unlockedContent with the given ids', () => {
      unlockedContentStateWithIds = createState(
        [
          createUnlockedContentWithIds(11, 3, 1, 1),
          createUnlockedContentWithIds(21, 8, 5, 55),
          createUnlockedContentWithIds(31, 3, 9, 109),
          createUnlockedContentWithIds(41, 8, 1, 163),
          createUnlockedContentWithIds(51, 3, 5, 217),
          createUnlockedContentWithIds(61, 8, 9, 271)
        ],
        true,
        'no error'
      );
      storeStateWithIds = {
        unlockedContents: unlockedContentStateWithIds
      };
      const results = UnlockedContentQueries.getByBundleAndEduContentId(
        storeStateWithIds,
        { bundleId: 3, eduContentId: 9 }
      );
      expect(results).toEqual(createUnlockedContentWithIds(31, 3, 9, 109));
    });
    it('getByBundleAndUserContentId() should return only the unlockedContent with the given ids', () => {
      unlockedContentStateWithIds = createState(
        [
          createUnlockedContentWithIds(11, 3, 1, 1),
          createUnlockedContentWithIds(21, 8, 5, 55),
          createUnlockedContentWithIds(31, 3, 9, 109),
          createUnlockedContentWithIds(41, 8, 1, 163),
          createUnlockedContentWithIds(51, 3, 5, 217),
          createUnlockedContentWithIds(61, 8, 9, 271)
        ],
        true,
        'no error'
      );
      storeStateWithIds = {
        unlockedContents: unlockedContentStateWithIds
      };
      const results = UnlockedContentQueries.getByBundleAndUserContentId(
        storeStateWithIds,
        { bundleId: 8, userContentId: 163 }
      );
      expect(results).toEqual(createUnlockedContentWithIds(41, 8, 1, 163));
    });
  });
});
