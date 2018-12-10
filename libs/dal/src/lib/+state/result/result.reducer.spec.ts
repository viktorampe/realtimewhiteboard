import { Update } from '@ngrx/entity';
import {ResultActions } from '.';
import { initialState, reducer, State } from './result.reducer';
import { ResultInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the Result entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a Result.
 * @param {number} id
 * @returns {ResultInterface}
 */
function createResult(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): ResultInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
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
    results = [
      createResult(1),
      createResult(2),
      createResult(3)
    ];
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should load all results', () => {
      const action = new ResultActions.ResultsLoaded({ results });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(results, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new ResultActions.ResultsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one result', () => {
      const result = results[0];
      const action = new ResultActions.AddResult({
        result
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([result], false));
    });

    it('should add multiple results', () => {
      const action = new ResultActions.AddResults({ results });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(results, false));
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

    
      const updatedResult = createResult(results[0].id, 'test');
     
      const action = new ResultActions.UpsertResult({
        result: updatedResult
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedResult.id]).toEqual(updatedResult);
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

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(resultsToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an result', () => {
      const result = results[0];
      const startState = createState([result]);
      const update: Update<ResultInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new ResultActions.UpdateResult({
        result: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createResult(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple results', () => {
      const startState = createState(results);
      const updates: Update<ResultInterface>[] = [
        
        {
          id: 1,
          changes: {
            __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
          } 
        },
        {
          id: 2,
          changes: {
            __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
          }  
        }
      ];
      const action = new ResultActions.UpdateResults({
        results: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createResult(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createResult(2, __EXTRA__PROPERTY_NAMEUpdatedValue), results[2]])
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
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple results', () => {
      const startState = createState(results);
      const action = new ResultActions.DeleteResults({
        ids: [results[0].id, results[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([results[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the results collection', () => {
      const startState = createState(results, true, 'something went wrong');
      const action = new ResultActions.ClearResults();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
