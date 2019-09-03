import { UnlockedFreePracticeQueries } from '.';
import { UnlockedFreePracticeFixture } from '../../+fixtures/UnlockedFreePractice.fixture';
import { UnlockedFreePracticeInterface } from '../../+models';
import { State } from './unlocked-free-practice.reducer';

describe('UnlockedFreePractice Selectors', () => {
  function createUnlockedFreePractice(
    id: number
  ): UnlockedFreePracticeInterface | any {
    return {
      id: id
    };
  }

  function createState(
    unlockedFreePractices: UnlockedFreePracticeInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: unlockedFreePractices
        ? unlockedFreePractices.map(
            unlockedFreePractice => unlockedFreePractice.id
          )
        : [],
      entities: unlockedFreePractices
        ? unlockedFreePractices.reduce(
            (entityMap, unlockedFreePractice) => ({
              ...entityMap,
              [unlockedFreePractice.id]: unlockedFreePractice
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let unlockedFreePracticeState: State;
  let storeState: any;

  describe('UnlockedFreePractice Selectors', () => {
    beforeEach(() => {
      unlockedFreePracticeState = createState(
        [
          createUnlockedFreePractice(4),
          createUnlockedFreePractice(1),
          createUnlockedFreePractice(2),
          createUnlockedFreePractice(3)
        ],
        true,
        'no error'
      );
      storeState = { unlockedFreePractices: unlockedFreePracticeState };
    });
    it('getError() should return the error', () => {
      const results = UnlockedFreePracticeQueries.getError(storeState);
      expect(results).toBe(unlockedFreePracticeState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = UnlockedFreePracticeQueries.getLoaded(storeState);
      expect(results).toBe(unlockedFreePracticeState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = UnlockedFreePracticeQueries.getAll(storeState);
      expect(results).toEqual([
        createUnlockedFreePractice(4),
        createUnlockedFreePractice(1),
        createUnlockedFreePractice(2),
        createUnlockedFreePractice(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = UnlockedFreePracticeQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = UnlockedFreePracticeQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = UnlockedFreePracticeQueries.getAllEntities(storeState);
      expect(results).toEqual(unlockedFreePracticeState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = UnlockedFreePracticeQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createUnlockedFreePractice(3),
        createUnlockedFreePractice(1),
        undefined,
        createUnlockedFreePractice(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = UnlockedFreePracticeQueries.getById(storeState, {
        id: 2
      });
      expect(results).toEqual(createUnlockedFreePractice(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = UnlockedFreePracticeQueries.getById(storeState, {
        id: 9
      });
      expect(results).toBe(undefined);
    });
  });

  describe('find', () => {
    const unlockedFreePractices = [
      new UnlockedFreePracticeFixture({
        id: 1,
        classGroupId: 1,
        eduContentTOCId: 11,
        eduContentBookId: undefined
      }),
      new UnlockedFreePracticeFixture({
        id: 2,
        classGroupId: 2,
        eduContentTOCId: 11,
        eduContentBookId: undefined
      }),
      new UnlockedFreePracticeFixture({
        id: 3,
        classGroupId: 1,
        eduContentTOCId: 12,
        eduContentBookId: undefined
      }),
      new UnlockedFreePracticeFixture({
        id: 4,
        classGroupId: 1,
        eduContentTOCId: undefined,
        eduContentBookId: 21
      }),
      new UnlockedFreePracticeFixture({
        id: 5,
        classGroupId: 2,
        eduContentTOCId: undefined,
        eduContentBookId: 21
      }),
      new UnlockedFreePracticeFixture({
        id: 6,
        classGroupId: 1,
        eduContentTOCId: undefined,
        eduContentBookId: 22
      })
    ];

    beforeEach(() => {
      unlockedFreePracticeState = createState(
        unlockedFreePractices,
        true,
        'no error'
      );
      storeState = {
        unlockedFreePractices: unlockedFreePracticeState
      };
    });

    describe('findMany', () => {
      it('should return all UnlockedFreePractices', () => {
        const results = UnlockedFreePracticeQueries.findMany(storeState, {});
        expect(results.length).toBe(6);
        expect(results).toEqual(unlockedFreePractices);
      });

      it('should return the correct UnlockedFreePractices for ClassGroupId', () => {
        const results = UnlockedFreePracticeQueries.findMany(storeState, {
          classGroupId: 2
        });
        expect(results.length).toBe(2);
        expect(results).toEqual([
          unlockedFreePractices[1],
          unlockedFreePractices[4]
        ]);
      });

      it('should return the correct UnlockedFreePractices for eduContentTOCId and classgroupId', () => {
        const results = UnlockedFreePracticeQueries.findMany(storeState, {
          classGroupId: 1,
          eduContentTOCId: 11
        });
        expect(results.length).toBe(1);
        expect(results).toEqual([unlockedFreePractices[0]]);
      });

      it('should return the correct UnlockedFreePractices for eduContentBookId and classgroupId', () => {
        const results = UnlockedFreePracticeQueries.findMany(storeState, {
          classGroupId: 1,
          eduContentBookId: 21
        });
        expect(results.length).toBe(1);
        expect(results).toEqual([unlockedFreePractices[3]]);
      });
    });

    describe('findOne', () => {
      it('should return the correct UnlockedFreePractice for ClassGroupId', () => {
        const result = UnlockedFreePracticeQueries.findOne(storeState, {
          classGroupId: 2
        });

        expect(result).toEqual(unlockedFreePractices[1]);
      });

      it('should return the correct UnlockedFreePractice for eduContentTOCId and classgroupId', () => {
        const result = UnlockedFreePracticeQueries.findOne(storeState, {
          classGroupId: 1,
          eduContentTOCId: 11
        });

        expect(result).toEqual(unlockedFreePractices[0]);
      });

      it('should return the correct UnlockedFreePractice for userLessonId and classgroupId', () => {
        const result = UnlockedFreePracticeQueries.findOne(storeState, {
          classGroupId: 1,
          eduContentBookId: 22
        });

        expect(result).toEqual(unlockedFreePractices[5]);
      });
    });
  });

  describe('', () => {
    const mockUnlockedFreePractice = [
      new UnlockedFreePracticeFixture({
        id: 4,
        eduContentTOCId: 1,
        eduContentBookId: undefined
      }),
      new UnlockedFreePracticeFixture({
        id: 1,
        eduContentTOCId: 2,
        eduContentBookId: undefined
      }),
      new UnlockedFreePracticeFixture({
        id: 2,
        eduContentTOCId: 1,
        eduContentBookId: undefined
      }),
      new UnlockedFreePracticeFixture({
        id: 3,
        eduContentTOCId: 2,
        eduContentBookId: undefined
      }),
      new UnlockedFreePracticeFixture({ id: 5, eduContentBookId: 1 }),
      new UnlockedFreePracticeFixture({ id: 6, eduContentBookId: 2 }),
      new UnlockedFreePracticeFixture({ id: 8, eduContentBookId: 1 }),
      new UnlockedFreePracticeFixture({ id: 7, eduContentBookId: 2 })
    ];
    beforeEach(() => {
      unlockedFreePracticeState = createState(
        mockUnlockedFreePractice,
        true,
        'no error'
      );
      storeState = { unlockedFreePractices: unlockedFreePracticeState };
    });

    it('getGroupedByEduContentTOCId() should return entities grouped by eduContentTOCId', () => {
      const results = UnlockedFreePracticeQueries.getGroupedByEduContentTOCId(
        storeState
      );
      expect(results).toEqual({
        1: [mockUnlockedFreePractice[2], mockUnlockedFreePractice[0]],
        2: [mockUnlockedFreePractice[1], mockUnlockedFreePractice[3]]
      });
    });

    it('getGroupedByEduContentBookId() should return entities grouped by eduContentBookId', () => {
      const results = UnlockedFreePracticeQueries.getGroupedByEduContentBookId(
        storeState
      );
      expect(results).toEqual({
        1: [mockUnlockedFreePractice[4], mockUnlockedFreePractice[6]],
        2: [mockUnlockedFreePractice[5], mockUnlockedFreePractice[7]]
      });
    });
  });
});
