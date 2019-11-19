import { Update } from '@ngrx/entity';
import {MethodLevelActions } from '.';
import { initialState, reducer, State } from './method-level.reducer';
import { MethodLevelInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the MethodLevel entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a MethodLevel.
 * @param {number} id
 * @returns {MethodLevelInterface}
 */
function createMethodLevel(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): MethodLevelInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the method-level state.
 *
 * @param {MethodLevelInterface[]} methodLevels
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  methodLevels: MethodLevelInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: methodLevels ? methodLevels.map(methodLevel => methodLevel.id) : [],
    entities: methodLevels
      ? methodLevels.reduce(
          (entityMap, methodLevel) => ({
            ...entityMap,
            [methodLevel.id]: methodLevel
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('MethodLevels Reducer', () => {
  let methodLevels: MethodLevelInterface[];
  beforeEach(() => {
    methodLevels = [
      createMethodLevel(1),
      createMethodLevel(2),
      createMethodLevel(3)
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
    it('should load all methodLevels', () => {
      const action = new MethodLevelActions.MethodLevelsLoaded({ methodLevels });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(methodLevels, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new MethodLevelActions.MethodLevelsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one methodLevel', () => {
      const methodLevel = methodLevels[0];
      const action = new MethodLevelActions.AddMethodLevel({
        methodLevel
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([methodLevel], false));
    });

    it('should add multiple methodLevels', () => {
      const action = new MethodLevelActions.AddMethodLevels({ methodLevels });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(methodLevels, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one methodLevel', () => {
      const originalMethodLevel = methodLevels[0];
      
      const startState = reducer(
        initialState,
        new MethodLevelActions.AddMethodLevel({
          methodLevel: originalMethodLevel
        })
      );

    
      const updatedMethodLevel = createMethodLevel(methodLevels[0].id, 'test');
     
      const action = new MethodLevelActions.UpsertMethodLevel({
        methodLevel: updatedMethodLevel
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedMethodLevel.id]).toEqual(updatedMethodLevel);
    });

    it('should upsert many methodLevels', () => {
      const startState = createState(methodLevels);

      const methodLevelsToInsert = [
        createMethodLevel(1),
        createMethodLevel(2),
        createMethodLevel(3),
        createMethodLevel(4)
      ];
      const action = new MethodLevelActions.UpsertMethodLevels({
        methodLevels: methodLevelsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(methodLevelsToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an methodLevel', () => {
      const methodLevel = methodLevels[0];
      const startState = createState([methodLevel]);
      const update: Update<MethodLevelInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new MethodLevelActions.UpdateMethodLevel({
        methodLevel: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createMethodLevel(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple methodLevels', () => {
      const startState = createState(methodLevels);
      const updates: Update<MethodLevelInterface>[] = [
        
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
      const action = new MethodLevelActions.UpdateMethodLevels({
        methodLevels: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createMethodLevel(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createMethodLevel(2, __EXTRA__PROPERTY_NAMEUpdatedValue), methodLevels[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one methodLevel ', () => {
      const methodLevel = methodLevels[0];
      const startState = createState([methodLevel]);
      const action = new MethodLevelActions.DeleteMethodLevel({
        id: methodLevel.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple methodLevels', () => {
      const startState = createState(methodLevels);
      const action = new MethodLevelActions.DeleteMethodLevels({
        ids: [methodLevels[0].id, methodLevels[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([methodLevels[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the methodLevels collection', () => {
      const startState = createState(methodLevels, true, 'something went wrong');
      const action = new MethodLevelActions.ClearMethodLevels();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
