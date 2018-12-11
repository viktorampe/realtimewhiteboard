import { ResultQueries } from '.';
import { ResultFixture } from '../../+fixtures';
import { ResultInterface } from '../../+models';
import { State } from './result.reducer';

describe('Result Selectors', () => {
  function createResult(id: number): ResultInterface | any {
    return {
      id: id
    };
  }

  function createState(
    results: ResultInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: results ? results.map(result => result.id) : [],
      entities: results
        ? results.reduce(
            (entityMap, result) => ({
              ...entityMap,
              [result.id]: result
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let resultState: State;
  let storeState: any;

  describe('Result Selectors', () => {
    beforeEach(() => {
      resultState = createState(
        [createResult(4), createResult(1), createResult(2), createResult(3)],
        true,
        'no error'
      );
      storeState = { results: resultState };
    });
    it('getError() should return the error', () => {
      const results = ResultQueries.getError(storeState);
      expect(results).toBe(resultState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = ResultQueries.getLoaded(storeState);
      expect(results).toBe(resultState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = ResultQueries.getAll(storeState);
      expect(results).toEqual([
        createResult(4),
        createResult(1),
        createResult(2),
        createResult(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = ResultQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = ResultQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = ResultQueries.getAllEntities(storeState);
      expect(results).toEqual(resultState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = ResultQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createResult(3),
        createResult(1),
        undefined,
        createResult(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = ResultQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createResult(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = ResultQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });

    it('getByTaskIdGroupedByEduContentId() should return grouped results', () => {
      const mockData = [
        new ResultFixture({ id: 1, taskId: 1, eduContentId: 1 }),
        new ResultFixture({ id: 2, taskId: 1, eduContentId: 1 }),
        new ResultFixture({ id: 3, taskId: 1, eduContentId: 2 }),
        new ResultFixture({ id: 4, taskId: 2, eduContentId: 1 })
      ];

      resultState = createState(mockData, true, 'no error');
      storeState = { results: resultState };

      const results = ResultQueries.getByTaskIdGroupedByEduContentId(
        storeState,
        { taskId: 1 }
      );

      const expected = {
        1: mockData.filter(
          result => result.taskId === 1 && result.eduContentId === 1
        ),
        2: mockData.filter(
          result => result.taskId === 1 && result.eduContentId === 2
        )
      };

      expect(results).toEqual(expected);
    });
  });
});
