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

    describe('getAssignmentsForLearningAreaId()', () => {
      it('should return a dictionary of results grouped by taskId', () => {
        // moved to bottom of file for readability
        const mockData: ResultInterface[] = getMockTaskResults();

        resultState = createState(mockData, true, 'no error');
        storeState = { results: resultState };

        const results = ResultQueries.getResultsForLearningAreaIdGrouped(
          storeState,
          { learningAreaId: 1, groupProp: { taskId: 0 } }
        );

        const expected = {
          1: mockData.filter(
            result => result.learningAreaId === 1 && result.taskId === 1
          ),
          2: mockData.filter(
            result => result.learningAreaId === 1 && result.taskId === 2
          )
        };

        expect(results).toEqual(expected);
      });

      it('should return a dictionary of results grouped by bundleId', () => {
        // moved to bottom of file for readability
        const mockData: ResultInterface[] = getMockBundleResults();

        resultState = createState(mockData, true, 'no error');
        storeState = { results: resultState };

        const results = ResultQueries.getResultsForLearningAreaIdGrouped(
          storeState,
          { learningAreaId: 1, groupProp: { bundleId: 0 } }
        );

        const expected = {
          1: mockData.filter(
            result => result.learningAreaId === 1 && result.bundleId === 1
          ),
          2: mockData.filter(
            result => result.learningAreaId === 1 && result.bundleId === 2
          )
        };

        expect(results).toEqual(expected);
      });
    });

    describe('getResultsForLearningAreaIdGrouped()', () => {
      it('should return the results grouped by learning area', () => {
        const mockData: ResultInterface[] = [
          ...getMockTaskResults(),
          ...getMockBundleResults()
        ];
        resultState = createState(mockData, true, 'no error');
        storeState = { results: resultState };

        const results = ResultQueries.getResultsGroupedByArea(storeState);
        const expected = {
          1: [
            ...getMockTaskResults().filter(
              result => result.learningAreaId === 1
            ),
            ...getMockBundleResults().filter(
              result => result.learningAreaId === 1
            )
          ],
          2: [
            ...getMockTaskResults().filter(
              result => result.learningAreaId === 2
            ),
            ...getMockBundleResults().filter(
              result => result.learningAreaId === 2
            )
          ]
        };

        expect(results).toEqual(expected);
      });
    });
  });

  describe('getBestResultByEduContentId', () => {
    const mockResults = [
      new ResultFixture({ id: 1, eduContentId: 10, score: 100 }),
      new ResultFixture({ id: 2, eduContentId: 10, score: 50 }),
      new ResultFixture({ id: 3, eduContentId: 12, score: 30 }),
      new ResultFixture({ id: 4, eduContentId: 10, score: 0 }),
      new ResultFixture({ id: 5, eduContentId: 10, score: undefined }),
      new ResultFixture({ id: 6, eduContentId: 11, score: undefined }),
      new ResultFixture({ id: 7, eduContentId: 11, score: 0 }),
      new ResultFixture({ id: 8, eduContentId: 12, score: undefined }),
      new ResultFixture({ id: 9, eduContentId: 11, score: 50 }),
      new ResultFixture({ id: 10, eduContentId: 12, score: 95 }),
      new ResultFixture({ id: 11, eduContentId: 11, score: 100 }),
      new ResultFixture({ id: 12, eduContentId: 12, score: 0 }),
      new ResultFixture({ id: 13, eduContentId: 11, score: 100 }),
      new ResultFixture({ id: 14, eduContentId: 13, score: undefined }),
      new ResultFixture({ id: 15, eduContentId: 13, score: 0 }),
      new ResultFixture({ id: 16, eduContentId: 14, score: undefined })
    ];

    beforeEach(() => {
      resultState = createState(mockResults, true, 'no error');
      storeState = { results: resultState };
    });

    it('should return the best results per eduContentId', () => {
      const result = ResultQueries.getBestResultByEduContentId(storeState);
      expect(result).toEqual({
        10: mockResults[0],
        11: mockResults[10],
        12: mockResults[9],
        13: mockResults[14],
        14: mockResults[15]
      });
    });
  });
});

function getMockTaskResults(): ResultInterface[] {
  return [
    new ResultFixture({
      id: 1,
      learningAreaId: 1,
      taskId: 1,
      score: 10,
      eduContentId: 1,
      assignment: 'foo'
    }),
    new ResultFixture({
      id: 2,
      learningAreaId: 1,
      taskId: 1,
      score: 50,
      eduContentId: 2,
      assignment: 'foo'
    }),
    new ResultFixture({
      id: 3,
      learningAreaId: 1,
      taskId: 2,
      score: 100,
      eduContentId: 1,
      assignment: 'bar'
    }),
    new ResultFixture({
      id: 4,
      learningAreaId: 2,
      taskId: 1,
      score: 75,
      eduContentId: 1,
      assignment: 'foo'
    }),
    new ResultFixture({
      id: 5,
      learningAreaId: 1,
      unlockedContentId: 1,
      taskId: null,
      score: 0,
      eduContentId: 1,
      assignment: 'foo bar'
    })
  ];
}

function getMockBundleResults(): ResultInterface[] {
  return [
    new ResultFixture({
      id: 6,
      learningAreaId: 1,
      bundleId: 1,
      score: 10,
      eduContentId: 1,
      assignment: 'foo'
    }),
    new ResultFixture({
      id: 7,
      learningAreaId: 1,
      bundleId: 1,
      score: 50,
      eduContentId: 2,
      assignment: 'foo'
    }),
    new ResultFixture({
      id: 8,
      learningAreaId: 1,
      bundleId: 2,
      score: 100,
      eduContentId: 1,
      assignment: 'bar'
    }),
    new ResultFixture({
      id: 9,
      learningAreaId: 2,
      bundleId: 1,
      score: 75,
      eduContentId: 1,
      assignment: 'foo'
    }),
    new ResultFixture({
      id: 10,
      learningAreaId: 1,
      unlockedContentId: 1,
      taskId: 1,
      bundleId: null,
      score: 0,
      eduContentId: 1,
      assignment: 'foo bar'
    }),
    new ResultFixture({
      id: 11,
      learningAreaId: 1,
      bundleId: 1,
      score: 90,
      eduContentId: 1,
      assignment: 'foo'
    })
  ];
}
