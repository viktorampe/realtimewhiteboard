import { Update } from '@ngrx/entity';
import { ResultActions } from '.';
import { ResultInterface } from '../../+models';
import { initialState, reducer, State } from './result.reducer';

const scoreInitialValue = 0;
const scoreUpdatedValue = 100;

/**
 * Creates a Result.
 * @param {number} id
 * @returns {ResultInterface}
 */
function createResult(
  id: number,
  score: number = scoreInitialValue
): ResultInterface | any {
  return {
    id: id,
    score: score
  };
}

/**
 * Utility to create the result state.
 *
 * @param {ResultInterface[]} results
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  results: ResultInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
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
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('Results Reducer', () => {
  let results: ResultInterface[];
  beforeEach(() => {
    results = [createResult(1), createResult(2), createResult(3)];
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const resultState = reducer(initialState, action);

      expect(resultState).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should load all results', () => {
      const action = new ResultActions.ResultsLoaded({ results });
      const resultState = reducer(initialState, action);
      expect(resultState).toEqual(createState(results, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new ResultActions.ResultsLoadError(error);
      const resultState = reducer(initialState, action);
      expect(resultState).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one result', () => {
      const result = results[0];
      const action = new ResultActions.AddResult({
        result
      });

      const resultState = reducer(initialState, action);
      expect(resultState).toEqual(createState([result], false));
    });

    it('should add multiple results', () => {
      const action = new ResultActions.AddResults({ results });
      const resultState = reducer(initialState, action);

      expect(resultState).toEqual(createState(results, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one result', () => {
      const originalResult = results[0];

      const startState = reducer(
        initialState,
        new ResultActions.AddResult({
          result: originalResult
        })
      );

      const updatedResult = createResult(results[0].id, scoreUpdatedValue);

      const action = new ResultActions.UpsertResult({
        result: updatedResult
      });

      const resultState = reducer(startState, action);

      expect(resultState.entities[updatedResult.id]).toEqual(updatedResult);
    });

    it('should upsert many results', () => {
      const startState = createState(results);

      const resultsToInsert = [
        createResult(1),
        createResult(2),
        createResult(3),
        createResult(4)
      ];
      const action = new ResultActions.UpsertResults({
        results: resultsToInsert
      });

      const resultState = reducer(startState, action);

      expect(resultState).toEqual(createState(resultsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an result', () => {
      const result = results[0];
      const startState = createState([result]);
      const update: Update<ResultInterface> = {
        id: 1,
        changes: {
          score: scoreUpdatedValue
        }
      };
      const action = new ResultActions.UpdateResult({
        result: update
      });
      const resultState = reducer(startState, action);
      expect(resultState).toEqual(
        createState([createResult(1, scoreUpdatedValue)])
      );
    });

    it('should update multiple results', () => {
      const startState = createState(results);
      const updates: Update<ResultInterface>[] = [
        {
          id: 1,
          changes: {
            score: scoreUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            score: scoreUpdatedValue
          }
        }
      ];
      const action = new ResultActions.UpdateResults({
        results: updates
      });
      const resultState = reducer(startState, action);

      expect(resultState).toEqual(
        createState([
          createResult(1, scoreUpdatedValue),
          createResult(2, scoreUpdatedValue),
          results[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one result ', () => {
      const result = results[0];
      const startState = createState([result]);
      const action = new ResultActions.DeleteResult({
        id: result.id
      });
      const resultState = reducer(startState, action);
      expect(resultState).toEqual(createState([]));
    });

    it('should delete multiple results', () => {
      const startState = createState(results);
      const action = new ResultActions.DeleteResults({
        ids: [results[0].id, results[1].id]
      });
      const resultState = reducer(startState, action);
      expect(resultState).toEqual(createState([results[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the results collection', () => {
      const startState = createState(results, true, 'something went wrong');
      const action = new ResultActions.ClearResults();
      const resultState = reducer(startState, action);
      expect(resultState).toEqual(
        createState([], true, 'something went wrong')
      );
    });
  });
});
