import { ResultQueries } from '.';
import { ResultFixture } from '../../+fixtures';
import { ResultInterface } from '../../+models';
import { State } from './result.reducer';
import { getExerciseResults } from './result.selectors';

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

    it('getTaskAssignmentsForLearningAreaId() should return Assignments', () => {
      const mockData: ResultInterface[] = [
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

      resultState = createState(mockData, true, 'no error');
      storeState = { results: resultState };

      const results = ResultQueries.getTaskAssignmentsForLearningAreaId(
        storeState,
        { learningAreaId: 1 }
      );

      const expected = [
        {
          title: mockData[0].assignment,
          type: 'task',
          totalScore: 30,
          exerciseResults: [
            {
              eduContentId: 1,
              results: [mockData[0]],
              bestResult: mockData[0],
              averageScore: mockData[0].score
            },
            {
              eduContentId: 2,
              results: [mockData[1]],
              bestResult: mockData[1],
              averageScore: mockData[1].score
            }
          ]
        },
        {
          title: mockData[2].assignment,
          type: 'task',
          totalScore: mockData[2].score,
          exerciseResults: [
            {
              eduContentId: 1,
              results: [mockData[2]],
              bestResult: mockData[2],
              averageScore: mockData[2].score
            }
          ]
        }
      ];

      expect(results).toEqual(expected);
    });

    it('getBundleAssignmentsForLearningAreaId() should return Assignments', () => {
      const mockData: ResultInterface[] = [
        new ResultFixture({
          id: 1,
          learningAreaId: 1,
          bundleId: 1,
          score: 10,
          eduContentId: 1,
          assignment: 'foo'
        }),
        new ResultFixture({
          id: 2,
          learningAreaId: 1,
          bundleId: 1,
          score: 50,
          eduContentId: 2,
          assignment: 'foo'
        }),
        new ResultFixture({
          id: 3,
          learningAreaId: 1,
          bundleId: 2,
          score: 100,
          eduContentId: 1,
          assignment: 'bar'
        }),
        new ResultFixture({
          id: 4,
          learningAreaId: 2,
          bundleId: 1,
          score: 75,
          eduContentId: 1,
          assignment: 'foo'
        }),
        new ResultFixture({
          id: 5,
          learningAreaId: 1,
          unlockedContentId: 1,
          taskId: 1,
          bundleId: null,
          score: 0,
          eduContentId: 1,
          assignment: 'foo bar'
        }),
        new ResultFixture({
          id: 6,
          learningAreaId: 1,
          bundleId: 1,
          score: 90,
          eduContentId: 1,
          assignment: 'foo'
        })
      ];

      resultState = createState(mockData, true, 'no error');
      storeState = { results: resultState };

      const results = ResultQueries.getBundleAssignmentsForLearningAreaId(
        storeState,
        { learningAreaId: 1 }
      );

      const expected = [
        {
          title: mockData[0].assignment,
          type: 'bundle',
          totalScore: 70,
          exerciseResults: [
            {
              eduContentId: 1,
              results: [mockData[0], mockData[5]],
              bestResult: mockData[5],
              averageScore: (mockData[0].score + mockData[5].score) / 2
            },
            {
              eduContentId: 2,
              results: [mockData[1]],
              bestResult: mockData[1],
              averageScore: mockData[1].score
            }
          ]
        },
        {
          title: mockData[2].assignment,
          type: 'bundle',
          totalScore: mockData[2].score,
          exerciseResults: [
            {
              eduContentId: 1,
              results: [mockData[2]],
              bestResult: mockData[2],
              averageScore: mockData[2].score
            }
          ]
        }
      ];

      expect(results).toEqual(expected);
    });
  });

  describe('internal methods', () => {
    it('getExerciseResults should return correct values', () => {
      const mockResults = [
        new ResultFixture({ id: 1, eduContentId: 1, score: 10 }),
        new ResultFixture({ id: 2, eduContentId: 1, score: 50 }),
        new ResultFixture({ id: 3, eduContentId: 20, score: 80 })
      ];

      const returnedValue = getExerciseResults(mockResults);

      const expectedValue = {
        totalScore: 65,
        exerciseResults: [
          {
            eduContentId: mockResults[0].eduContentId,
            results: [mockResults[0], mockResults[1]],
            bestResult: mockResults[1],
            averageScore: 30
          },
          {
            eduContentId: mockResults[2].eduContentId,
            results: [mockResults[2]],
            bestResult: mockResults[2],
            averageScore: 80
          }
        ]
      };

      expect(returnedValue).toEqual(expectedValue);
    });
  });
});
