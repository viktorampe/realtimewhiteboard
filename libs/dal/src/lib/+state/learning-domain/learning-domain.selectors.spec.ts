import { LearningDomainQueries } from '.';
import { LearningDomainFixture } from '../../+fixtures';
import { LearningDomainInterface } from '../../+models';
import { State } from './learning-domain.reducer';

describe('LearningDomain Selectors', () => {
  function createLearningDomain(id: number): LearningDomainInterface | any {
    return {
      id: id
    };
  }

  function createState(
    learningDomains: LearningDomainInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: learningDomains
        ? learningDomains.map(learningDomain => learningDomain.id)
        : [],
      entities: learningDomains
        ? learningDomains.reduce(
            (entityMap, learningDomain) => ({
              ...entityMap,
              [learningDomain.id]: learningDomain
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let learningDomainState: State;
  let storeState: any;

  describe('LearningDomain Selectors', () => {
    beforeEach(() => {
      learningDomainState = createState(
        [
          createLearningDomain(4),
          createLearningDomain(1),
          createLearningDomain(2),
          createLearningDomain(3)
        ],
        true,
        'no error'
      );
      storeState = { learningDomains: learningDomainState };
    });
    it('getError() should return the error', () => {
      const results = LearningDomainQueries.getError(storeState);
      expect(results).toBe(learningDomainState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = LearningDomainQueries.getLoaded(storeState);
      expect(results).toBe(learningDomainState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = LearningDomainQueries.getAll(storeState);
      expect(results).toEqual([
        createLearningDomain(4),
        createLearningDomain(1),
        createLearningDomain(2),
        createLearningDomain(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = LearningDomainQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = LearningDomainQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = LearningDomainQueries.getAllEntities(storeState);
      expect(results).toEqual(learningDomainState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = LearningDomainQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createLearningDomain(3),
        createLearningDomain(1),
        undefined,
        createLearningDomain(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = LearningDomainQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createLearningDomain(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = LearningDomainQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });

    it('getByLearningArea() should return all learningDomains with the provided learningAreaId', () => {
      learningDomainState = createState(
        [
          new LearningDomainFixture({ id: 1, learningAreaId: 10 }),
          new LearningDomainFixture({ id: 2, learningAreaId: 12 }),
          new LearningDomainFixture({ id: 3, learningAreaId: 11 }),
          new LearningDomainFixture({ id: 4, learningAreaId: 10 })
        ],
        true,
        'no error'
      );

      storeState = { learningDomains: learningDomainState };

      const results = LearningDomainQueries.getByLearningArea(storeState, {
        learningAreaId: 10
      });

      expect(results).toEqual([
        new LearningDomainFixture({ id: 1, learningAreaId: 10 }),
        new LearningDomainFixture({ id: 4, learningAreaId: 10 })
      ]);
    });

    it('getByLearningAreas() should return all learningDomains with the provided learningAreaIds', () => {
      learningDomainState = createState(
        [
          new LearningDomainFixture({ id: 1, learningAreaId: 10 }),
          new LearningDomainFixture({ id: 2, learningAreaId: 12 }),
          new LearningDomainFixture({ id: 3, learningAreaId: 11 }),
          new LearningDomainFixture({ id: 4, learningAreaId: 10 })
        ],
        true,
        'no error'
      );

      storeState = { learningDomains: learningDomainState };

      const results = LearningDomainQueries.getByLearningAreas(storeState, {
        learningAreaIds: [10, 11]
      });

      expect(results).toEqual([
        new LearningDomainFixture({ id: 1, learningAreaId: 10 }),
        new LearningDomainFixture({ id: 3, learningAreaId: 11 }),
        new LearningDomainFixture({ id: 4, learningAreaId: 10 })
      ]);
    });
  });
});
