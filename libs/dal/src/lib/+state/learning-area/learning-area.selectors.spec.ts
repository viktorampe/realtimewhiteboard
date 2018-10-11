import { LearningAreaQueries } from '.';
import { LearningAreaInterface } from '../../+models';
import { State } from './learning-area.reducer';

describe('LearningArea Selectors', () => {
  function createLearningArea(id: number): LearningAreaInterface | any {
    return {
      id: id
    };
  }

  function createState(
    learningAreas: LearningAreaInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: learningAreas
        ? learningAreas.map(learningArea => learningArea.id)
        : [],
      entities: learningAreas
        ? learningAreas.reduce(
            (entityMap, learningArea) => ({
              ...entityMap,
              [learningArea.id]: learningArea
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let learningAreaState: State;
  let storeState: any;

  describe('LearningArea Selectors', () => {
    beforeEach(() => {
      learningAreaState = createState(
        [
          createLearningArea(4),
          createLearningArea(1),
          createLearningArea(2),
          createLearningArea(3)
        ],
        true,
        'no error'
      );
      storeState = { learningAreas: learningAreaState };
    });
    it('getError() should return the error', () => {
      const results = LearningAreaQueries.getError(storeState);
      expect(results).toBe(learningAreaState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = LearningAreaQueries.getLoaded(storeState);
      expect(results).toBe(learningAreaState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = LearningAreaQueries.getAll(storeState);
      expect(results).toEqual([
        createLearningArea(4),
        createLearningArea(1),
        createLearningArea(2),
        createLearningArea(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = LearningAreaQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = LearningAreaQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = LearningAreaQueries.getAllEntities(storeState);
      expect(results).toEqual(learningAreaState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = LearningAreaQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createLearningArea(3),
        createLearningArea(1),
        undefined,
        createLearningArea(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = LearningAreaQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createLearningArea(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = LearningAreaQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
